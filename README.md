# Hank Duhaime's Portfolio

A Next.js portfolio site with a neobrutalist design aesthetic, statically exported for GitHub Pages.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Architecture

### Tech Stack

- **Framework:** Next.js (App Router, static export via `output: 'export'`)
- **Styling:** Tailwind CSS 3 (utility-first, no dark mode)
- **Icons:** `lucide-react` + one inline Bluesky SVG
- **Deployment:** GitHub Pages via `gh-pages`

### Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout — sticky Navbar + Footer wrapper
│   ├── page.tsx                # Homepage (Hero, Projects, About, Contact)
│   ├── globals.css             # Tailwind directives + minimal CSS vars + dot-grid body
│   ├── dev/
│   │   └── blocks/
│   │       └── page.tsx        # Style guide — every block type × variant (localhost:3000/dev/blocks)
│   └── projects/
│       └── [id]/
│           └── page.tsx        # Dynamic project detail pages (block-based, slug-routed)
│
├── components/
│   ├── navbar.tsx              # Sticky header with animated sine wave + mobile menu
│   ├── footer.tsx              # 3-column footer with bio, shortcuts, project links
│   ├── tag.tsx                 # Reusable pill tag (skills, project tags)
│   ├── media-content.tsx       # Renders image or autoplay video from a type/src pair
│   ├── social-links.tsx        # Social links with "icon" (footer) and "button" (contact) variants
│   └── blocks/
│       ├── index.tsx           # BlockRenderer — maps block type → component
│       ├── hero-block.tsx      # Hero (banner | split | overlay)
│       ├── text-block.tsx      # Text (default | numbered | bullets)
│       ├── image-block.tsx     # Image (full | contained)
│       ├── video-block.tsx     # Video (inline | player)
│       ├── gallery-block.tsx   # Gallery (grid | masonry | scroll)
│       ├── callout-block.tsx   # Callout (note | quote | stat)
│       ├── before-after-block.tsx  # Before/After (side-by-side | stacked)
│       └── link-list-block.tsx # Link List (cards | inline)
│
├── public/
│   ├── content-active.json     # Homepage & global content
│   ├── content/
│   │   └── projects/
│   │       ├── arise.json      # Full block content for ARISE project
│   │       ├── rl-haptics.json # Stub (coming soon)
│   │       └── ...             # One JSON per project slug
│   ├── .nojekyll               # Tells GitHub Pages to skip Jekyll processing
│   └── media/
│       ├── home/               # Homepage media
│       │   ├── intro/
│       │   ├── about/
│       │   └── work/
│       └── projects/           # Per-project media
│           └── arise/
│               ├── hero/
│               ├── before-after/
│               └── process/
│
├── tailwind.config.ts          # Tailwind config (scans app/ + components/)
├── next.config.js              # Static export, unoptimized images, trailing slash
├── postcss.config.js           # PostCSS (tailwindcss + autoprefixer)
├── tsconfig.json               # TypeScript config with @/* path alias
└── package.json
```

### Data Flow

All site content is driven by `public/content-active.json`. There is no CMS, no markdown processing, and no build-time data fetching. Pages import the JSON directly:

```
content-active.json
├── bio              → Homepage hero, contact section, footer
├── aboutParagraphs  → About section (left column)
├── experience       → About section (right column, resume cards)
├── education        → About section (right column)
├── skillGroups      → About section (right column, rendered with Tag component)
├── publications     → About section (left column)
├── projects         → Homepage project grid + project detail pages
│   └── each project has: id, slug, title, subtitle, subtitleUrl, tags, year,
│       description, featured?, image?, media? { type, src }
└── social           → Contact section (SocialLinks variant="button")
                       Footer (SocialLinks variant="icon")
```

### Shared Components

| Component | File | Purpose | Used By |
|---|---|---|---|
| `Tag` | `components/tag.tsx` | Rounded pill badge for skills & project tags | Homepage (skills + project cards), project detail page |
| `MediaContent` | `components/media-content.tsx` | Renders an `<Image>` or autoplay `<video>` based on `type` prop | Homepage project grid |
| `SocialLinks` | `components/social-links.tsx` | Social links with two visual variants | Footer (`variant="icon"`), Contact section (`variant="button"`) |
| `Navbar` | `components/navbar.tsx` | Sticky top nav with animated SVG wave + mobile hamburger | Root layout |
| `Footer` | `components/footer.tsx` | 3-column footer with bio, shortcuts, project list | Root layout |

### Design System

The site uses a **neobrutalist** aesthetic with these conventions:

- **Thick borders:** `border-4 border-black` on sections, cards, and inputs
- **Numbered section headers:** Colored banner with a circled number + title
  - `#ef4444` (red) — Intro
  - `#3b82f6` (blue) — Featured Work
  - `#22c55e` (green) — About
  - `#f97316` (orange) — Contact
