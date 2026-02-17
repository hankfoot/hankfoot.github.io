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
│   └── projects/
│       └── [id]/
│           └── page.tsx        # Dynamic project detail pages (slug-based routing)
│
├── components/
│   ├── navbar.tsx              # Sticky header with animated sine wave + mobile menu
│   ├── footer.tsx              # 3-column footer with bio, shortcuts, project links
│   ├── tag.tsx                 # Reusable pill tag (skills, project tags)
│   ├── media-content.tsx       # Renders image or autoplay video from a type/src pair
│   └── social-links.tsx        # Social links with "icon" (footer) and "button" (contact) variants
│
├── public/
│   ├── content-active.json     # Single source of truth for ALL site content
│   ├── .nojekyll               # Tells GitHub Pages to skip Jekyll processing
│   └── media/
│       └── home/
│           ├── intro/          # Hero section images
│           ├── about/          # About section images
│           └── work/           # Project preview images & videos
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

1. Add an entry to the `projects` array in `public/content-active.json`:
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
2. Place the preview image/video in `public/media/home/work/`.
3. The project appears automatically on the homepage grid and gets a detail page at `/projects/my-project/`.

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
