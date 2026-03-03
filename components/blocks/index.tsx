import { HeroBlock } from "./hero-block"
import { TextBlock } from "./text-block"
import { ImageBlock } from "./image-block"
import { VideoBlock } from "./video-block"
import { GalleryBlock } from "./gallery-block"
import { CalloutBlock } from "./callout-block"
import { BeforeAfterBlock } from "./before-after-block"
import { LinkListBlock } from "./link-list-block"

/* eslint-disable @typescript-eslint/no-explicit-any */
const blockComponents: Record<string, React.FC<{ data: any; project?: any }>> = {
  hero: HeroBlock,
  text: TextBlock,
  image: ImageBlock,
  video: VideoBlock,
  gallery: GalleryBlock,
  callout: CalloutBlock,
  "before-after": BeforeAfterBlock,
  "link-list": LinkListBlock,
}

export interface Block {
  type: string
  variant?: string
  data: Record<string, any>
  section?: {
    number: number
    label: string
    color: string
  }
}

interface BlockRendererProps {
  blocks: Block[]
  project?: any
}

/* ── Section header matching the homepage SectionHeader ─────────── */
function SectionHeader({ number, label, color }: { number: number; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-3 text-white p-3 border-b-4 border-black"
      style={{ backgroundColor: color }}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 bg-white text-black border-4 border-black font-black text-lg shadow-lg">
        {number}
      </div>
      <h2 className="text-2xl font-black">{label}</h2>
    </div>
  )
}

/**
 * Groups blocks into "sections". A block with a `section` field starts a new
 * group; subsequent blocks without one continue the current group.
 * Blocks before the first section (like hero) are rendered standalone.
 */
function groupBlocks(blocks: Block[]) {
  const groups: { section?: Block["section"]; blocks: Block[] }[] = []

  for (const block of blocks) {
    if (block.section) {
      // Start a new section group
      groups.push({ section: block.section, blocks: [block] })
    } else if (groups.length > 0 && groups[groups.length - 1].section) {
      // Continue the current section group
      groups[groups.length - 1].blocks.push(block)
    } else {
      // Standalone block (no section yet, e.g. hero)
      groups.push({ blocks: [block] })
    }
  }

  return groups
}

export function BlockRenderer({ blocks, project }: BlockRendererProps) {
  const groups = groupBlocks(blocks)

  return (
    <>
      {groups.map((group, gi) => {
        const rendered = group.blocks.map((block, bi) => {
          const Component = blockComponents[block.type]
          if (!Component) {
            console.warn(`Unknown block type: ${block.type}`)
            return null
          }
          return (
            <Component
              key={`${block.type}-${bi}`}
              data={{ ...block.data, variant: block.variant }}
              project={project}
            />
          )
        })

        // Standalone blocks (no section) render without a wrapper
        if (!group.section) {
          return <div key={`group-${gi}`}>{rendered}</div>
        }

        // Section-wrapped blocks get the numbered header + card
        return (
          <div key={`group-${gi}`} className="border-4 border-black bg-white mb-12 overflow-hidden">
            <SectionHeader
              number={group.section.number}
              label={group.section.label}
              color={group.section.color}
            />
            <div className="p-6 sm:p-8">{rendered}</div>
          </div>
        )
      })}
    </>
  )
}
