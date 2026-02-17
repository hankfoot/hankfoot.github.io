import Link from "next/link"
import { SocialLinks } from "@/components/social-links"
import activeContent from "@/public/content-active.json"

const linkHoverClasses = "text-gray-300 hover:text-white transition-colors"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-white">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Column 1 - Name & Bio */}
        <div className="py-8 px-8 border-l-4 border-r-4 border-white">
          <h3 className="text-2xl font-black mb-3 uppercase">{activeContent.bio.name}</h3>
          <p className="text-sm font-semibold text-gray-300 leading-relaxed mb-4">
            Design technologist specializing in immersive physical and digital media
          </p>
          <div className="flex gap-4">
            <SocialLinks social={activeContent.social} variant="icon" />
          </div>
        </div>

        {/* Column 2 - Shortcuts */}
        <div className="py-8 px-8 border-r-4 border-white">
          <h4 className="text-base font-black mb-4 uppercase tracking-wider">Shortcuts</h4>
          <ul className="space-y-2.5 text-sm font-semibold">
            <li><Link href="/#projects" className={linkHoverClasses}>Featured Projects</Link></li>
            <li><Link href="/#about" className={linkHoverClasses}>About</Link></li>
            <li><Link href="/#contact" className={linkHoverClasses}>Contact</Link></li>
            <li><a href={activeContent.social.resume} target="_blank" rel="noopener noreferrer" className={linkHoverClasses}>Resume</a></li>
          </ul>
        </div>

        {/* Column 3 - Projects */}
        <div className="py-8 px-8 border-r-4 border-white">
          <h4 className="text-base font-black mb-4 uppercase tracking-wider">Projects</h4>
          <ul className="space-y-2.5 text-sm font-semibold">
            {activeContent.projects.slice(0, 5).map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.slug}`} className={linkHoverClasses}>
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t-4 border-white p-6 text-center">
        <p className="text-xs font-semibold text-gray-400 mb-2">
          © {new Date().getFullYear()} {activeContent.bio.name}
        </p>
        <p className="text-xs font-semibold text-gray-400">
          vibe coded with ♥ using <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors underline">copilot</a>
        </p>
      </div>
    </footer>
  )
}
