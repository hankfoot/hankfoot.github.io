interface TextBlockProps {
  data: {
    variant?: "default" | "numbered" | "bullets"
    heading?: string
    body?: string[]
    items?: string[]
    stepNumber?: string
    anchorId?: string
  }
}

export function TextBlock({ data }: TextBlockProps) {
  const variant = data.variant || "default"

  // ── DEFAULT: heading + paragraphs ──
  if (variant === "default") {
    return (
      <section id={data.anchorId} className="mb-8 last:mb-0">
        {data.heading && (
          <h2 className="text-2xl font-black uppercase tracking-wider mb-4 pb-3 border-b-4 border-black">
            {data.heading}
          </h2>
        )}
        {data.body?.map((paragraph, i) => (
          <p key={i} className="text-base text-gray-700 leading-relaxed mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </section>
    )
  }

  // ── NUMBERED: step number badge + heading + paragraphs ──
  if (variant === "numbered") {
    return (
      <section id={data.anchorId} className="mb-8 last:mb-0">
        <div className="flex items-center gap-4 mb-4 pb-3 border-b-4 border-black">
          {data.stepNumber && (
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white border-4 border-black rounded-full text-lg font-black flex-shrink-0">
              {data.stepNumber}
            </div>
          )}
          {data.heading && (
            <h2 className="text-2xl font-black uppercase tracking-wider">{data.heading}</h2>
          )}
        </div>
        {data.body?.map((paragraph, i) => (
          <p key={i} className="text-base text-gray-700 leading-relaxed mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </section>
    )
  }

  // ── BULLETS: heading + bulleted list with thick left accent ──
  return (
    <section id={data.anchorId} className="mb-8 last:mb-0">
      {data.heading && (
        <h2 className="text-2xl font-black uppercase tracking-wider mb-4 pb-3 border-b-4 border-black">
          {data.heading}
        </h2>
      )}
      <ul className="space-y-3">
        {(data.items || data.body)?.map((item, i) => (
          <li key={i} className="flex gap-3 items-start border-l-4 border-black pl-4 py-1">
            <span className="text-base text-gray-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
