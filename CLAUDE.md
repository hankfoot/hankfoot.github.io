# CLAUDE.md — Portfolio Site Guide

## Guidelines
- Always use the `frontend-design` skill when editing the site
- Always visually validate changes you've made to the site. Use the Chrome extension, if available, otherwise use your built-in preview.
- If a major refactor causes the content of this file to become outdated, ask the user if you should make the appropriate updates to keep it up-to-date.
- Do not attempt to commit work unless the user has given the OK

## File Hierarchy

```
hankfoot.github.io/
├── astro.config.mjs              # Astro config: MDX integration, static output
├── tsconfig.json                 # TypeScript config
├── package.json                  # Scripts: dev, build, preview, deploy
│
├── src/                          # Astro source directory
│   ├── content.config.ts         # Content collections schema (projects)
│   ├── layouts/
│   │   └── Base.astro            # Global layout: sidebar, main content, hand cursor
│   ├── pages/
│   │   ├── index.astro           # Homepage: intro, projects grid, about, cv, contact
│   │   └── projects/
│   │       └── [slug].astro      # Dynamic project detail pages
│   ├── components/
│   │   ├── ProjectCard.astro     # Homepage project cards
│   │   ├── ProjectPanel.astro    # Project detail page wrapper
│   │   ├── Sidebar.astro         # Fixed sidebar navigation
│   │   ├── HandCursor.astro      # Interactive hand cursor component
│   │   └── blocks/               # Reusable MDX content blocks
│   │       ├── BentoGrid.astro
│   │       ├── Callout.astro
│   │       ├── Feature.astro
│   │       ├── ImageGrid.astro
│   │       ├── VideoEmbed.astro
│   │       ├── PrototypeEmbed.astro
│   │       └── Specs.astro
│   ├── content/
│   │   └── projects/
│   │       ├── arise-ar.mdx      # Project content (MDX format)
│   │       ├── depth-charge.mdx
│   │       └── rl-haptics.mdx
│   └── styles/
│       └── global.css            # All global styles
│
├── public/                       # Static assets (copied to dist/ root at build)
│   └── favicon.svg
│
└── dist/                         # Build output (gitignored, deployed to GitHub Pages)
```

## Authoring Content

### Edit a project
Open `src/content/projects/[slug].mdx`. The file has two parts:

**Frontmatter** (controls card display and project page header):
```yaml
---
title: Project Title
year: 2024
tags:
  - Tag One
  - Tag Two
thumb: /placeholder.png     # Path to thumbnail image (under public/)
featured: true               # Show on homepage projects grid
summary: "Short description shown on project cards."
---
```

**Body** (MDX rendered into the project page's content area):
```markdown
## Overview
...

## Role
...
```

MDX components are auto-injected — use `<BentoGrid>`, `<Callout>`, `<Feature>`, `<ImageGrid>`, `<Specs>`, `<VideoEmbed>`, and `<PrototypeEmbed>` directly without imports.

**Image note**: All image-rendering components (`BentoGrid`, `Feature`, `ImageGrid`, `ProjectCard`) use Astro's `<Image>` component. Images in `public/` use pre-set `width`/`height` defaults; pass explicit `width`/`height` on `BentoGrid` image objects to override.

### Add a new project
1. Create `src/content/projects/[slug].mdx` with the frontmatter above.
2. Place project media in `public/` or a subdirectory, and reference via absolute path (e.g. `/media/myproject/hero.png`).
3. Set `featured: true` to show the project card on the homepage.

### Edit styles or layout
Global styles are in **`src/styles/global.css`**. Layout lives in `src/layouts/Base.astro` (global shell) and `src/pages/projects/[slug].astro` (project pages). Components are in `src/components/`.

### Add/edit static media
Place files in **`public/`**. They are served at the root and referenced as `/filename` or `/media/filename`.

## Building & Deploying

```bash
npm run dev      # Start dev server with live reload at localhost:4321
npm run build    # Build to dist/
npm run preview  # Preview the built output locally
npm run deploy   # Build then push dist/ to GitHub Pages (gh-pages branch)
```

Build output goes to `dist/`. The `deploy` script uses `gh-pages` to push to the `gh-pages` branch, which GitHub Pages serves.
