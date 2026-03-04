interface MediaContentProps {
  type: "image" | "video"
  src: string
  alt?: string
  className?: string
}

export function MediaContent({
  type,
  src,
  alt = "Media",
  className = "object-cover",
}: MediaContentProps) {
  if (type === "video") {
    return (
      <video autoPlay muted loop className={`w-full h-full ${className}`}>
        <source src={src} type="video/mp4" />
      </video>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  )
}
