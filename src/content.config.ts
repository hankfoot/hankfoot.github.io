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
    org: z.string().optional(),
    contributions: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    hook: z.string().optional(),
    outcomes: z.array(z.string()).optional(),
  }),
});

export const collections = { projects };
