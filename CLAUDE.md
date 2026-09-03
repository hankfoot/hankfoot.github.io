# CLAUDE.md — Portfolio Site Guide

## Guidelines
- Always use the `frontend-design` skill when editing the site
- Always visually validate changes you've made to the site. Use the Chrome extension, if available, otherwise use your built-in preview.
- If a major refactor causes the content of this file to become outdated, ask the user if you should make the appropriate updates to keep it up-to-date.
- Do not attempt to commit work unless the user has given the OK
- The live style reference is the `/styles` page (`src/pages/styles.astro`) — it renders every token and block from real source. Consult it (and update it) when changing the design system.

## Architecture Overview

Astro 5 static site (`output: 'static'`), MDX content collections, plain CSS, no client framework. Deployed to GitHub Pages via `gh-pages`.

**Page composition:** `Base.astro` is a persistent two-column shell — 20vw sticky `Sidebar` + main `<slot>` — with Astro View Transitions; `Sidebar` and `HandCursor` carry `transition:persist` so they survive navigations. Fonts: Inter (body/headings) and Source Code Pro (labels/meta/tags), loaded from Google Fonts in Base.

**Project pages:** `src/pages/projects/[slug].astro` uses `getStaticPaths()` over the `projects` collection, wraps content in `ProjectPanel` (meta header: title, summary/hook, timeline, tags, context, role, tools, outcomes in a 6-column grid), and renders MDX via `<Content components={...} />`. The components map in `[slug].astro` is what makes blocks import-free in MDX — add new blocks there.

## File Hierarchy

```
hankfoot.github.io/
├── astro.config.mjs              # Astro config: MDX integration, static output
├── package.json                  # Scripts: dev, build, preview, deploy
│
├── src/
│   ├── content.config.ts         # Projects collection schema
│   ├── layouts/Base.astro        # Global shell: sidebar, main slot, hand cursor, fonts, reduced-motion init
│   ├── pages/
│   │   ├── index.astro           # Homepage: intro, staggered 2-col project grid, about/cv/contact
│   │   ├── styles.astro          # Living design-system reference at /styles (unlinked, intentional)
│   │   ├── projects/[slug].astro # Project pages + the MDX components map
│   │   └── games/                # Internal game test harnesses (index + [game]); not linked from site
│   ├── components/
│   │   ├── ProjectCard.astro     # Homepage cards (Astro <Image> thumbs)
│   │   ├── ProjectPanel.astro    # Project page meta header + content wrapper
│   │   ├── Sidebar.astro         # Nav, motion toggle, earned-badges rack
│   │   ├── HandCursor.astro      # Hand cursor state machine (~570-line inline script)
│   │   ├── GameCanvas.astro      # Bonus-level embed (overlay mode) / bare canvas (test pages)
│   │   ├── ReducedMotionInit.astro # Shared is:inline pre-paint reduced-motion bootstrap
│   │   └── blocks/               # MDX content blocks (see Blocks Library)
│   ├── assets/                   # Images, mirroring their public URL path so Astro can
│   │                             #   optimise them (see utils/images.ts + SmartImage)
│   ├── content/projects/*.mdx    # One file per project (quick-distract is the reference example)
│   ├── games/                    # Canvas2D minigame subsystem (engine, manifest, registry, games)
│   ├── utils/
│   │   ├── text.ts               # parseInline(): markdown links + {text|tooltip} syntax
│   │   ├── media.ts              # isVideo()/videoBase(): shared webm+mp4 source derivation
│   │   └── badges.ts             # localStorage badge store + events
│   └── styles/global.css         # ALL global styles + design tokens (:root block at top)
│
├── public/
│   ├── projects/[slug]/          # Per-project VIDEO only (webm+mp4); images live in src/assets
│   └── ui/hand-*.svg             # Fluent Emoji hand sprites (all 8 in use)
├── .video-backups/               # Pre-re-encode video originals (gitignored, keep)
└── dist/                         # Build output (gitignored, deployed to gh-pages)
```

