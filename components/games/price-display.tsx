'use client';

import { useState, useEffect } from 'react';

interface PriceDisplayProps {
  price: number;
  discountPrice?: number | null;
  lang: string;
}

const localeCurrencyMap: { [key: string]: string } = {
  'en': 'USD',
  'pt-br': 'BRL',
  'es': 'EUR',
};

const currencySymbols: { [key: string]: string } = {
  'USD': '$',
  'BRL': 'R$',
  'EUR': '€',
};

export function PriceDisplay({ price, discountPrice, lang }: PriceDisplayProps) {
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [convertedDiscountPrice, setConvertedDiscountPrice] = useState<number | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetCurrency = localeCurrencyMap[lang.toLowerCase()] || 'USD';

    const formatCurrency = (amount: number, currency: string) => {
      try {
        return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(amount);
      } catch (e) {
        // Fallback for unsupported locales/currencies
        const symbol = currencySymbols[currency] || currency;
        return `${symbol} ${amount.toFixed(2)}`;
      }
    };

    const convertCurrency = async () => {
      setLoading(true);
      if (targetCurrency === 'USD') {
        setConvertedPrice(price);
        setConvertedDiscountPrice(discountPrice || null);
        setCurrencySymbol(currencySymbols['USD']);
        setLoading(false);
        return;
      }

      try {
        const priceToConvert = discountPrice ?? price;
        const res = await fetch(`/api/currency?amount=${priceToConvert}&to=${targetCurrency}`);
        const data = await res.json();
        
        if (data.convertedAmount) {
            if (discountPrice) {
                const originalRes = await fetch(`/api/currency?amount=${price}&to=${targetCurrency}`);
                const originalData = await originalRes.json();
                setConvertedPrice(originalData.convertedAmount);
                setConvertedDiscountPrice(data.convertedAmount);
            } else {
                setConvertedPrice(data.convertedAmount);
            }
            setCurrencySymbol(currencySymbols[targetCurrency]);
        }
      } catch (error) {
        console.error("Failed to convert currency", error);
        // Fallback to USD on error
        setConvertedPrice(price);
        setConvertedDiscountPrice(discountPrice || null);
        setCurrencySymbol(currencySymbols['USD']);
      } finally {
        setLoading(false);
      }
    };

    convertCurrency();
  }, [price, discountPrice, lang]);

  const formatDisplayPrice = (amount: number | null) => {
      if (amount === null) return null;
      return new Intl.NumberFormat(lang, { style: 'currency', currency: localeCurrencyMap[lang.toLowerCase()] || 'USD' }).format(amount);
  }

  if (loading) {
    return <span className="text-2xl font-bold">Loading price...</span>;
  }

  return (
    <div>
      {convertedDiscountPrice !== null ? (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-600">
            {formatDisplayPrice(convertedDiscountPrice)}
          </span>
          <span className="text-base text-muted-foreground line-through">
            {formatDisplayPrice(convertedPrice)}
          </span>
        </div>
      ) : (
        <span className="text-xl font-bold">
          {formatDisplayPrice(convertedPrice)}
        </span>
      )}
    </div>
  );
}
