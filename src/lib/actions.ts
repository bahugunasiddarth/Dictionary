'use server';

import { suggestRelatedWords } from '@/ai/flows/suggest-related-words';
import type { DictionaryResponse, WordData } from '@/lib/types';

export async function getWordData(word: string): Promise<WordData | { error: string }> {
  if (!word) {
    return { error: 'Please enter a word.' };
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!response.ok) {
        if (response.status === 404) {
            return { error: 'Word not found. Please check your spelling and try again.' };
        }
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: DictionaryResponse = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return { error: 'Word not found. The dictionary does not have an entry for this word.' };
    }
    
    const dictionaryEntries = data;

    const firstDefinition = dictionaryEntries[0]?.meanings[0]?.definitions[0]?.definition;
    let relatedWords: string[] = [];
    if (firstDefinition) {
      try {
        const aiResult = await suggestRelatedWords({
          word,
          context: firstDefinition,
        });
        relatedWords = aiResult.relatedWords;
      } catch (aiError) {
        console.error('AI suggestion failed:', aiError);
        // Do not block the user if AI fails, just return an empty array
        relatedWords = [];
      }
    }

    return {
        dictionary: dictionaryEntries,
        relatedWords: relatedWords,
    };
  } catch (error) {
    console.error('Error fetching word data:', error);
    return { error: 'Failed to fetch word data. Please check your internet connection and try again later.' };
  }
}
