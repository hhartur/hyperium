import { NextResponse } from 'next/server';

const exchangeRateCache: { [key: string]: { rate: number; timestamp: number } } = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const to = searchParams.get('to');
  const from = 'USD'; // Base currency is always USD

  if (!amount || !to) {
    return NextResponse.json({ error: 'Missing required query parameters: amount, to' }, { status: 400 });
  }

  if (to.toUpperCase() === from) {
    return NextResponse.json({ convertedAmount: parseFloat(amount), currency: from });
  }

  const cacheKey = `${from}_${to.toUpperCase()}`;
  const now = Date.now();

  // Check cache first
  if (exchangeRateCache[cacheKey] && (now - exchangeRateCache[cacheKey].timestamp) < CACHE_DURATION) {
    const convertedAmount = parseFloat(amount) * exchangeRateCache[cacheKey].rate;
    return NextResponse.json({ convertedAmount, currency: to.toUpperCase() });
  }

  try {
    // Use exchangerate-api.com as a more reliable alternative
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];
    if (!rate) {
      throw new Error(`Exchange rate for ${to} not found`);
    }

    // Cache the rate
    exchangeRateCache[cacheKey] = { rate, timestamp: now };

    const convertedAmount = parseFloat(amount) * rate;

    return NextResponse.json({ convertedAmount, currency: to.toUpperCase() });

  } catch (error) {
    console.error('[CURRENCY_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to convert currency' }, { status: 500 });
  }
}
