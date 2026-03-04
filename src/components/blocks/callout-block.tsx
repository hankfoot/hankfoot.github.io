interface CalloutBlockProps {
  data: {
    variant?: "note" | "quote" | "stat"
    text: string
    attribution?: string
    label?: string
    statValue?: string
  }
}

export function CalloutBlock({ data }: CalloutBlockProps) {
  const variant = data.variant || "note"

  if (variant === "note") {
    return (
      <section className="mb-8 last:mb-0">
        <div className="border-4 border-black bg-amber-50 p-6 border-l-8">
          <p className="text-base text-gray-800 leading-relaxed">
            <span className="font-black uppercase text-sm tracking-wider mr-2">Note:</span>
            {data.text}
          </p>
        </div>
      </section>
    )
  }

  if (variant === "quote") {
    return (
      <section className="mb-8 last:mb-0">
        <blockquote className="border-4 border-black bg-white p-8">
          <div className="border-t-4 border-b-4 border-black py-6">
            <p className="text-2xl sm:text-3xl italic text-gray-800 leading-snug font-semibold">
              &ldquo;{data.text}&rdquo;
            </p>
            {data.attribution && (
              <p className="text-sm font-black uppercase tracking-wider text-gray-500 mt-4">— {data.attribution}</p>
            )}
          </div>
        </blockquote>
      </section>
    )
  }

  return (
    <section className="mb-8 last:mb-0">
      <div className="border-4 border-black bg-black p-8 flex items-center gap-6">
        <span className="text-5xl sm:text-6xl font-black text-white flex-shrink-0">{data.statValue || data.text}</span>
        <span className="text-lg font-bold text-gray-300 leading-snug">{data.statValue ? data.text : data.label || ""}</span>
      </div>
    </section>
  )
}
