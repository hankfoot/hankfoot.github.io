import Image from "next/image"
import { Tag } from "@/components/tag"
import { ExternalLink } from "lucide-react"

interface HeroBlockProps {
  data: {
    variant?: "banner" | "banner-compact" | "banner-cinematic" | "split" | "overlay"
    image?: string
    metadata?: { label: string; value: string }[]
  }
  project?: {
    title: string
    subtitle?: string
    subtitleUrl?: string
    year?: string
    tags?: string[]
    description?: string
    heroImage?: string
    metadata?: { label: string; value: string }[]
  }
}

export function HeroBlock({ data, project }: HeroBlockProps) {
  const variant = data.variant || "banner"
  const heroImage = data.image || project?.heroImage
  const metadata = data.metadata || project?.metadata

  const metadataRow = metadata && (
    <div className="flex flex-wrap gap-3 mt-4">
      {metadata.map((m) => (
        <div key={m.label} className="border-2 border-black bg-white px-3 py-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{m.label}</span>
          <span className="text-xs font-bold ml-2">{m.value}</span>
        </div>
      ))}
    </div>
  )

  const tags = project?.tags && (
    <div className="flex gap-2 flex-wrap mt-4">
      {project.tags.map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </div>
  )

  const subtitle = project?.subtitle && (
    project.subtitleUrl ? (
      <a href={project.subtitleUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline inline-flex items-center gap-1.5">
        {project.subtitle}
        <ExternalLink className="h-4 w-4" />
      </a>
    ) : (
      <p className="text-lg font-bold">{project.subtitle}</p>
    )
  )

  // ── BANNER: image on top, full info underneath ──
  if (variant === "banner") {
    return (
      <section className="mb-12 border-4 border-black bg-white">
        {heroImage && (
          <div className="relative w-full border-b-4 border-black" style={{ aspectRatio: "16/9" }}>
            <Image src={heroImage} alt={project?.title || "Hero"} fill className="object-cover" sizes="100vw" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">{project?.title}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {subtitle}
            {project?.year && <span className="text-lg font-bold text-gray-400">{project.year}</span>}
          </div>
          {project?.description && (
            <p className="text-base text-gray-600 leading-relaxed mt-3">{project.description}</p>
          )}
          {metadataRow}
          {tags}
        </div>
      </section>
    )
  }

  // ── BANNER-COMPACT: tighter layout, metadata inline with subtitle ──
  if (variant === "banner-compact") {
    return (
      <section className="mb-12 border-4 border-black bg-white">
        {heroImage && (
          <div className="relative w-full border-b-4 border-black" style={{ aspectRatio: "21/9" }}>
            <Image src={heroImage} alt={project?.title || "Hero"} fill className="object-cover" sizes="100vw" />
          </div>
        )}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">{project?.title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {subtitle}
                {project?.year && <span className="text-sm font-bold text-gray-400">{project.year}</span>}
              </div>
            </div>
            {metadata && (
              <div className="flex flex-wrap gap-2">
                {metadata.map((m) => (
                  <div key={m.label} className="border-2 border-black px-2 py-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{m.label}</span>
                    <span className="text-xs font-bold ml-1.5">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {project?.description && (
            <p className="text-sm text-gray-600 leading-relaxed mt-3">{project.description}</p>
          )}
          {tags}
        </div>
      </section>
    )
  }

  // ── BANNER-CINEMATIC: full-bleed image with gradient text overlay at bottom ──
  if (variant === "banner-cinematic") {
    return (
      <section className="mb-12 border-4 border-black relative overflow-hidden">
        {heroImage && (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image src={heroImage} alt={project?.title || "Hero"} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">{project?.title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {project?.subtitle && (
                  project.subtitleUrl ? (
                    <a href={project.subtitleUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-200 hover:text-white hover:underline inline-flex items-center gap-1.5">
                      {project.subtitle}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-lg font-bold text-gray-200">{project.subtitle}</span>
                  )
                )}
                {project?.year && <span className="text-lg font-bold text-gray-400">{project.year}</span>}
              </div>
            </div>
          </div>
        )}
        <div className="p-6 sm:p-8 bg-white">
          {project?.description && (
            <p className="text-base text-gray-600 leading-relaxed">{project.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {tags}
            {metadata && (
              <div className="flex flex-wrap gap-2 ml-auto">
                {metadata.map((m) => (
                  <div key={m.label} className="border-2 border-black px-3 py-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{m.label}</span>
                    <span className="text-xs font-bold ml-2">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── SPLIT: two columns — text left, image right ──
  if (variant === "split") {
    return (
      <section className="mb-12 border-4 border-black bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 sm:p-8 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-black">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">{project?.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              {subtitle}
              {project?.year && <span className="text-lg font-bold text-gray-400">{project.year}</span>}
            </div>
            {project?.description && <p className="text-base text-gray-600 leading-relaxed mt-4">{project.description}</p>}
            {metadataRow}
            {tags}
          </div>
          {heroImage && (
            <div className="relative min-h-[300px] md:min-h-0 bg-gray-100">
              <Image src={heroImage} alt={project?.title || "Hero"} fill className="object-cover" sizes="50vw" />
            </div>
          )}
        </div>
      </section>
    )
  }

  // ── OVERLAY: text over darkened image ──
  return (
    <section className="mb-12 border-4 border-black relative overflow-hidden" style={{ minHeight: "400px" }}>
      {heroImage && (
        <Image src={heroImage} alt={project?.title || "Hero"} fill className="object-cover" sizes="100vw" />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-end h-full min-h-[400px]">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">{project?.title}</h1>
        {project?.subtitle && <p className="text-lg font-bold text-gray-200 mt-1">{project.subtitle}</p>}
        {project?.year && <p className="text-lg font-bold text-gray-400 mt-1">{project.year}</p>}
        {project?.description && <p className="text-base text-gray-300 leading-relaxed mt-3">{project.description}</p>}
        {metadata && (
          <div className="flex flex-wrap gap-3 mt-4">
            {metadata.map((m) => (
              <div key={m.label} className="border-2 border-white bg-white/10 backdrop-blur px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-300">{m.label}</span>
                <span className="text-xs font-bold text-white ml-2">{m.value}</span>
              </div>
            ))}
          </div>
        )}
        {project?.tags && (
          <div className="flex gap-2 flex-wrap mt-4">
            {project.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full border-2 border-white bg-white/10 text-white text-xs px-3 py-1 font-normal">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
