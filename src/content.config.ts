import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.number(),
    tags: z.array(z.string()),
    thumb: z.string(),
    featured: z.boolean(),
    summary: z.string(),
  }),
});

export const collections = { projects };
