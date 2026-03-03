"use client"

import { BlockRenderer, Block } from "@/components/blocks"

const demoProject = {
  title: "Demo Project",
  subtitle: "SpellBound AR",
  subtitleUrl: "https://spellboundar.com/",
  year: "2021",
  tags: ["UX Design", "Unity", "AR", "Healthcare"],
  description: "A sample project used for previewing block components.",
}

/* ── Sample blocks for every type × variant ────────────────────────── */

const heroBlocks: Block[] = [
  {
    type: "hero",
    variant: "banner",
    data: {
      image: "/media/projects/arise/hero/hero-banner.png",
      metadata: [
        { label: "Tools", value: "Figma, Unity, C#" },
      ],
    },
  },
  {
    type: "hero",
    variant: "banner-compact",
    data: {
      image: "/media/projects/arise/hero/hero-banner.png",
      metadata: [
        { label: "Tools", value: "Figma, Unity, C#" },
      ],
    },
  },
  {
    type: "hero",
    variant: "banner-cinematic",
    data: {
      image: "/media/projects/arise/hero/hero-banner.png",
      metadata: [
        { label: "Tools", value: "Figma, Unity, C#" },
      ],
    },
  },
  {
    type: "hero",
    variant: "split",
    data: {
      image: "/media/projects/arise/hero/clamshell-overview.png",
      metadata: [
        { label: "Tools", value: "Figma, Unity" },
      ],
    },
  },
  {
    type: "hero",
    variant: "overlay",
    data: {
      image: "/media/projects/arise/hero/hero-banner.png",
      metadata: [
        { label: "Tools", value: "Figma, Unity, C#" },
      ],
    },
  },
]

const textBlocks: Block[] = [
  {
    type: "text",
    variant: "default",
    data: {
      heading: "Default Text Block",
      body: [
        "This is a default text block with a heading and body paragraphs. It's the most common block type and is used for general prose content.",
        "Multiple paragraphs are rendered sequentially with standard spacing between them.",
      ],
    },
  },
  {
    type: "text",
    variant: "numbered",
    data: {
      stepNumber: "01",
      heading: "Numbered Step Block",
    },
  },
  {
    type: "text",
    variant: "numbered",
    data: {
      stepNumber: "02",
      heading: "Another Numbered Step",
    },
  },
  {
    type: "text",
    variant: "bullets",
    data: {
      heading: "Bullet List Block",
      items: [
        "First bullet point demonstrating the list style",
        "Second bullet with a slightly longer description to show wrapping behavior",
        "Third bullet to show vertical rhythm",
      ],
    },
  },
]

const imageBlocks: Block[] = [
  {
    type: "image",
    variant: "full",
    data: {
      src: "/media/projects/arise/process/gameplay-flows.png",
      alt: "Gameplay flow diagrams",
      caption: "Full-width image with caption (variant: full)",
    },
  },
  {
    type: "image",
    variant: "contained",
    data: {
      src: "/media/projects/arise/hero/clamshell-overview.png",
      alt: "Clamshell overview",
      caption: "Contained image centered with border (variant: contained)",
    },
  },
]

const videoBlocks: Block[] = [
  {
    type: "video",
    variant: "inline",
    data: {
      src: "/placeholder-video.mp4",
      caption: "Inline video — autoplay, muted, looping (variant: inline)",
    },
  },
  {
    type: "video",
    variant: "player",
    data: {
      src: "/placeholder-video.mp4",
      caption: "Player video — with controls (variant: player)",
    },
  },
]

const galleryBlocks: Block[] = [
  {
    type: "gallery",
    variant: "grid",
    data: {
      columns: 2,
      images: [
        { src: "/media/projects/arise/process/child-life-interviews.png", alt: "Interviews", caption: "Research interviews" },
        { src: "/media/projects/arise/process/playtesting.jpg", alt: "Playtesting", caption: "Playtesting session" },
        { src: "/media/projects/arise/process/design-workshops.png", alt: "Workshops", caption: "Design workshops" },
        { src: "/media/projects/arise/process/wireframes.png", alt: "Wireframes", caption: "Low-fi wireframes" },
      ],
    },
  },
  {
    type: "gallery",
    variant: "masonry",
    data: {
      columns: 3,
      images: [
        { src: "/media/projects/arise/process/sketches.jpg", alt: "Sketches", caption: "Early sketches" },
        { src: "/media/projects/arise/process/child-life-interviews.png", alt: "Interviews" },
        { src: "/media/projects/arise/process/gameplay-flows.png", alt: "Flows" },
        { src: "/media/projects/arise/process/wireframes.png", alt: "Wireframes" },
        { src: "/media/projects/arise/process/design-workshops.png", alt: "Workshops" },
      ],
    },
  },
  {
    type: "gallery",
    variant: "scroll",
    data: {
      images: [
        { src: "/media/projects/arise/before-after/menu-before.png", alt: "Menu before" },
        { src: "/media/projects/arise/before-after/menu-after.png", alt: "Menu after" },
        { src: "/media/projects/arise/before-after/inventory-before.png", alt: "Inventory before" },
        { src: "/media/projects/arise/before-after/inventory-after.png", alt: "Inventory after" },
      ],
    },
  },
]

const calloutBlocks: Block[] = [
  {
    type: "callout",
    variant: "note",
    data: {
      text: "Due to patient privacy regulations (HIPAA), we were unable to conduct direct usability testing with pediatric patients.",
    },
  },
  {
    type: "callout",
    variant: "quote",
    data: {
      text: "The redesigned UI made it so much easier for kids to navigate independently — nurses no longer needed to help them start the app.",
      attribution: "Child Life Specialist, Partner Hospital",
    },
  },
  {
    type: "callout",
    variant: "stat",
    data: {
      statValue: "20+",
      text: "pediatric hospitals across the US using ARISE",
    },
  },
]

