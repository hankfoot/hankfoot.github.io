# 🎨 Hank Duhaime Portfolio — Style Guide

> Reference document for designing new pages and components in Figma.
> Extracted from the live codebase (Next.js + Tailwind CSS).

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Borders & Shadows](#borders--shadows)
6. [Backgrounds & Textures](#backgrounds--textures)
7. [Components](#components)
8. [Content Blocks](#content-blocks)
9. [Motion & Interaction](#motion--interaction)
10. [Iconography](#iconography)
11. [Responsive Breakpoints](#responsive-breakpoints)

---

## Design Philosophy

The site follows a **neo-brutalist** aesthetic — bold, graphic, and unapologetically heavy. Every element leans into:

- **Thick black borders** (4px) as the primary visual device
- **Flat, high-contrast color** with no gradients or soft shadows
- **All-caps, extra-bold typography** for headings and UI labels
- **Numbered sections** that feel like a structured zine or technical manual
- **Playful accent colors** that change per section to maintain energy

Think: punk poster meets technical documentation.

---

## Color Palette

### Core

| Token               | HSL Value              | Hex (approx.) | Usage                          |
| -------------------- | ---------------------- | -------------- | ------------------------------ |
| `--background`       | `0 0% 100%`           | `#FFFFFF`      | Page background                |
| `--foreground`       | `0 0% 3.6%`           | `#0A0A0A`      | Primary text                   |
| `--primary`          | `0 0% 9%`             | `#171717`      | Buttons, strong UI elements    |
| `--primary-foreground` | `0 0% 98%`           | `#FAFAFA`      | Text on primary                |
| `--border`           | `0 0% 89.8%`          | `#E5E5E5`      | Subtle dividers (rarely used)  |

### Section Accent Colors

Each numbered section on the home page has a signature color used for the section header background.

| Section       | Tailwind Class  | Hex       | RGB               |
| ------------- | --------------- | --------- | ----------------- |
| 1 — Intro     | `bg-red-500`    | `#EF4444` | `239, 68, 68`     |
| 2 — Work      | `bg-blue-500`   | `#3B82F6` | `59, 130, 246`    |
| 3 — About     | `bg-green-500`  | `#22C55E` | `34, 197, 94`     |
| 4 — Contact   | `bg-orange-500` | `#F97316` | `249, 115, 22`    |

### Section Background Tints

Each section also uses a very light tint fill behind the content area.

| Section    | Tailwind Class   | Hex (approx.) |
| ---------- | ---------------- | ------------- |
| Intro      | custom           | `#FFEBEE`     |
| Work       | `bg-blue-50`     | `#EFF6FF`     |
| About      | `bg-green-50`    | `#F0FDF4`     |
| Contact    | `bg-orange-50`   | `#FFF7ED`     |

### Navbar Hover Colors

Nav links use section colors on hover:

| Link      | Hover Color     | Hex       |
| --------- | --------------- | --------- |
| Logo      | `bg-red-500`    | `#EF4444` |
| Projects  | `bg-blue-500`   | `#3B82F6` |
| About     | `bg-green-500`  | `#22C55E` |
| Contact   | `bg-orange-500` | `#F97316` |

### Neutral Grays (from Tailwind defaults)

| Token            | Hex       | Usage                        |
| ---------------- | --------- | ---------------------------- |
| `gray-100`       | `#F3F4F6` | Image placeholder bg         |
| `gray-200`       | `#E5E7EB` | "Before" label bg            |
| `gray-300`       | `#D1D5DB` | Footer secondary text / icon |
| `gray-400`       | `#9CA3AF` | Year text, muted icons       |
| `gray-500`       | `#6B7280` | Metadata labels, captions    |
| `gray-600`       | `#4B5563` | Company names, subtitles     |
| `gray-700`       | `#374151` | Body copy                    |
| `gray-800`       | `#1F2937` | Strong body copy             |
| Black            | `#000000` | Borders, headings, buttons   |
| White            | `#FFFFFF` | Backgrounds, button text     |

### Special Colors

| Usage             | Hex       | Context                         |
| ----------------- | --------- | ------------------------------- |
| Hero name accent  | `#E53935` | "Hank" in the intro headline    |
| Callout note bg   | `amber-50`| `#FFFBEB` — note callout blocks |

---

## Typography

### Font Stack

The site uses the **system font stack** (no custom web fonts loaded). Tailwind's default sans-serif:

```
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

> **Figma equivalent:** Use **Inter** or **SF Pro** as the closest match to the system font rendering on macOS/iOS.

### Type Scale

| Style                   | Size                      | Weight             | Transform    | Tracking         | Usage                              |
| ----------------------- | ------------------------- | ------------------ | ------------ | ---------------- | ---------------------------------- |
| **Display / Hero H1**   | `text-4xl` / `text-5xl`   | `font-black` (900) | —            | `tracking-tighter` | Home hero headline                 |
| **Page Title H1**       | `text-4xl` / `text-5xl`   | `font-black` (900) | `uppercase`  | `tracking-tight` | Project page titles                |
| **Section Title H2**    | `text-2xl`                | `font-black` (900) | `uppercase`  | `tracking-wider` | Section headings (inside headers)  |
| **Card Title H3**       | `text-xl`                 | `font-black` (900) | —            | —                | Project card names                 |
| **Subsection H3**       | `text-2xl`                | `font-black` (900) | —            | —                | "Bio", "Experience", "Skills", etc.|
| **Nav Link**            | `text-xs`                 | `font-black` (900) | `uppercase`  | `tracking-widest`| Navbar items                       |
| **Body (primary)**      | `text-base` (16px)        | `font-semibold` (600) | —         | —                | About paragraphs, descriptions     |
| **Body (secondary)**    | `text-base` (16px)        | normal (400)       | —            | —                | Block paragraphs (text-block)      |
| **Body (small)**        | `text-sm` (14px)          | `font-bold` (700)  | —            | —                | Role titles, footer links          |
| **Caption / Label**     | `text-xs` (12px)          | `font-black` (900) | `uppercase`  | `tracking-wider` | Metadata labels, company names     |
| **Caption (normal)**    | `text-xs` (12px)          | normal / semibold  | —            | —                | Descriptions, tag text, bullets    |
| **Micro Label**         | `text-[10px]`             | `font-bold` (700)  | —            | —                | Metadata value labels              |

### Key Typographic Rules

- **Headings** are always `font-black` (weight 900)
- **Section headers and UI labels** are always `UPPERCASE`
- **Body copy** uses `leading-relaxed` (1.625 line-height)
- **No italic** except in blockquote callouts and image captions
- **Letter spacing:** section headings use `tracking-wider`; nav uses `tracking-widest`; hero headline uses `tracking-tighter`

---

## Spacing & Layout

### Page Container

```
max-width:  max-w-5xl  (1024px)
padding-x:  px-3 / sm:px-4 / lg:px-6
```

Project detail pages use `max-w-4xl` (896px).

### Section Spacing

| Token            | Value      | Usage                         |
| ---------------- | ---------- | ----------------------------- |
| Section gap      | `mb-12`    | Between major home sections   |
| Block gap        | `mb-8`     | Between content blocks        |
| Inner padding    | `p-8`      | Section content areas         |
| Card padding     | `p-4`–`p-6` | Cards, experience items     |
| Grid gap         | `gap-6`–`gap-8` | Between grid items        |

### Grid System

- **Home project cards:** `grid-cols-1 md:grid-cols-2`, `gap-8`
- **About section:** `grid-cols-1 md:grid-cols-2`, `gap-0` (border divider instead)
- **Footer:** `grid-cols-1 md:grid-cols-3`, `gap-0`
- **Gallery grid:** `grid-cols-1 sm:grid-cols-2` (or `lg:grid-cols-3`)
- **Before/After:** `grid-cols-1 md:grid-cols-2`

---

## Borders & Shadows

### Border Rules

Borders are the **primary visual language** of this design. They are used everywhere.

| Weight  | Tailwind           | Pixel  | Usage                                                  |
| ------- | ------------------ | ------ | ------------------------------------------------------ |
| Heavy   | `border-4`         | 4px    | Sections, cards, images, inputs, header, footer        |
| Medium  | `border-2`         | 2px    | Tags, buttons, metadata chips, inner dividers          |
| Accent  | `border-l-4`       | 4px    | Navbar dividers, bullet list left accent               |
| Extra   | `border-l-8`       | 8px    | Note callout left border                               |
| Divider | `border-b-4`       | 4px    | Section header bottom, image bottom in cards           |

- **Border color** is almost always `border-black` (`#000000`)
- **Footer** uses `border-white` on black background
- **Border radius:** `0` everywhere (`--radius: 0rem`) — sharp corners only
  - **Exception:** Tags use `rounded-full` (pill shape)

### Shadows

- **No box-shadow by default**
- **Hover shadow** on cards: `shadow-[12px_12px_0px_rgba(0,0,0,0.2)]` — a hard offset shadow (brutalist style)
- **Link cards hover:** `shadow-[8px_8px_0px_rgba(0,0,0,0.2)]`
- **Logo & section numbers:** `shadow-lg` (standard Tailwind soft shadow — rare usage)

---

## Backgrounds & Textures

### Dot Grid Pattern

The body has a subtle **dot grid** texture:

```css
background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1.5px, transparent 1.5px);
background-size: 20px 20px;
```

- Dot size: 3px diameter (1.5px radius)
- Dot spacing: 20px × 20px grid
- Dot color: 10% black opacity
- Base: white (`#FFFFFF`)

> **In Figma:** Create a 20×20px tile with a 3px black circle at 10% opacity, then use as a pattern fill.

---

## Components

### Navbar

- **Fixed** to top of viewport (`fixed top-0 z-40`)
- Bottom border: `border-b-4 border-black`
- White background
- **Logo:** Left-aligned, `font-black text-lg uppercase`, 4px black side borders, hover → red bg + white text
- **Nav links (desktop):** Right-aligned, `text-xs font-black uppercase tracking-widest`, separated by `border-l-4 border-black`
- **Animated sine wave** SVG fills the space between logo and nav links (desktop only)
- **Mobile:** Hamburger icon (lucide `Menu`/`X`), dropdown panel below header

### Section Header

A reusable pattern across all home page sections:

```
┌──────────────────────────────────┐
│ [NUM]  SECTION TITLE             │  ← colored background, white text
└──────────────────────────────────┘
```

- Background: section accent color (red/blue/green/orange)
- Text: white, `text-2xl font-black`
- Number badge: `w-10 h-10`, white bg, black border-4, `font-black text-lg`, centered
- Padding: `p-3`
- Bottom border: `border-b-4 border-black`

### Project Card

```
┌──────────────────────────────────┐
│                                  │
│        IMAGE / VIDEO             │  ← h-64, bg-gray-100, border-b-4
│                                  │
├──────────────────────────────────┤
│ Title                     Year   │  ← text-xl font-black
│ Subtitle (link)                  │  ← text-xs font-bold text-gray-600
│                                  │
│ Description text...              │  ← text-xs text-gray-700
│                                  │
│ [Tag] [Tag] [Tag]                │  ← pill tags
│                                  │
│ ┌──────────────────────────────┐ │
│ │       VIEW WORK              │ │  ← full-width black button
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

- Outer: `border-4 border-black`, white bg
- Hover: `shadow-[12px_12px_0px_rgba(0,0,0,0.2)]`, entire card is clickable
- Content padding: `p-6 pb-3`

### Tag (Pill)

- `rounded-full`, `border-2 border-black`, white bg
- `text-xs`, normal weight, `px-3 py-1`

### Buttons

#### Primary (Filled)

```
bg-black text-white | hover:bg-gray-800
font-black | px-6 py-2 | text-sm | border-2 border-black
uppercase
```

#### Secondary (Outline)

```
border-4 border-black text-black | hover:bg-black hover:text-white
font-black | px-6 py-2 | text-sm
uppercase
```

#### Social Button (Large)

```
border-4 border-black text-black | hover:bg-black hover:text-white
font-black | px-8 py-3 | text-sm
```

#### Resume Button (CTA)

```
bg-black text-white | hover:bg-gray-800
font-black | px-8 py-3 | text-sm | border-2 border-black
```

### Experience Card

```
┌──────────────────────────────────┐
│ COMPANY NAME           DATES     │  ← xs, font-black, uppercase, gray-600
│ Role Title                       │  ← sm, font-bold, black
│ Description text...              │  ← xs, gray-700
└──────────────────────────────────┘
```

- `border-4 border-black`, white bg, `p-4`

### Footer

- Full-width, `bg-black text-white`, `border-t-4 border-white`
- 3-column grid on desktop, single column on mobile
- Columns separated by `border-l-4 border-r-4 border-white`
- Link hover: `text-gray-300 → text-white`
- Bottom bar: `border-t-4 border-white`, centered copyright, `text-xs text-gray-400`

### Metadata Chip

Used in project hero blocks:

```
border-2 border-black bg-white px-3 py-1
Label: text-[10px] font-black uppercase tracking-wider text-gray-500
Value: text-xs font-bold ml-2
```

---

## Content Blocks

These are the modular blocks used on project detail pages. Each has variants.

### Hero Block

| Variant            | Image Ratio | Layout                                    |
| ------------------ | ----------- | ----------------------------------------- |
| `banner`           | 16:9        | Full-width image → title + info below     |
| `banner-compact`   | 21:9        | Wider/shorter image, tighter info         |
| `banner-cinematic` | 2.76:1      | Ultra-wide, overlay text option           |
| `split`            | —           | 2-column: info left, image right          |
| `overlay`          | 16:9        | Image with dark gradient, text overlaid   |

### Text Block

| Variant    | Layout                                           |
| ---------- | ------------------------------------------------ |
| `default`  | Heading (border-b-4) + body paragraphs           |
| `numbered` | Circled step number + heading (border-b-4) + body |
| `bullets`  | Heading + bulleted list with `border-l-4` accent |

### Image Block

| Variant     | Layout                                     |
| ----------- | ------------------------------------------ |
| `full`      | Edge-to-edge, 16:9, `border-4 border-black` |
| `contained` | Max-width centered, 4:3, padded frame     |

### Gallery Block

| Variant   | Layout                                          |
| --------- | ----------------------------------------------- |
| `grid`    | Responsive column grid (2 or 3 col)             |
| `masonry` | CSS columns, mixed aspect ratios                |
| `scroll`  | Horizontal scroll strip with snap points        |

Each gallery item: `border-4 border-black`, caption below with `border-t-2 border-black`.

### Video Block

| Variant   | Behavior                              |
| --------- | ------------------------------------- |
| `inline`  | Autoplay, muted, loop, no controls   |
| `player`  | Controls visible, click to play       |

Wrapper: `border-4 border-black`.

### Callout Block

| Variant | Style                                                       |
| ------- | ----------------------------------------------------------- |
| `note`  | `amber-50` bg, `border-l-8`, "Note:" prefix in bold        |
| `quote` | White bg, inner `border-t-4 / border-b-4`, large italic text|
| `stat`  | Black bg, huge white number + gray-300 label                |

### Before/After Block

| Variant        | Layout                                    |
| -------------- | ----------------------------------------- |
| `side-by-side` | 2-column, "Before" (gray header) / "After" (black header) |
| `stacked`      | Vertical stack with divider               |

### Link List Block

| Variant  | Layout                                            |
| -------- | ------------------------------------------------- |
| `cards`  | Grid of clickable card tiles with hover shadow    |
| `inline` | Vertical list with `border-l-4` accent + arrows   |

---

## Motion & Interaction

### Transitions

All interactive elements use `transition-colors` (Tailwind default: 150ms ease).

Cards with shadow use `transition-shadow duration-200`.

### Hover States

| Element            | Default                     | Hover                                        |
| ------------------ | --------------------------- | -------------------------------------------- |
| Primary button     | `bg-black text-white`       | `bg-gray-800`                                |
| Outline button     | `border-black text-black`   | `bg-black text-white`                        |
| Project card       | No shadow                   | `shadow-[12px_12px_0px_rgba(0,0,0,0.2)]`    |
| Link card          | No shadow                   | `shadow-[8px_8px_0px_rgba(0,0,0,0.2)]` + `bg-gray-50` |
| Nav link           | `text-black`                | Section color bg + `text-white`              |
| Logo               | `bg-white text-black`       | `bg-red-500 text-white`                      |
| Footer link        | `text-gray-300`             | `text-white`                                 |
| Inline text link   | `text-gray-600 underline`   | `text-black`                                 |

### Animations

- **Sine wave (navbar):** Animated SVG pattern translating 40px horizontally on a 2s infinite loop
- **Images:** Hero photo uses `grayscale` CSS filter

---

## Iconography

Icons come from **Lucide React** (`lucide-react` v0.294).

| Icon             | Usage                       | Size               |
| ---------------- | --------------------------- | ------------------- |
| `Menu`           | Mobile nav open             | `h-6 w-6`          |
| `X`              | Mobile nav close            | `h-6 w-6`          |
| `ExternalLink`   | Outbound links, resume btn  | `h-4 w-4`          |
| `Linkedin`       | Social links                | `h-4 w-4` / `h-6 w-6` |
| Custom Bluesky   | Social links                | `h-4 w-4` / `h-6 w-6` |

---

## Responsive Breakpoints

Standard Tailwind breakpoints:

| Breakpoint | Min-width | Key layout changes                          |
| ---------- | --------- | ------------------------------------------- |
| Default    | 0px       | Single column, mobile nav                   |
| `sm`       | 640px     | 2-col grids appear, desktop nav, sine wave  |
| `md`       | 768px     | Full 2-col layouts, side-by-side sections   |
| `lg`       | 1024px    | 3-col gallery, larger hero text             |

### Container widths

| Context         | Max Width   | Tailwind     |
| --------------- | ----------- | ------------ |
| Home page       | 1024px      | `max-w-5xl`  |
| Project pages   | 896px       | `max-w-4xl`  |

---

## Quick Reference: Design Tokens for Figma

```
BORDER WEIGHT:    4px (primary), 2px (secondary), 8px (callout accent)
BORDER COLOR:     #000000 (light mode), #FFFFFF (footer/dark)
BORDER RADIUS:    0px (everything except tags)
TAG RADIUS:       9999px (full pill)

SHADOW (hover):   X: 12, Y: 12, Blur: 0, Color: rgba(0,0,0,0.2)
SHADOW (small):   X: 8, Y: 8, Blur: 0, Color: rgba(0,0,0,0.2)

FONT FAMILY:      Inter (or SF Pro)
FONT WEIGHTS:     400 (normal), 600 (semibold), 700 (bold), 900 (black)

DOT GRID:         3px dots, 20px spacing, 10% black opacity on white

MAX WIDTH:        1024px (home), 896px (project)
```

---

*Generated from codebase on Feb 20, 2026.*
