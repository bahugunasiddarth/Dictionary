"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from '@/components/ui/card';

const FormSchema = z.object({
  word: z.string().min(1, {
    message: "Please enter a word to look up.",
  }),
})

export function SearchForm({ initialWord }: { initialWord: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      word: initialWord || "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/?word=${data.word.trim().toLowerCase()}`);
  }

  return (
    <Card className="shadow-lg">
        <CardContent className="p-4 sm:p-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 sm:gap-4">
                <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                    <FormItem className="flex-grow space-y-0">
                      <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                          <Input 
                              placeholder="e.g., knowledge, serendipity, eloquent..." 
                              className="pl-11 h-12 text-lg"
                              {...field} 
                          />
                          </FormControl>
                      </div>
                      <FormMessage className="pt-2" />
                    </FormItem>
                )}
                />
                <Button type="submit" size="lg" className="h-12">
                    <span className="hidden sm:inline">Search</span>
                    <Search className="sm:hidden h-5 w-5" />
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
