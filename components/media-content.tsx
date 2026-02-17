import Image from "next/image"

interface MediaContentProps {
  type: "image" | "video"
  src: string
  alt?: string
  className?: string
  sizes?: string
}

export function MediaContent({
  type,
  src,
  alt = "Media",
  className = "object-cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: MediaContentProps) {
  if (type === "video") {
    return (
      <video autoPlay muted loop className={`w-full h-full ${className}`}>
        <source src={src} type="video/mp4" />
      </video>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
    />
  )
}
