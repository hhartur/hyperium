import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, texts, targetLang } = body;

    if (!targetLang) {
      return NextResponse.json({ error: 'Missing required parameter: targetLang' }, { status: 400 });
    }

    // Support both single text and batch texts
    const textsToTranslate = texts || (text ? [text] : []);
    if (textsToTranslate.length === 0) {
      return NextResponse.json({ error: 'Missing required parameters: text or texts' }, { status: 400 });
    }

    // Map languages to MyMemory API format
    const langMap: { [key: string]: string } = {
      'pt-br': 'pt-PT',
      'pt-pt': 'pt-PT',
      'es': 'es',
      'en': 'en'
    };

    const mappedTargetLang = langMap[targetLang.toLowerCase()] || targetLang.split('-')[0];

    // The MyMemory API uses 'en' for English, but some locales might be 'en-US'. We'll standardize to 'en'.
    const sourceLang = 'en';

    const translatedTexts: string[] = [];

    // Process each text (for batch, translate one by one to avoid API limits)
    for (const textItem of textsToTranslate) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textItem)}&langpair=${sourceLang}|${mappedTargetLang}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch translation from MyMemory API');
      }

      const data = await response.json();

      if (data.responseStatus !== 200) {
        // On error, return original text
        translatedTexts.push(textItem);
      } else {
        translatedTexts.push(data.responseData.translatedText);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Return single text for backward compatibility, or array for batch
    if (text) {
      return NextResponse.json({ translatedText: translatedTexts[0] });
    } else {
      return NextResponse.json({ translatedTexts });
    }

  } catch (error) {
    console.error('[TRANSLATE_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
