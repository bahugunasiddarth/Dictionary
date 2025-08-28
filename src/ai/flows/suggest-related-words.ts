'use server';

/**
 * @fileOverview An AI agent to suggest related words based on the context of a given word.
 *
 * - suggestRelatedWords - A function that suggests related words based on context.
 * - SuggestRelatedWordsInput - The input type for the suggestRelatedWords function.
 * - SuggestRelatedWordsOutput - The return type for the suggestRelatedWords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedWordsInputSchema = z.object({
  word: z.string().describe('The word for which to suggest related words.'),
  context: z
    .string()
    .optional()
    .describe('Context or a sentence in which the word is used.'),
});
export type SuggestRelatedWordsInput = z.infer<typeof SuggestRelatedWordsInputSchema>;

const SuggestRelatedWordsOutputSchema = z.object({
  relatedWords: z
    .array(z.string())
    .describe('An array of related words based on the context.'),
});
export type SuggestRelatedWordsOutput = z.infer<typeof SuggestRelatedWordsOutputSchema>;

export async function suggestRelatedWords(
  input: SuggestRelatedWordsInput
): Promise<SuggestRelatedWordsOutput> {
  return suggestRelatedWordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedWordsPrompt',
  input: {schema: SuggestRelatedWordsInputSchema},
  output: {schema: SuggestRelatedWordsOutputSchema},
  prompt: `You are an expert in vocabulary and semantics. Your task is to suggest related words for a given word, considering the context provided.

Word: {{{word}}}
Context: {{{context}}}

Please provide a list of related words that go beyond simple synonyms and include words that might be used in a similar context or have associated meanings.  Return the results as a JSON array of strings.

For example, if the word is 'happy' and the context is 'a feeling of joy', related words could include ['joyful', 'content', 'elated', 'blissful', 'cheerful'].`,
});

const suggestRelatedWordsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedWordsFlow',
    inputSchema: SuggestRelatedWordsInputSchema,
    outputSchema: SuggestRelatedWordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
