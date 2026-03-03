import Image from "next/image"

interface Side {
  label: string
  image: string
  bullets?: string[]
}

interface BeforeAfterBlockProps {
  data: {
    variant?: "side-by-side" | "stacked"
    heading?: string
    before: Side
    after: Side
  }
}

export function BeforeAfterBlock({ data }: BeforeAfterBlockProps) {
  const variant = data.variant || "side-by-side"

  // ── SIDE-BY-SIDE: two columns with label badges ──
  if (variant === "side-by-side") {
    return (
      <section className="mb-8 last:mb-0 border-4 border-black bg-white">
        {data.heading && (
          <div className="p-4 border-b-4 border-black">
            <h3 className="text-xl font-black uppercase tracking-wider">{data.heading}</h3>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Before */}
          <div className="border-b-4 md:border-b-0 md:border-r-4 border-black">
            <div className="bg-gray-200 px-4 py-2 border-b-2 border-black">
              <span className="text-xs font-black uppercase tracking-wider">{data.before.label}</span>
            </div>
            <div className="relative w-full bg-gray-50" style={{ aspectRatio: "4/3" }}>
              <Image src={data.before.image} alt={data.before.label} fill className="object-contain" sizes="50vw" />
            </div>
            {data.before.bullets && (
              <ul className="p-4 space-y-2 border-t-2 border-black">
                {data.before.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-snug flex gap-2">
                    <span className="text-black font-black">•</span> {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* After */}
          <div>
            <div className="bg-black px-4 py-2 border-b-2 border-black">
              <span className="text-xs font-black uppercase tracking-wider text-white">{data.after.label}</span>
            </div>
            <div className="relative w-full bg-gray-50" style={{ aspectRatio: "4/3" }}>
              <Image src={data.after.image} alt={data.after.label} fill className="object-contain" sizes="50vw" />
            </div>
            {data.after.bullets && (
              <ul className="p-4 space-y-2 border-t-2 border-black">
                {data.after.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-snug flex gap-2">
                    <span className="text-black font-black">•</span> {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── STACKED: vertically stacked with divider ──
  return (
    <section className="mb-8 last:mb-0 border-4 border-black bg-white">
      {data.heading && (
        <div className="p-4 border-b-4 border-black">
          <h3 className="text-xl font-black uppercase tracking-wider">{data.heading}</h3>
        </div>
      )}
      {/* Before */}
      <div>
        <div className="bg-gray-200 px-4 py-2 border-b-2 border-black">
          <span className="text-xs font-black uppercase tracking-wider">{data.before.label}</span>
        </div>
        <div className="relative w-full bg-gray-50" style={{ aspectRatio: "16/9" }}>
          <Image src={data.before.image} alt={data.before.label} fill className="object-contain" sizes="100vw" />
        </div>
        {data.before.bullets && (
          <ul className="p-4 space-y-2 border-t-2 border-black">
            {data.before.bullets.map((b, i) => (
              <li key={i} className="text-xs text-gray-600 leading-snug flex gap-2">
                <span className="text-black font-black">•</span> {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Divider */}
      <div className="border-t-4 border-black bg-black px-4 py-2 flex items-center justify-center">
        <span className="text-xs font-black uppercase tracking-widest text-white">▼ AFTER ▼</span>
      </div>
      {/* After */}
      <div>
        <div className="relative w-full bg-gray-50" style={{ aspectRatio: "16/9" }}>
          <Image src={data.after.image} alt={data.after.label} fill className="object-contain" sizes="100vw" />
        </div>
        {data.after.bullets && (
          <ul className="p-4 space-y-2 border-t-2 border-black">
            {data.after.bullets.map((b, i) => (
              <li key={i} className="text-xs text-gray-600 leading-snug flex gap-2">
                <span className="text-black font-black">•</span> {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
