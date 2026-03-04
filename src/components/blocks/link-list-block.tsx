import { ExternalLink } from "lucide-react"

interface LinkItem {
  label: string
  url: string
  description?: string
}

interface LinkListBlockProps {
  data: {
    variant?: "cards" | "inline"
    heading?: string
    links: LinkItem[]
  }
}

export function LinkListBlock({ data }: LinkListBlockProps) {
  const variant = data.variant || "cards"

  if (variant === "cards") {
    return (
      <section className="mb-8 last:mb-0">
        {data.heading && (
          <h2 className="text-2xl font-black uppercase tracking-wider mb-6 pb-3 border-b-4 border-black">
            {data.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 border-black p-4 bg-white hover:shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-black uppercase group-hover:underline">{link.label}</h3>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-black" />
              </div>
              {link.description && (
                <p className="text-xs text-gray-600 mt-2 leading-snug">{link.description}</p>
              )}
            </a>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8 last:mb-0">
      {data.heading && (
        <h2 className="text-2xl font-black uppercase tracking-wider mb-6 pb-3 border-b-4 border-black">
          {data.heading}
        </h2>
      )}
      <ul className="space-y-3">
        {data.links.map((link, i) => (
          <li key={i}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-bold hover:underline group border-l-4 border-black pl-4 py-1"
            >
              <span className="text-black">{link.label}</span>
              <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-black" />
            </a>
            {link.description && (
              <p className="text-xs text-gray-500 ml-8 mt-1">{link.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
