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

  if (variant === "full") {
    return (
      <figure className="mb-8 last:mb-0">
        <div className="relative w-full border-4 border-black overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img src={data.src} alt={data.alt || ""} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        {data.caption && (
          <figcaption className="mt-2 text-xs text-gray-500 italic text-center">{data.caption}</figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure className="mb-8 last:mb-0 flex flex-col items-center">
      <div className="relative w-full max-w-2xl border-4 border-black bg-white p-2 overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img src={data.src} alt={data.alt || ""} className="absolute inset-0 w-full h-full object-contain" />
      </div>
      {data.caption && (
        <figcaption className="mt-3 text-xs text-gray-500 italic text-center">{data.caption}</figcaption>
      )}
    </figure>
  )
}
