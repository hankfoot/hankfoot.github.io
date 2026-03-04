import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// Each .mdx file in src/content/projects/ is one project.
// The schema is validated at build time — if a field is missing or wrong type, the build fails.
const projects = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    subtitleUrl: z.string().optional(),
    year: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    // Controls display order on the homepage (lower = earlier)
    order: z.number(),
    // Whether to show the "View Work" link on the card
    featured: z.boolean().default(true),
    // Thumbnail shown on the homepage project card
    thumbnail: z
      .object({
        type: z.enum(['image', 'video']),
        src: z.string(),
      })
      .optional(),
    // Banner image shown at the top of the project detail page
    heroImage: z.string().optional(),
    // Key-value pairs shown in the hero metadata row (e.g. "Tools: Figma")
    metadata: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
  }),
})

export const collections = { projects }
