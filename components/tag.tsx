interface TagProps {
  label: string
  className?: string
}

export function Tag({ label, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-black bg-white text-black text-xs px-3 py-1 font-normal ${className}`}
    >
      {label}
    </span>
  )
}
