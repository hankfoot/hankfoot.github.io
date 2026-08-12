import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    timeline: z.string(),
    tags: z.array(z.string()),
    thumb: z.string(),
    featured: z.boolean(),
    // Keeps a project out of the build entirely — off the homepage grid AND
    // no page generated. For work that isn't ready to be seen yet. Distinct
    // from `featured`, which is about front-page prominence for published work.
    draft: z.boolean().optional().default(false),
    summary: z.string(),
    context: z.string().optional(),
    contextLabel: z.string().optional(),
    contextUrl: z.string().url().optional(),
    role: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    outcomes: z.array(
      z.union([
        z.string(),
        z.object({ text: z.string(), url: z.string().url() }),
      ])
    ).optional(),
  }),
});

export const collections = { projects };