## Design System

Tokens live in `:root` in `global.css` (~lines 9–37). Use them — don't hardcode values. (Intentional exceptions: game-boot gradients and palm yellows in GameCanvas styles.)

- **Colors:** `--color-bg` #fff, `--color-text` #111, `--color-muted` #666, `--color-border` #e0e0e0, `--color-surface` #f7f7f7, `--color-surface-mid` #f0f0f0, `--color-placeholder` #d8d8d8, inverse set (`--color-inverse-bg/text/muted`) for dark blocks like Credits.
- **Type:** `--font-sans` (Inter) for prose/headings; `--font-mono` (Source Code Pro) for ALL metadata, labels, tags, CTAs. Tracking tokens: `--label-tracking-tight` 0.04em, `--label-tracking-loose` 0.08em (caps labels).
- **Spacing:** `--space-section` 5rem (between major sections), `--space-block` 2rem (between related blocks), `--grid-gap` 1.5rem, `--stagger-offset` 80px (project-grid right column).
- **Radii:** `--radius-sm` 4px (tags/buttons), `--radius-md` 12px (blocks), `--radius-lg` 24px (hero/bento imagery).
- **Visual language:** flat cards, subtle borders and surface tints, minimal decoration; the personality comes from the hand cursor and motion choreography, not from surface styling.

**Styling convention:** everything goes in `global.css` under semantic class names — components do NOT carry scoped `<style>` blocks. Sole exception: `GameCanvas.astro` (its overlay choreography is self-contained). Follow this split.

## Content Model

Schema (`src/content.config.ts`):

```yaml
---
title: Quick Distract            # required
timeline: "2023-2025"            # required, string (replaced old `year`)
tags: [XR, App, Product]         # required
thumb: /projects/quick-distract/lionheart-context-3x2.jpeg  # required — a missing thumb breaks the Image pipeline
featured: true                   # reserved: the homepage currently shows every published
                                 # project; set false to keep one off the front page once a
                                 # separate full project index exists. Wire the filter then.
draft: true                      # optional, defaults false. Removes the project from the
                                 # build entirely — off the homepage AND no page generated.
                                 # For work that isn't ready to be seen.
summary: "One-liner."            # required — SINGLE source for card teaser AND project-page hook
context: SpellBound AR           # optional; label defaults to "Client"
contextLabel: Company            # optional override
contextUrl: https://...          # optional, makes context a link
role: [Game Design, Development] # optional
tools: [Unity, C#]               # optional
outcomes:                        # optional; strings or { text, url }
  - "Deployed in 12 hospitals"
---
```

**Body conventions** (see `quick-distract.mdx` as the reference):
- Wrap prose/blocks in `<Section label="...">…</Section>` (bare `<Section>` for unlabeled galleries).
- Blocks are auto-injected — no imports. Available: `BentoGrid`, `Callout`, `Credits`, `Feature`, `GameCanvas`, `ImageGrid`, `Outcomes`, `PrototypeEmbed`, `Quote`, `Section`, `Specs`, `VideoEmbed`.
- Meta fields, outcomes, credits, captions, and quotes support inline markdown links `[text](url)` AND tooltips `{visible text|tooltip content}` via `parseInline` (`src/utils/text.ts`). No braces inside either side; no pipe in the trigger.
- Reference media by absolute path (`/projects/[slug]/name.jpg`) regardless of where the file lives — `resolveImage` maps image paths onto `src/assets/`, so authoring never changes.

### Copy Style

House rules for every piece of prose on the site. Decide the **grammatical form first** —
punctuation follows from it. Never add a period to a fragment to force consistency.

1. **Labels lowercase, content as written.** A label names a slot (`role`, `timeline`,
   `credits`) and is always lowercase — enforced in CSS, not by typing. Titles, proper
   nouns, and quoted words keep their own capitals. Citation titles must never be
   lowercased (see `.block-feature-label`).
