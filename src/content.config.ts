import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    cluster: z.enum(['party', 'food', 'garden', 'visit', 'guides']),
    query: z.string().optional(),
    summary: z.string(),
    updated: z.coerce.date(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { pages };