const beforeAfterBlocks: Block[] = [
  {
    type: "before-after",
    variant: "side-by-side",
    data: {
      heading: "Side-by-Side Comparison",
      before: {
        label: "Before",
        image: "/media/projects/arise/before-after/menu-before.png",
        bullets: ["Cluttered navigation", "Low contrast text"],
      },
      after: {
        label: "After",
        image: "/media/projects/arise/before-after/menu-after.png",
        bullets: ["Simplified hierarchy", "High-contrast palette"],
      },
    },
  },
  {
    type: "before-after",
    variant: "stacked",
    data: {
      heading: "Stacked Comparison",
      before: {
        label: "Before",
        image: "/media/projects/arise/before-after/inventory-before.png",
      },
      after: {
        label: "After",
        image: "/media/projects/arise/before-after/inventory-after.png",
      },
    },
  },
]

const linkListBlocks: Block[] = [
  {
    type: "link-list",
    variant: "cards",
    data: {
      heading: "Card Links",
      links: [
        { label: "Poseidon's Plunder", url: "#", description: "Underwater treasure hunt AR minigame" },
        { label: "Myth Card", url: "#", description: "Collectible creature card game" },
        { label: "Magic Portal", url: "#", description: "AR portal into an undersea world" },
      ],
    },
  },
  {
    type: "link-list",
    variant: "inline",
    data: {
      heading: "Inline Links",
      links: [
        { label: "SpellBound Website", url: "#", description: "Official company site" },
        { label: "App Store Listing", url: "#", description: "Download ARISE on iOS" },
      ],
    },
  },
]

/* ── Section wrapper for each block family ─────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight whitespace-nowrap">{title}</h2>
        <div className="h-1 bg-black flex-1" />
      </div>
      {children}
    </section>
  )
}

function VariantLabel({ label }: { label: string }) {
  return (
    <div className="mb-4 mt-8 first:mt-0">
      <span className="inline-block bg-black text-white text-xs font-black uppercase tracking-wider px-3 py-1">
        variant: {label}
      </span>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function DevBlocksPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <div className="border-4 border-black bg-white p-6 sm:p-8 mb-12">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-2">
            Block Style Guide
          </h1>
          <p className="text-lg text-gray-600">
            Every block type in every variant, rendered with real ARISE images.
            Use this page to compare visual treatments before composing project pages.
          </p>
        </div>

        {/* Hero */}
        <Section title="Hero">
          <VariantLabel label="banner" />
          <BlockRenderer blocks={[heroBlocks[0]]} project={demoProject} />
          <VariantLabel label="banner-compact" />
          <BlockRenderer blocks={[heroBlocks[1]]} project={demoProject} />
          <VariantLabel label="banner-cinematic" />
          <BlockRenderer blocks={[heroBlocks[2]]} project={demoProject} />
          <VariantLabel label="split" />
          <BlockRenderer blocks={[heroBlocks[3]]} project={demoProject} />
          <VariantLabel label="overlay" />
          <BlockRenderer blocks={[heroBlocks[4]]} project={demoProject} />
        </Section>

        {/* Text */}
        <Section title="Text">
          <VariantLabel label="default" />
          <BlockRenderer blocks={[textBlocks[0]]} />
          <VariantLabel label="numbered" />
          <BlockRenderer blocks={[textBlocks[1], textBlocks[2]]} />
          <VariantLabel label="bullets" />
          <BlockRenderer blocks={[textBlocks[3]]} />
        </Section>

        {/* Image */}
        <Section title="Image">
          <VariantLabel label="full" />
          <BlockRenderer blocks={[imageBlocks[0]]} />
          <VariantLabel label="contained" />
          <BlockRenderer blocks={[imageBlocks[1]]} />
        </Section>

        {/* Video */}
        <Section title="Video">
          <p className="text-sm text-gray-500 italic mb-4">
            Video blocks require an actual video file. Placeholders shown below.
          </p>
          <VariantLabel label="inline" />
          <BlockRenderer blocks={[videoBlocks[0]]} />
          <VariantLabel label="player" />
          <BlockRenderer blocks={[videoBlocks[1]]} />
        </Section>

        {/* Gallery */}
        <Section title="Gallery">
          <VariantLabel label="grid (2 columns)" />
          <BlockRenderer blocks={[galleryBlocks[0]]} />
          <VariantLabel label="masonry (3 columns)" />
          <BlockRenderer blocks={[galleryBlocks[1]]} />
          <VariantLabel label="scroll" />
          <BlockRenderer blocks={[galleryBlocks[2]]} />
        </Section>

        {/* Callout */}
        <Section title="Callout">
          <VariantLabel label="note" />
          <BlockRenderer blocks={[calloutBlocks[0]]} />
          <VariantLabel label="quote" />
          <BlockRenderer blocks={[calloutBlocks[1]]} />
          <VariantLabel label="stat" />
          <BlockRenderer blocks={[calloutBlocks[2]]} />
        </Section>

        {/* Before/After */}
        <Section title="Before / After">
          <VariantLabel label="side-by-side" />
          <BlockRenderer blocks={[beforeAfterBlocks[0]]} />
          <VariantLabel label="stacked" />
          <BlockRenderer blocks={[beforeAfterBlocks[1]]} />
        </Section>

        {/* Link List */}
        <Section title="Link List">
          <VariantLabel label="cards" />
          <BlockRenderer blocks={[linkListBlocks[0]]} />
          <VariantLabel label="inline" />
          <BlockRenderer blocks={[linkListBlocks[1]]} />
        </Section>
      </div>
    </div>
  )
}
