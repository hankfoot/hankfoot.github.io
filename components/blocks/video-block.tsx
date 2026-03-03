interface VideoBlockProps {
  data: {
    variant?: "inline" | "player"
    src: string
    caption?: string
  }
}

export function VideoBlock({ data }: VideoBlockProps) {
  const variant = data.variant || "inline"

  // ── INLINE: autoplay muted loop, no controls ──
  if (variant === "inline") {
    return (
      <figure className="mb-8 last:mb-0">
        <div className="border-4 border-black overflow-hidden">
          <video autoPlay muted loop playsInline className="w-full">
            <source src={data.src} type="video/mp4" />
          </video>
        </div>
        {data.caption && (
          <figcaption className="mt-2 text-xs text-gray-500 italic text-center">{data.caption}</figcaption>
        )}
      </figure>
    )
  }

  // ── PLAYER: with controls, click to play ──
  return (
    <figure className="mb-8 last:mb-0">
      <div className="border-4 border-black overflow-hidden bg-black">
        <video controls playsInline className="w-full">
          <source src={data.src} type="video/mp4" />
        </video>
      </div>
      {data.caption && (
        <figcaption className="mt-2 text-xs text-gray-500 italic text-center">{data.caption}</figcaption>
      )}
    </figure>
  )
}
