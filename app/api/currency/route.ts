import { NextResponse } from 'next/server';

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
    const convertedAmount = parseFloat(amount) * rate;

    return NextResponse.json({ convertedAmount, currency: to.toUpperCase() });

  } catch (error) {
    console.error('[CURRENCY_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to convert currency' }, { status: 500 });
  }
}