2. **A fragment takes no period, a complete sentence takes one.** Decide per string by
   what it is, not per page. `summary` is always a teaser fragment — no period. Captions
   go either way; punctuate by form.
3. **Attribution:** one form — `Source: [Title](url) — Publisher, Year`. Em dash before the
   publisher, never a comma. No `Photo:` and no `(courtesy of…)`.
4. **Feature descriptions are complete sentences,** with periods.
5. **Outcomes** start with a past-tense verb and end without a period — both the frontmatter
   list and the body `<Outcomes>` list. *Shipped, Built, Playtested, Won* — not *1st Place*.
6. **Year ranges** use a tight en dash: `2016–2018`. Same format in frontmatter and the CV.
7. **Numerals in metadata; spell out one to nine in prose.** Always numerals with a modifier
   attached (`10+`, `5-star`, `7-person`, `3D`).
8. **`and` in prose, `&` in labels and credits.** No `+` or `×` as a conjunction outside the
   hero's `focused on` row.
9. **One ellipsis character (`…`), spaced when it joins two sentences. Curly quotes and
   apostrophes** (`’ “ ”`) everywhere. Note the trap: MDX runs smartypants on *markdown
   prose* but not on *JSX props* or `.ts`/`.astro` strings — so prose curls itself and
   everything else must be typed curly by hand.
10. **Expand an acronym on first use, or tooltip it** with the `{visible|tooltip}` syntax.

**Alt text** opens with an article and describes what is visible, never an internal
nickname. Two registers, picked by subject: object and screen shots run ~10 words
(*A solenoid seated in white 3D-printed mounts*); photographs with people or action run
~20 (*A boy holds a printed card up to a tablet while a clinician works on his other
arm*). Decorative chrome takes `alt=""`.

Also: US spelling (`visualization`, `standardized`); credit your own role as
`… & Development`, matching the `Software Development` used in `role` fields.

### Blocks Library
| Block | Renders |
|---|---|
| `Section` | Labeled container providing section rhythm (`--space-section`) |
| `BentoGrid` | 2-col media grid; `wide: true` items span both columns; auto video detection. Cells are 4:3 cover-cropped by default — pass `ratio: "16 / 9"` (any CSS ratio) on an item to opt out when cropping would cut content (diagrams, screenshots, wide art) |
| `Feature` | Text + media pair (3fr/2fr); `flip` swaps sides; auto video detection |
| `Quote` | Left-border blockquote with cite/source |
| `Callout` | Left-border note (`type: note`) |
| `Specs` | 2-col monospace definition list |
| `Outcomes` | Em-dash bullet list (parseInline-enabled) |
| `Credits` | Dark inverse block, name + role pairs. Optional `thanks` array adds a second "special thanks" column for advisors/sponsors (makers stay in `people`) |
| `ImageGrid` | Auto-fill image grid |
| `VideoEmbed` | Single `<figure>` video with caption |
| `PrototypeEmbed` | 16:9 iframe |
| `GameCanvas` | Bonus-level entry (overlay mode) or bare canvas (`bare` prop, test pages) |

