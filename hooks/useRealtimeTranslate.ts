import { useState, useEffect, useRef } from 'react';
import { useI18n } from './useI18n';

// Simple cache to avoid re-translating the same text multiple times in a session
const translationCache = new Map<string, string>();

// Global translation queue to batch requests
let translationQueue: Array<{ text: string; targetLang: string; resolve: (value: string) => void; reject: (reason: any) => void }> = [];
let isProcessingQueue = false;

const processTranslationQueue = async () => {
  if (isProcessingQueue || translationQueue.length === 0) return;

  isProcessingQueue = true;

  // Group by targetLang
  const groupedByLang: { [lang: string]: Array<{ text: string; resolve: (value: string) => void; reject: (reason: any) => void }> } = {};

  translationQueue.forEach(item => {
    if (!groupedByLang[item.targetLang]) {
      groupedByLang[item.targetLang] = [];
    }
    groupedByLang[item.targetLang].push(item);
  });

  // Process each language group
  for (const [targetLang, items] of Object.entries(groupedByLang)) {
    const texts = items.map(item => item.text);
    const uniqueTexts = [...new Set(texts)]; // Remove duplicates

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: uniqueTexts, targetLang }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();

      // Map back to original requests
      items.forEach(item => {
        const index = uniqueTexts.indexOf(item.text);
        const translatedText = data.translatedTexts?.[index] || item.text;
        translationCache.set(`${targetLang}:${item.text}`, translatedText);
        item.resolve(translatedText);
      });
    } catch (error) {
      console.error(error);
      items.forEach(item => item.reject(error));
    }
  }

  translationQueue = [];
  isProcessingQueue = false;
};

export function useRealtimeTranslate(text: string) {
  const { i18n } = useI18n();
  const [translatedText, setTranslatedText] = useState(text);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const targetLang = i18n.language.split('-')[0]; // Use base language (e.g., 'pt' from 'pt-BR')

    if (!text || targetLang === 'en') {
      setTranslatedText(text);
      return;
    }

    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
      setTranslatedText(translationCache.get(cacheKey)!);
      return;
    }

    let isMounted = true;

    // Add to queue instead of immediate translation
    const promise = new Promise<string>((resolve, reject) => {
      translationQueue.push({ text, targetLang, resolve, reject });
    });

    promise.then(translated => {
      if (isMounted) {
        setTranslatedText(translated);
      }
    }).catch(() => {
      if (isMounted) {
        setTranslatedText(text); // Fallback
      }
    });

    // Debounce queue processing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      processTranslationQueue();
    }, 100); // Process after 100ms of inactivity

    return () => {
      isMounted = false;
    };
  }, [text, i18n.language]);

  return translatedText;
}


