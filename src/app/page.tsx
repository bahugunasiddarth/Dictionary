import { getWordData } from '@/lib/actions';
import type { WordData } from '@/lib/types';
import { SearchForm } from '@/components/dictionary/search-form';
import { ResultsDisplay } from '@/components/dictionary/results-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const word = typeof searchParams.word === 'string' ? searchParams.word : '';
  let wordData: WordData | null = null;
  let error: string | null = null;

  if (word) {
    const result = await getWordData(word);
    if ('error' in result) {
      error = result.error;
    } else {
      wordData = result;
    }
  }

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8 font-body">
        <div className="w-full max-w-4xl space-y-8">
          <header className="text-center space-y-2">
            <div className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md">
              <BookOpen className="h-6 w-6" />
              <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
                Dictionary
              </h1>
            </div>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Your modern dictionary for definitions, synonyms, and AI-powered word suggestions.
            </p>
          </header>

          <SearchForm initialWord={word} />
          
          {error && (
              <Card className="w-full border-destructive bg-destructive/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                      <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                      <p className="text-destructive">{error}</p>
                  </CardContent>
              </Card>
          )}

          {wordData && <ResultsDisplay data={wordData} />}

          {!word && !error && (
              <Card className="w-full text-center animate-fade-in">
                  <CardHeader>
                      <CardTitle>Welcome to Dictionary</CardTitle>
                      <CardDescription>
                          Enter a word in the search bar above to get started.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center p-10">
                      <BookOpen className="mx-auto h-20 w-20 text-muted-foreground opacity-20" />
                  </CardContent>
              </Card>
          )}
        </div>
      </main>
      <Toaster />
    </>
  );
}
