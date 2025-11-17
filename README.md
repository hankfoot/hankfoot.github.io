# Hank Duhaime's Portfolio

A Next.js portfolio website vibe coded with Copilot.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Deployment
```bash
npm run build
npx gh-pages -d out --dotfiles
```

The site will be deployed to GitHub Pages at `https://hankfoot.github.io`

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with header, footer, and dot grid background
│   ├── page.tsx            # Homepage (Hero, Projects, About, Contact)
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx    # Dynamic project pages (uses slug routing)
│   └── globals.css         # Global styles and LEGO design system
│
├── components/
│   ├── navbar.tsx          # Sticky header navigation with wave animation
│   ├── footer.tsx          # Global footer with social links and site navigation
│   └── ui/                 # shadcn/ui components (Button, etc.)
│
├── public/
│   ├── content-active.json # Single source of truth for all site content
│   ├── media/
│   │   ├── home/           # Homepage images and videos
│   │   │   ├── intro/      # Hero section images
│   │   │   ├── work/       # Project preview images/videos
│   │   │   └── about/      # About section images
│   │   └── projects/       # Project detail page media (organized by slug)
│   └── .nojekyll           # Tells GitHub Pages not to process with Jekyll
│
├── next.config.js          # Next.js config (static export enabled)
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Aesthetic
- **Bold borders**: 4px black borders on all major sections
- **Numbered sections**: Each section has a number badge (1-4)
- **Dot grid background**: Subtle background pattern across all pages
- **Color-coded headers**: Red (Intro), Blue (Projects), Green (About), Orange (Contact)
- **Typography**: Black font, all-caps headings, bold emphasis

### Key Components
- `SectionHeader`: Reusable numbered section headers
- Cards with `border-4 border-black`
- Buttons with uppercase text and bold font weights

## 📝 Content Management

All site content is managed through `public/content-active.json`:

```json
{
  "bio": { "name", "location", "contactMessage" },
  "aboutParagraphs": [...],
  "experience": [...],
  "skillGroups": [...],
  "publications": [...],
  "education": [...],
  "projects": [
    {
      "id": 6,
      "slug": "rl-haptics",
      "title": "...",
      "subtitle": "...",
      "tags": [...],
      "year": "...",
      "description": "...",
      "subtitleUrl": "...",
      "featured": true,
      "image": "/media/home/work/..."
    }
  ],
  "social": { "bluesky", "linkedin", "resume" }
}
```

### Adding/Editing Projects
1. Edit `public/content-active.json`
2. Add a unique `slug` for URL routing (e.g., "safecracker", "arise")
3. Place project preview images in `public/media/home/work/`
4. Place detail images in `public/media/projects/{slug}/`
5. Rebuild and deploy

## 🔧 Key Features

### Slug-Based Routing
Projects use clean URLs like `/projects/safecracker` instead of `/projects/3`

### Dynamic Project Pages
All project pages are generated from `content-active.json` with a consistent template

### Global Components
- Navbar and Footer appear on all pages
- Dot grid background is consistent across the site

### Static Export
Built as a static site for GitHub Pages deployment (no server required)

## 🚢 Deployment Workflow

### Regular Deployment
```bash
# 1. Make your changes
# 2. Test locally
npm run dev

# 3. Commit to main branch
git add .
git commit -m "Your commit message"
git push origin main

# 4. Build and deploy to GitHub Pages
npm run build
npx gh-pages -d out --dotfiles
```

### Branch Structure
- `main` - Source code (this is what you edit)
- `gh-pages` - Built static files (auto-generated, don't edit directly)

## 🎯 NPM Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server locally
npm run lint       # Run ESLint
```

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react, react-icons
- **UI Components**: shadcn/ui
- **Deployment**: GitHub Pages
- **Package Manager**: npm

## 🔗 Links

- Live Site: https://hankfoot.github.io
- Repository: https://github.com/hankfoot/hankfoot.github.io

## 📄 License

Personal portfolio site © 2025 Hank Duhaime
