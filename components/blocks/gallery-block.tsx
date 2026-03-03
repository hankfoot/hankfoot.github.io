import Image from "next/image"

interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

interface GalleryBlockProps {
  data: {
    variant?: "grid" | "masonry" | "scroll"
    images: GalleryImage[]
    columns?: number
  }
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  const variant = data.variant || "grid"
  const cols = data.columns || 2

  // ── GRID: responsive column grid ──
  if (variant === "grid") {
    const gridClass = cols === 3
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 gap-4"

    return (
      <section className="mb-8 last:mb-0">
        <div className={gridClass}>
          {data.images.map((img, i) => (
            <figure key={i} className="border-4 border-black bg-white overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                <Image src={img.src} alt={img.alt || ""} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
              {img.caption && (
                <figcaption className="p-2 text-xs text-gray-600 font-semibold border-t-2 border-black">{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>
    )
  }

  // ── MASONRY: CSS columns for mixed aspect ratios ──
  if (variant === "masonry") {
    return (
      <section className="mb-8 last:mb-0" style={{ columnCount: cols, columnGap: "1rem" }}>
        {data.images.map((img, i) => (
          <figure key={i} className="border-4 border-black bg-white overflow-hidden mb-4 break-inside-avoid">
            <div className="relative w-full">
              <Image
                src={img.src}
                alt={img.alt || ""}
                width={800}
                height={600}
                className="w-full h-auto"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            {img.caption && (
              <figcaption className="p-2 text-xs text-gray-600 font-semibold border-t-2 border-black">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </section>
    )
  }

  // ── SCROLL: horizontal scrolling strip with snap points ──
  return (
    <section className="mb-8 last:mb-0 -mx-4 px-4">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
        {data.images.map((img, i) => (
          <figure key={i} className="border-4 border-black bg-white overflow-hidden flex-shrink-0 snap-center" style={{ width: "80vw", maxWidth: "500px" }}>
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <Image src={img.src} alt={img.alt || ""} fill className="object-cover" sizes="80vw" />
            </div>
            {img.caption && (
              <figcaption className="p-2 text-xs text-gray-600 font-semibold border-t-2 border-black">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
