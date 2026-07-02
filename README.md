# Hank Duhaime's Portfolio

Personal portfolio site built with [Astro](https://astro.build). Static output, MDX-driven project content, a plain-CSS design system, and an interactive hand cursor. Deployed to GitHub Pages.

## Quick Start

```bash
npm install
npm run dev      # dev server at localhost:4321
```

## Tech Stack

- **Framework:** Astro 5 (`output: 'static'`) with the `@astrojs/mdx` integration
- **Content:** MDX content collections — one file per project in `src/content/projects/`
- **Styling:** Plain CSS with a design-token `:root` block in `src/styles/global.css` (no framework)
- **Interactivity:** Vanilla JS — an animated hand cursor and a small Canvas2D minigame engine
- **Deployment:** GitHub Pages via `gh-pages`

## Structure

```
src/
├── content.config.ts        # projects collection schema
├── layouts/Base.astro       # global shell (sidebar, main slot, hand cursor)
├── pages/                    # index, /styles reference, projects/[slug], games/ test harnesses
├── components/               # ProjectCard, ProjectPanel, Sidebar, HandCursor, GameCanvas + blocks/
├── content/projects/*.mdx    # project content
├── games/                    # Canvas2D minigame subsystem
├── utils/                    # text (inline links + tooltips), badges (localStorage store)
└── styles/global.css         # all global styles + design tokens
public/                       # static assets, referenced by absolute path
```

See [CLAUDE.md](CLAUDE.md) for the full architecture guide, design system, and content-authoring conventions.

## Scripts

```bash
npm run dev      # dev server with live reload (localhost:4321)
npm run build    # build to dist/
npm run preview  # preview the built output
npm run deploy   # build + push dist/ to the gh-pages branch
```

- **`main` branch** — source (edit this)
- **`gh-pages` branch** — built static files (auto-generated)

## License

Personal portfolio site © Hank Duhaime