- **Dot-grid body background:** `radial-gradient` defined in `globals.css`
- **Typography:** `font-black` headings, uppercase labels, `tracking-wider`/`tracking-tighter`
- **Interactive cards:** `hover:shadow-[12px_12px_0px_rgba(0,0,0,0.2)]` offset shadow on hover

Common class patterns (defined as constants in `app/page.tsx`):
- `sectionHeaderClasses` — colored section banner
- `sectionNumberClasses` — circled number badge
- `cardClasses` — bordered white card

## How To

### Add a New Project

1. Add an entry to the `projects` array in `public/content-active.json` (this drives the homepage grid):
   ```json
   {
     "id": 7,
     "slug": "my-project",
     "title": "My Project",
     "subtitle": "Organization Name",
     "tags": ["Design", "Prototyping"],
     "year": "2025",
     "description": "What it does...",
     "subtitleUrl": "https://example.com",
     "featured": true,
     "media": { "type": "image", "src": "/media/home/work/my-project-hero.jpg" }
   }
   ```
2. Create `public/content/projects/my-project.json` with a `blocks` array (see block schema below).
3. Add a static import for the new JSON in `app/projects/[id]/page.tsx` and register it in the `projectContent` map.
4. Place project media in `public/media/projects/my-project/`.
5. The project appears automatically on the homepage grid and renders its blocks at `/projects/my-project/`.

### Block-Based Project Pages

Each project detail page is composed of **blocks** — typed JSON objects rendered by matching React components. Content lives in `public/content/projects/{slug}.json`.

#### JSON Schema

```json
{
  "blocks": [
    { "type": "hero",         "variant": "banner",      "data": { ... } },
    { "type": "text",         "variant": "default",     "data": { ... } },
    { "type": "before-after", "variant": "side-by-side", "data": { ... } }
  ]
}
```

Every block has:
- **`type`** (required) — maps to a component in `components/blocks/`
- **`variant`** (optional) — selects a visual treatment within that component
- **`data`** (required) — block-specific props (images, text, config)

#### Available Block Types

| Type | Variants | Key Data Fields |
|---|---|---|
| `hero` | `banner` · `split` · `overlay` | `image`, `metadata[]` (label/value pairs) |
| `text` | `default` · `numbered` · `bullets` | `heading?`, `body[]`, `stepNumber?`, `items[]`, `anchorId?` |
| `image` | `full` · `contained` | `src`, `alt`, `caption?` |
| `video` | `inline` · `player` | `src`, `caption?` |
| `gallery` | `grid` · `masonry` · `scroll` | `images[]` (src/alt/caption), `columns?` |
| `callout` | `note` · `quote` · `stat` | `text`, `attribution?`, `statValue?` |
| `before-after` | `side-by-side` · `stacked` | `heading?`, `before` / `after` (image/label/bullets) |
| `link-list` | `cards` · `inline` | `heading?`, `links[]` (label/url/description) |

#### Adding a New Block Type

1. Create `components/blocks/my-block.tsx` exporting a `MyBlock` component with `data` and optional `project` props.
2. Register it in `components/blocks/index.tsx` by adding to the `blockComponents` map.
3. Add sample data to `app/dev/blocks/page.tsx` so the style guide stays up to date.

#### Dev Style Guide

Visit [localhost:3000/dev/blocks](http://localhost:3000/dev/blocks) to see every block type in every variant rendered with real ARISE media.

### Add a New Page

1. Create `app/my-page/page.tsx`.
2. The root layout (`app/layout.tsx`) automatically wraps it with `Navbar` + `Footer`.
3. To add it to navigation, edit the nav links array in `components/navbar.tsx`.

### Update Social Links

Edit the `social` object in `public/content-active.json`. The `SocialLinks` component reads from it in both the footer and contact section. To add a new platform, update the component in `components/social-links.tsx`.

## NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build static export to `out/` |
| `npm run deploy` | Build + deploy to GitHub Pages (`gh-pages -d out`) |
| `npm run lint` | Run Next.js ESLint |

## Deployment

The site uses `output: 'export'` in `next.config.js` to generate a fully static build in the `out/` directory. The `deploy` script pushes that directory to the `gh-pages` branch.

```bash
npm run deploy
```

- **`main` branch** — source code (edit this)
- **`gh-pages` branch** — built static files (auto-generated, don't edit)

## License

Personal portfolio site © Hank Duhaime
