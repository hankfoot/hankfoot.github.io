// Section wraps a group of blocks with a numbered color header.
// Used in MDX project files to create visual sections.
// Example: <Section number={1} label="OVERVIEW" color="#3b82f6">...</Section>

interface SectionProps {
  number: number
  label: string
  color: string
  children: React.ReactNode
}

export function Section({ number, label, color, children }: SectionProps) {
  return (
    <div className="border-4 border-black bg-white mb-12 overflow-hidden">
      <div
        className="flex items-center gap-3 text-white p-3 border-b-4 border-black"
        style={{ backgroundColor: color }}
      >
        <div className="inline-flex items-center justify-center w-10 h-10 bg-white text-black border-4 border-black font-black text-lg shadow-lg">
          {number}
        </div>
        <h2 className="text-2xl font-black">{label}</h2>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  )
}
