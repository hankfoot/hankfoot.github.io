import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Tag } from "@/components/tag"
import contentData from "@/public/content-active.json"

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
}

const projectsData: Project[] = contentData.projects

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = projectsData.find((p) => p.slug === params.id)
  return {
    title: project?.title || "Project",
    description: project?.description || "Project details",
  }
}

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-black uppercase tracking-wider mb-6">{children}</h2>
)

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projectsData.find((p) => p.slug === params.id)

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

        {/* Header Card */}
        <div className="bg-white border-4 border-black p-6 sm:p-8 mb-8">
          <div className="border-b-4 border-black pb-6 mb-6">
            <SectionHeader>{project.title}</SectionHeader>
            <div className="space-y-2 mb-4">
              {project.subtitleUrl ? (
                <a
                  href={project.subtitleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold hover:underline inline-flex items-center gap-2"
                >
                  {project.subtitle}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <p className="text-lg font-bold">{project.subtitle}</p>
              )}
              <p className="text-lg font-bold text-gray-600">{project.year}</p>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-6">{project.description}</p>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white border-4 border-black p-6 sm:p-8 mb-8">
          <SectionHeader>Coming Soon</SectionHeader>
          <p className="text-base leading-relaxed text-gray-600">
            This project page is under construction. More details about {project.title} will be added soon, including
            process documentation, images, and detailed insights into the work.
          </p>
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div className="bg-white border-4 border-black p-6 sm:p-8">
            <SectionHeader>Other Projects</SectionHeader>
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
