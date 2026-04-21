import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    timeline: z.string(),
    tags: z.array(z.string()),
    thumb: z.string(),
    featured: z.boolean(),
    summary: z.string(),
    org: z.string().optional(),
    orgUrl: z.string().url().optional(),
    contributions: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    hook: z.string().optional(),
    outcomes: z.array(
      z.union([
        z.string(),
        z.object({ text: z.string(), url: z.string().url() }),
      ])
    ).optional(),
  }),
});

export const collections = { projects };
