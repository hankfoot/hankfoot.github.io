# portfolio site — claude code brief v3

## context

Personal portfolio for Hank Duhaime, interaction designer, Seattle. Visual design is established in Figma. This is Phase 1 only: scaffolding, content architecture, and a working prototype of the core interaction model. No visual polish yet.

## existing site — read first

# the existing codebase is reference only. do not reuse, migrate, or preserve any of it.

Before writing any new code:

1. Create _archive/ at the repo root

2. Move all existing src/ → _archive/src/

3. Move all existing public/ → _archive/public/

4. Commit with message: "chore: archive existing site before rebuild"

5. Then proceed with a clean Astro scaffold

The archive exists for visual reference only. Do not import from it, copy from it, or maintain parity with it. Treat the project as greenfield from this point forward.

## stack

- Framework: Astro (latest) — do not substitute

- MDX via @astrojs/mdx for project content

- Styling: scoped Astro styles + one global.css, no Tailwind

- Fonts: Inter + Source Code Pro via Google Fonts

- Deployment: GitHub Pages (output: 'static')

- No backend, no CMS, no auth

## phase 1 goals

1. Scaffold Astro project with correct structure

2. Define content schema, create 2–3 dummy .mdx project files

3. Build working layout: fixed sidebar + scrollable project grid

4. Implement hand cursor (ambient follower, dual-cursor model)

5. Implement slide-in project pages via Astro View Transitions

6. Implement reduced-motion toggle

# not in scope: visual polish, real content, mobile layout, SEO

## content architecture

Projects live at src/content/projects/[slug].mdx

Frontmatter (Zod-validated via Astro content collections):

title: string

year: number

tags: string[]

thumb: string # relative path to thumbnail

featured: boolean

summary: string # one-liner for project card

Body: MDX with access to a shared component library.

All project block components live at src/components/blocks/ and must be auto-imported into MDX scope via astro.config. Authors should not need to import anything manually inside .mdx files.

Build these block components in phase 1 (stubs ok, real styling later):

VideoEmbed.astro # props: src, caption

ImageGrid.astro # props: images[], caption

Callout.astro # props: type (note|warning), text

PrototypeEmbed.astro # props: src (iframe url), caption

Specs.astro # props: items (label/value pairs)

## layout

Fixed left sidebar (240px) + right scrollable content area.

Sidebar: name, bio, formerly@ stack, nav links, footer (location / email / linkedin).

Sidebar lives in Base.astro layout shell and must never re-render during page transitions.

Project grid: 2-column, staggered vertical offsets on alternating columns.

## navigation + transitions

Each project has a real URL: /work/[slug] — direct links must work.

Use Astro View Transitions. On project page entry, content area slides in from right. On back/close, slides out to right.

Sidebar must remain visually static during all transitions (use persist or keep outside swap zone).

Project page has a close/back button that returns to index with reverse transition.

# sidebar must not flash, repaint, or shift during any navigation

## hand cursor

Dual-cursor model: native cursor remains fully visible and functional at all times. The hand is an expressive ambient overlay — it follows but does not replace.

Build as src/components/HandCursor.astro (client:only)

Behavior:

- Absolutely positioned, pointer-events: none

- Follows mouse via requestAnimationFrame lerp

- Offset from actual cursor (+24px x, +16px y) so it trails behind

- Lerp factor: configurable constant, default 0.12

- Swaps between named states: idle, pointing, grabbing

- Phase 1 states: emoji placeholders (👋 👆 ✊)

- Built so swapping emoji → image sprites requires only a config change

State triggers:

- idle: default, no hover

- pointing: hovering any nav link or interactive element

- grabbing: hovering a project card

# expose window.HandCursor.setState(state) for external components

# do not hide or interfere with the native cursor under any circumstances

## reduced motion toggle

- Visible in sidebar footer at all times

- Persists to localStorage key: 'hank-reduced-motion'

- On load: check localStorage first, then fall back to prefers-reduced-motion

- When reduced motion is ON:

- Hand cursor hidden (display: none)

- Native cursor unaffected

- View Transitions disabled (instantaneous)

- Kill switch on <html data-reduced-motion="true">:

[data-reduced-motion="true"] * { transition: none !important; animation: none !important; }

## file structure

src/

content/

config.ts # zod schema

projects/ # .mdx files

components/

HandCursor.astro

Sidebar.astro

ProjectCard.astro

ProjectPanel.astro

blocks/ # mdx block components

layouts/

Base.astro

pages/

index.astro

work/[slug].astro

styles/

global.css

public/

cursors/ # sprite assets, added later

## done when

- npm run dev shows sidebar + dummy project grid

- Clicking a card slides in the project page, URL updates to /work/[slug]

- Navigating directly to /work/[slug] works without errors

- Hand emoji trails behind cursor with lerp, changes state on hover

- Reduced motion toggle hides hand and kills all transitions instantly

- 2–3 dummy .mdx files exist using at least 2 different block components

- npm run build completes without errors