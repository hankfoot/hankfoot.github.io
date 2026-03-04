import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    // applyBaseStyles: false because we import our own globals.css with Tailwind directives
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  output: 'static',
  // Matches Next.js trailingSlash behavior for GitHub Pages
  trailingSlash: 'always',
})
