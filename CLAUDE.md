# CLAUDE.md — Portfolio Site Guide

## Guidelines
- Always use the `frontend-design` skill when editing the site
- Always visually validate changes you've made to the site
- If a major refactor causes the content of this file to become outdated, ask the user if you should make the appropriate updates to keep it up-to-date.

## File Hierarchy

```
hankfoot.github.io/
├── .eleventy.js              # Eleventy config: collections, passthrough, filters
├── package.json              # Scripts: dev, build, deploy
│
├── src/                      # All source content (Eleventy input dir)
│   ├── index.njk             # Homepage (hero, about, work, contact sections)
│   ├── _data/
│   │   └── site.js           # Global data: bio, experience, skills, publications, social, education
│   ├── _includes/
│   │   ├── base.njk          # Base layout: navbar, footer, ALL CSS, mobile JS
│   │   └── project.njk       # Project detail page layout (extends base.njk)
│   └── projects/
│       ├── projects.json     # Sets layout: "project.njk" for all projects
│       ├── arise-ar/
│       │   └── index.md      # Project content (frontmatter + Markdown body)
│       ├── depth-charge/
│       │   └── index.md
│       ├── rl-haptics/
│       │   └── index.md
│       ├── safecracker/
│       │   └── index.md
│       └── use-your-melon/
│           └── index.md
│
├── public/                   # Static assets (copied to _site/ root at build)
│   ├── favicon.svg
│   └── media/                # Images and videos referenced in templates/content
│
└── _site/                    # Build output (gitignored, deployed to GitHub Pages)
```

## Authoring Content

### Edit site-wide info
All bio, experience, skills, publications, education, and social links live in **`src/_data/site.js`**. Accessed in templates as `site.*` (e.g. `site.bio.name`, `site.experience`).

### Edit a project
Open `src/projects/[slug]/index.md`. The file has two parts:

**Frontmatter** (controls card display and project page header):
```yaml
---
title: Project Title
org: Organization Name
period: "2024"
order: 1              # Sort order on homepage (lower = first)
featured: true        # Show on homepage work section
thumbnail: ""         # Relative path to hero image (e.g. hero.png)
images: []            # Unused currently
tags:
  - Tag One
  - Tag Two
award: null           # Award name string, or null
description: "Short description shown on project cards."
---
```

**Body** (Markdown rendered into the project page's content area):
```markdown
## Overview
...

## Role
...
```

### Add a new project
1. Create `src/projects/[slug]/index.md` with the frontmatter above.
2. Place any project media in `src/projects/[slug]/` (jpg, png, mp4, etc.) — Eleventy copies them automatically via passthrough.
3. Reference media in the body as relative paths (e.g. `![alt](image.png)`).
4. Set `order` to control homepage sort position.
5. Set `featured: true` to show the project card on the homepage.

### Edit styles or layout
All CSS is in a single `<style>` block inside **`src/_includes/base.njk`**. No separate stylesheet files. Edit templates directly in `base.njk` (global layout) or `project.njk` (project pages).

### Add/edit static media (shared assets)
Place files in **`public/media/`**. They are copied to `_site/media/` at build and referenced in templates as `/media/...`.

## Building & Deploying

```bash
npm run dev      # Start dev server with live reload at localhost:8080
npm run build    # Build to _site/
npm run deploy   # Build then push _site/ to GitHub Pages (gh-pages branch)
```

Build output goes to `_site/`. The `deploy` script uses `gh-pages` to push to the `gh-pages` branch, which GitHub Pages serves.
