import Image from "next/image"

interface ImageBlockProps {
  data: {
    variant?: "full" | "contained"
    src: string
    alt?: string
    caption?: string
  }
}

export function ImageBlock({ data }: ImageBlockProps) {
  const variant = data.variant || "full"

  // ── FULL: edge-to-edge image, optional caption ──
  if (variant === "full") {
    return (
      <figure className="mb-8 last:mb-0">
        <div className="relative w-full border-4 border-black overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <Image src={data.src} alt={data.alt || ""} fill className="object-cover" sizes="100vw" />
        </div>
        {data.caption && (
          <figcaption className="mt-2 text-xs text-gray-500 italic text-center">{data.caption}</figcaption>
        )}
      </figure>
    )
  }

  // ── CONTAINED: max-width constrained, centered, bordered ──
  return (
    <figure className="mb-8 last:mb-0 flex flex-col items-center">
      <div className="relative w-full max-w-2xl border-4 border-black bg-white p-2 overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image src={data.src} alt={data.alt || ""} fill className="object-contain" sizes="(max-width: 768px) 100vw, 672px" />
      </div>
      {data.caption && (
        <figcaption className="mt-3 text-xs text-gray-500 italic text-center">{data.caption}</figcaption>
      )}
    </figure>
  )
}
