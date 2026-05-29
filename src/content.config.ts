import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writings = defineCollection({
  // API moderna de Astro (Content Layer). Lee markdown de src/content/writings/.
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writings' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writings };
