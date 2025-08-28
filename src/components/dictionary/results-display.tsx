"use client";

import type { WordData, Phonetic } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, BookCopy, BrainCircuit, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ResultsDisplay({ data }: { data: WordData }) {
  const { dictionary, relatedWords } = data;
  const mainEntry = dictionary[0];

  const playAudio = (phonetic: Phonetic) => {
    const audioUrl = phonetic.audio;
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };

  const audioPhonetic = mainEntry.phonetics.find(p => p.audio);
  const allSynonyms = Array.from(new Set(mainEntry.meanings.flatMap(m => m.synonyms)));

  return (
    <Card className="w-full animate-in fade-in-50 duration-500 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <CardTitle className="text-3xl sm:text-4xl font-headline">{mainEntry.word}</CardTitle>
                <CardDescription className="text-xl text-accent">{mainEntry.phonetic}</CardDescription>
            </div>
            {audioPhonetic && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => playAudio(audioPhonetic)}>
                                <Volume2 className="h-6 w-6" />
                                <span className="sr-only">Play audio</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Listen to pronunciation</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={['item-0', 'synonyms', 'related-words']} className="w-full">
        {mainEntry.meanings.map((meaning, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <BookCopy className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Definitions <span className="text-base font-medium text-muted-foreground">({meaning.partOfSpeech})</span></h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-5 pl-8 border-l-2 border-border ml-2">
                    {meaning.definitions.map((def, defIndex) => (
                        <div key={defIndex} className="space-y-3 pl-4">
                            <p className="text-base">{def.definition}</p>
                            {def.example && (
                                <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                                    "{def.example}"
                                </blockquote>
                            )}
                        </div>
                    ))}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {allSynonyms.length > 0 && (
            <AccordionItem value="synonyms">
                <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                        <List className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Synonyms</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-wrap gap-2 pl-8">
                        {allSynonyms.map((synonym, i) => (
                            <Badge variant="secondary" key={i} className="text-base px-3 py-1 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => window.location.href = `/?word=${synonym}`}>{synonym}</Badge>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        )}
        
        {relatedWords.length > 0 && (
            <AccordionItem value="related-words">
                <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">AI-Suggested Words</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-wrap gap-2 pl-8">
                        {relatedWords.map((word, i) => (
                            <Badge variant="outline" key={i} className="text-base px-3 py-1 cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => window.location.href = `/?word=${word}`}>{word}</Badge>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 pl-8">Contextually similar words suggested by AI.</p>
                </AccordionContent>
            </AccordionItem>
        )}
        </Accordion>

        <div className="pt-4">
            <Separator />
            <div className="pt-4 text-center">
              <a href={mainEntry.sourceUrls[0]} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  View Source on Wiktionary
              </a>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
