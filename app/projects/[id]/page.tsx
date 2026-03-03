import Link from "next/link"
import contentData from "@/public/content-active.json"
import { BlockRenderer, Block } from "@/components/blocks"

/* ── per-project content (static imports so they're bundled at build time) ── */
import ariseContent from "@/public/content/projects/arise.json"
import rlHapticsContent from "@/public/content/projects/rl-haptics.json"
import useYourMelonContent from "@/public/content/projects/use-your-melon.json"
import safecrackerContent from "@/public/content/projects/safecracker.json"
import depthChargeContent from "@/public/content/projects/depth-charge.json"
import secondStoryContent from "@/public/content/projects/second-story.json"

const projectContent: Record<string, { blocks: Block[] }> = {
  arise: ariseContent as { blocks: Block[] },
  "rl-haptics": rlHapticsContent as { blocks: Block[] },
  "use-your-melon": useYourMelonContent as { blocks: Block[] },
  safecracker: safecrackerContent as { blocks: Block[] },
  "depth-charge": depthChargeContent as { blocks: Block[] },
  "second-story": secondStoryContent as { blocks: Block[] },
}

interface Project {
  id: number
  slug: string
  title: string
  subtitle: string
  tags: string[]
  year: string
  description: string
  subtitleUrl?: string
  featured?: boolean
  image?: string
  heroImage?: string
  metadata?: { label: string; value: string }[]
}

const projectsData: Project[] = contentData.projects

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projectsData.find((p) => p.slug === id)
  return {
    title: project?.title || "Project",
    description: project?.description || "Project details",
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projectsData.find((p) => p.slug === id)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-8 max-w-md">
          <h1 className="text-4xl font-black uppercase mb-4">Project Not Found</h1>
          <Link href="/" className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 font-black uppercase px-6 py-2 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const content = projectContent[project.slug]
  const otherProjects = projectsData.filter((p) => p.id !== project.id)

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/#projects" className="inline-flex items-center justify-center border-2 border-black font-black uppercase hover:bg-gray-100 px-4 py-2 transition-colors">
            ← Back to Projects
          </Link>
        </div>

        {/* Block-based project content */}
        {content ? (
          <BlockRenderer blocks={content.blocks} project={project} />
        ) : (
          <div className="bg-white border-4 border-black p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6">Coming Soon</h2>
            <p className="text-base leading-relaxed text-gray-600">
              This project page is under construction.
            </p>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div className="bg-white border-4 border-black p-6 sm:p-8 mt-12">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherProjects.slice(0, 4).map((otherProject) => (
                <Link
                  key={otherProject.id}
                  href={`/projects/${otherProject.slug}`}
                  className="bg-white border-2 border-black p-4 hover:bg-gray-50 transition-colors group"
                >
                  <h3 className="text-lg font-black uppercase mb-2 group-hover:underline">{otherProject.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{otherProject.description}</p>
                  <p className="text-xs font-bold text-gray-500">{otherProject.year}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
