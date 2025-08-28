export interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

export interface WordNotFound {
  title: string;
  message: string;
  resolution: string;
}

export type DictionaryResponse = DictionaryEntry[] | WordNotFound;

export interface WordData {
    dictionary: DictionaryEntry[];
    relatedWords: string[];
}
