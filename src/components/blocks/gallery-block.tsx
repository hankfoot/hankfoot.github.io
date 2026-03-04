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

  if (variant === "grid") {
    const gridClass =
      cols === 3
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        : "grid grid-cols-1 sm:grid-cols-2 gap-4"

    return (
      <section className="mb-8 last:mb-0">
        <div className={gridClass}>
          {data.images.map((img, i) => (
            <figure key={i} className="border-4 border-black bg-white overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                <img src={img.src} alt={img.alt || ""} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              {img.caption && (
                <figcaption className="p-2 text-xs text-gray-600 font-semibold border-t-2 border-black">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>
    )
  }

  if (variant === "masonry") {
    return (
      <section className="mb-8 last:mb-0" style={{ columnCount: cols, columnGap: "1rem" }}>
        {data.images.map((img, i) => (
          <figure key={i} className="border-4 border-black bg-white overflow-hidden mb-4 break-inside-avoid">
            <img src={img.src} alt={img.alt || ""} className="w-full h-auto" />
            {img.caption && (
              <figcaption className="p-2 text-xs text-gray-600 font-semibold border-t-2 border-black">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </section>
    )
  }

  // scroll variant
  return (
    <section className="mb-8 last:mb-0 -mx-4 px-4">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {data.images.map((img, i) => (
          <figure
            key={i}
            className="border-4 border-black bg-white overflow-hidden flex-shrink-0 snap-center"
            style={{ width: "80vw", maxWidth: "500px" }}
          >
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <img src={img.src} alt={img.alt || ""} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            {img.caption && (
              <figcaption className="p-2 text-xs text-gray-600 font-semibold border-t-2 border-black">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