### Media conventions
- **Videos:** always a matched **webm (primary) + mp4 (fallback)** pair sharing one hyphen-case base name in `public/projects/[slug]/`. Components take the base path and derive both `<source>`s via the shared helpers in `src/utils/media.ts` (`isVideo()` / `videoBase()`) — use those, don't re-inline the regex. Use video, never GIF, for motion. Looping clips carry `data-autoplay` (never a bare `autoplay`) plus `preload="metadata"`; `src/components/VideoAutoPause.astro` (included once in Base) is the only thing that starts them — it plays clips near the viewport, pauses the rest, holds playback until the drawer lands, retries on the first tap/scroll when a phone refused play(), shows native controls while refused, and does nothing under Data Saver. Give any new autoplaying block the same attributes. Inside that component the play policy and the observer's rootMargin are one constant (`NEAR_PX`) and must stay equal — a wider margin than the policy means a clip is only re-evaluated when a *neighbouring* clip crosses the line, which strands clips on screen and paused. Encoding recipes and the fade-through-white loop technique are in auto-memory; back up originals to `.video-backups/[slug]/` before destructive re-encodes.
- **Images:** live in `src/assets/[same path as the public URL]` — **not** `public/`. Astro only optimises images it imports from `src/`; anything under `public/` is copied verbatim and ships at full resolution. Blocks render them through `SmartImage`, which resolves the public-style path via `src/utils/images.ts` and emits a resized, reformatted `srcset`. Pass `widths` + `sizes` describing where the image actually lands; a path that doesn't resolve degrades to an unoptimised passthrough rather than failing the build.

## Interactive Systems

**Hand cursor** (`HandCursor.astro`): Fluent Emoji hand (sprites in `public/ui/`, palette #FFD140/#E8AD3C/#DF8F0D) with a tiered state machine — Tier 1 nav choreography (grab-travel → grab-pull → flick-travel → flick-push), Tier 2 easter-egg/game states (egg-travel → in-game), Tier 3 scroll-driven idle (wave/point). Animations via WAAPI, hooked into Astro transition lifecycle events. This file is deliberately complex — don't refactor casually.

**Games subsystem** (`src/games/`): hidden bonus levels embedded in project pages via `<GameCanvas>` (currently: treasure-hunt at the end of quick-distract).
- `engine.ts` — reusable Canvas2D shell: fixed timestep, HiDPI, pointer/keyboard normalization, visibility pause. Games implement `init/update/draw/onInput`.
- `manifest.ts` — server-safe metadata (id, title, aspect, badge) — safe to import in .astro frontmatter.
- `registry.ts` — client-only id → factory map; only imported inside GameCanvas's script. **Keep this server/client split when adding games.**
- Overlay choreography is coordinated with HandCursor via `bonus:open` / `bonus:hand-ready` / `bonus:close` / `bonus:closed` CustomEvents on `document`.
- Test harnesses at `/games` and `/games/[game]` (bare mode, no shell) — internal, unlinked.

**Badges** (`utils/badges.ts`): games award badges (`awardBadge`) persisted in localStorage; Sidebar listens for `hank-badge-earned` / `hank-badge-reset` and renders the rack with tooltips linking back to the earning game.

**Reduced motion:** `data-reduced-motion="true"` on `<html>`, set pre-paint by an `is:inline` script (localStorage `hank-reduced-motion`, falls back to system preference). Toggle lives in Sidebar. Disables hand cursor and animation theatrics; games stay playable. Any new animation must respect this attribute.

## Best Practices for This Codebase
1. New visual patterns: add tokens/classes to `global.css`, then showcase them on `/styles` so the reference stays complete.
2. New MDX block: create in `src/components/blocks/`, register in the components map in `src/pages/projects/[slug].astro`, style in `global.css`, showcase on `/styles`.
3. New game: implement against `engine.ts`, add metadata to `manifest.ts`, factory to `registry.ts`; verify at `/games/[id]` before embedding via `<GameCanvas game="id" />`.
4. New project: create `src/content/projects/[slug].mdx`, images in `src/assets/projects/[slug]/`, video in `public/projects/[slug]/`, follow quick-distract's structure.
5. Motion: WAAPI or CSS transitions using existing easing/durations; always gate on `data-reduced-motion`.

## Building & Deploying

```bash
npm run dev      # Dev server at localhost:4321
npm run build    # Build to dist/
npm run preview  # Preview built output
npm run deploy   # Build + push dist/ to gh-pages branch (GitHub Pages)
```

Dependencies are intentionally minimal: `astro`, `@astrojs/mdx`, `gh-pages`. Don't add packages for things plain CSS/JS already handles here.
