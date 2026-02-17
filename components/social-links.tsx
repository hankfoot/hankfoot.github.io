import { ExternalLink, Linkedin } from "lucide-react"

// Bluesky doesn't have a lucide-react icon, so we use an inline SVG
function BlueskyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 568 501" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873C309.719 181.68 379.759 82.553 444.879 33.664C489.726 -1.611 568 -28.906 568 57.947C568 108.845 546.055 174.417 535.846 199.316C509.349 268.63 449.413 282.335 395.476 272.091C504.052 291.328 530.076 361.418 493.188 420.508C424.159 531.281 350.932 408.117 318.631 348.612C313.285 338.843 310.911 333.968 284 333.968C257.089 333.968 254.715 338.843 249.369 348.612C217.068 408.117 143.841 531.281 74.812 420.508C37.924 361.418 63.948 291.328 172.524 272.091C118.587 282.335 58.651 268.63 32.154 199.316C21.945 174.417 0 108.845 0 57.947C0 -28.906 78.274 -1.611 123.121 33.664Z" />
    </svg>
  )
}

interface SocialData {
  bluesky?: string
  linkedin?: string
  resume?: string
}

interface SocialLinksProps {
  social: SocialData
  variant: "icon" | "button"
}

export function SocialLinks({ social, variant }: SocialLinksProps) {
  if (variant === "icon") {
    return (
      <div className="flex gap-4">
        {social.bluesky && (
          <a href={social.bluesky} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <BlueskyIcon className="h-6 w-6" />
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
        )}
      </div>
    )
  }

  // variant === "button"
  return (
    <div className="flex flex-col gap-4">
      {social.bluesky && (
        <a
          href={social.bluesky}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-3 text-sm transition-colors"
        >
          <BlueskyIcon className="mr-2 h-4 w-4" /> BLUESKY
        </a>
      )}
      {social.linkedin && (
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-3 text-sm transition-colors"
        >
          <Linkedin className="mr-2 h-4 w-4" /> LINKEDIN
        </a>
      )}
      {social.resume && (
        <a
          href={social.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 font-black px-8 py-3 border-2 border-black text-sm transition-colors"
        >
          <ExternalLink className="mr-2 h-4 w-4" /> RESUME
        </a>
      )}
    </div>
  )
}
