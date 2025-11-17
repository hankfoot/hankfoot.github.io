"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { SiBluesky, SiLinkedin } from "react-icons/si"
import activeContent from "@/public/content-active.json"

// Reusable classes
const sectionHeaderClasses = "flex items-center gap-3 text-white p-3 border-b-4 border-black"
const sectionNumberClasses = "inline-flex items-center justify-center w-10 h-10 bg-white text-black border-4 border-black font-black text-lg shadow-lg"
const sectionTitleClasses = "text-2xl font-black"
const cardClasses = "border-4 border-black bg-white p-4"

export default function Home() {
  const router = useRouter()
  
  const SectionHeader = ({ number, title, bgColor }: { number: number; title: string; bgColor: string }) => (
    <div className={sectionHeaderClasses} style={{ backgroundColor: bgColor }}>
      <div className={sectionNumberClasses}>{number}</div>
      <h2 className={sectionTitleClasses}>{title}</h2>
    </div>
  )
  
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-12">
        {/* Hero Section */}
        <section className="mb-12 border-4 border-black">
          <SectionHeader number={1} title="INTRO" bgColor="#ef4444" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-8" style={{backgroundColor: '#FFEBEE'}}>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-black leading-tight mb-4 tracking-tighter">
                My name's <span style={{color: '#E53935'}}>Hank</span>, nice to meet you!
              </h1>
              <p className="text-base text-gray-800 font-semibold leading-relaxed mb-6">
                I'm a design technologist specializing in immersive physical and digital media.
                <br /><br />
                I'm currently prototyping the future of haptics, wearables, and robotics experiences at <a href="https://tech.facebook.com/reality-labs/" className="font-bold text-gray-600 mt-0.5 underline hover:text-black">Meta Reality Labs Research.</a>
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button className="bg-black text-white hover:bg-gray-800 font-black px-6 py-2 text-sm border-2 border-black" asChild>
                  <Link href="#projects">VIEW WORK</Link>
                </Button>
                <Button variant="outline" className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-6 py-2 text-sm" asChild>
                  <Link href="#contact">CONTACT</Link>
                </Button>
              </div>
            </div>
            <div className="h-80 relative bg-transparent">
              <Image
                src="/media/home/intro/hero.png"
                alt="Hank Duhaime"
                fill
                className="object-contain grayscale"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-12 border-4 border-black scroll-mt-20">
          <SectionHeader number={2} title="FEATURED WORK" bgColor="#3b82f6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-blue-50">
            {activeContent.projects.map((project) => {
              // Media mapping for legacy projects (images and videos)
              const projectMedia: Record<number, { type: 'image' | 'video'; src: string; alt?: string }> = {
                1: { type: 'image', src: "/media/home/work/arise_hero.png", alt: "ARISE AR Scavenger Hunt" },
                2: { type: 'video', src: "/media/home/work/use-your-melon_preview.mp4" },
                3: { type: 'video', src: "/media/home/work/safecracker_preview.mp4" },
                4: { type: 'image', src: "/media/home/work/depth-charge_hero.jpeg", alt: "Depth Charge Arcade Cabinet" },
                5: { type: 'video', src: "/media/home/work/second-story-lab_preview.mp4" },
              }

              // Prefer project.image if present, otherwise fallback to mapping
              let media: { type: 'image' | 'video'; src: string; alt?: string } | undefined = undefined;
              if (project.image) {
                media = { type: 'image', src: project.image, alt: project.title };
              } else if (projectMedia[project.id]) {
                media = projectMedia[project.id];
              }

              const isClickable = project.featured !== false;

              return (
                <div key={project.id} className="relative">
                  <div
                    role={isClickable ? "button" : "group"}
                    tabIndex={isClickable ? 0 : -1}
                    onClick={() => isClickable && router.push(`/projects/${project.slug}`)}
                    onKeyDown={(e) => { if (isClickable && e.key === 'Enter') router.push(`/projects/${project.slug}`) }}
                    className={`relative bg-white border-4 border-black ${isClickable ? 'hover:shadow-[12px_12px_0px_rgba(0,0,0,0.2)] cursor-pointer' : ''} transition-shadow duration-200 h-full overflow-visible flex flex-col`}
                  >
                    <div className="h-64 relative bg-gray-100 border-b-4 border-black">
                      {media && media.type === 'image' && (
                        <Image
                          src={media.src}
                          alt={media.alt || 'Project'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      {media && media.type === 'video' && (
                        <video
                          autoPlay
                          muted
                          loop
                          className="w-full h-full object-cover"
                        >
                          <source src={media.src} type="video/mp4" />
                        </video>
                      )}
                    </div>
                <div className="p-6 pb-3 flex flex-col flex-grow">
                  <div className="mb-1.5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-black text-black m-0">{project.title}</h3>
                      <span className="text-xs text-gray-500">{project.year}</span>
                    </div>
                    {project.subtitle && (
                      project.subtitleUrl ? (
                        <a
                          href={project.subtitleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-gray-600 mt-0.5 underline hover:text-black"
                        >
                          {project.subtitle}
                        </a>
                      ) : (
                        <p className="text-xs font-bold text-gray-600 mt-0.5">{project.subtitle}</p>
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-700 font-normal leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {project.tags && project.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full border-2 border-black bg-white text-black text-xs px-3 py-1 font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-black text-white hover:bg-gray-800 font-black py-2.5 text-xs border-2 border-black uppercase mt-auto"
                    onClick={(e) => e.stopPropagation()}
                    asChild
                  >
                    <Link href={`/projects/${project.slug}`}>VIEW WORK</Link>
                  </Button>
                </div>
              </div>
              </div>
              )
            })}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-20 border-4 border-black scroll-mt-20">
          <SectionHeader number={3} title="ABOUT" bgColor="#22c55e" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-green-50">
            {/* Left Column - Hero Image & Summary */}
            <div className="p-8 border-r-4 border-black">
              {/* Bio header */}
              <h3 className="text-2xl font-black text-black mb-6">Bio</h3>
              
              {/* About Photo - Larger and prominent */}
              <div className="relative w-full h-80 mb-6 border-4 border-black bg-white">
                <Image
                  src="/media/home/about/hank-duck.jpg"
                  alt="Hank Duhaime - Interaction Designer & Technologist"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* High-level summary from content-active.json */}
              <div className="space-y-4">
                {activeContent.aboutParagraphs?.map((para: string, idx: number) => (
                  <p key={idx} className={`text-base text-gray-800 leading-relaxed ${idx===0 ? 'font-semibold' : ''}`}>{para}</p>
                ))}
              </div>

              {/* PUBLICATIONS from JSON (moved from right column) */}
              <h3 className="text-2xl font-black text-black mb-6 mt-10">Publications</h3>
              <div className="space-y-4">
                {activeContent.publications?.map((pub: any, idx: number) => (
                  pub.link ? (
                    <a
                      key={idx}
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border-4 border-black bg-black p-4 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <p className="text-xs text-white leading-snug font-semibold">{pub.title}</p>
                    </a>
                  ) : (
                    <div key={idx} className="border-4 border-black bg-black p-4">
                      <p className="text-xs text-white leading-snug font-semibold">{pub.title}</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Right Column - Structured Resume Blocks */}
            <div className="p-8">
              {/* EXPERIENCE */}
              <h3 className="text-2xl font-black text-black mb-2">Experience</h3>
              <p className="text-xs text-gray-600 mb-6">
                Check out my{' '}
                <a href="#contact" className="underline hover:text-black font-bold">
                  resume
                </a>
                {' '}or{' '}
                <a href="https://www.linkedin.com/in/henryduhaime/" target="_blank" rel="noopener noreferrer" className="underline hover:text-black font-bold">
                  LinkedIn
                </a>
                {' '}for more detail!
              </p>
              <div className="space-y-4 mb-10">
                {activeContent.experience?.map((role: any, idx: number) => (
                  <div key={idx} className={cardClasses}>
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs font-black text-gray-600 uppercase tracking-wider">{role.company}</p>
                      <p className="text-[10px] font-bold text-gray-600">{role.dates}</p>
                    </div>
                    <p className="text-sm font-bold text-black mb-1">{role.title}</p>
                    <p className="text-xs text-gray-700 leading-snug">{role.description}</p>
                  </div>
                ))}
              </div>

              {/* EDUCATION */}
              <h3 className="text-2xl font-black text-black mb-6">Education</h3>
              <div className="space-y-4 mb-10">
                {activeContent.education?.map((ed: any, idx: number) => (
                  <div key={idx} className={cardClasses}>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-1">{ed.institution}</p>
                    <p className="text-sm font-bold text-black">{ed.degree}</p>
                  </div>
                ))}
              </div>

              {/* SKILLS GROUPED BY THEMES from JSON */}
              <h3 className="text-2xl font-black text-black mb-4">Skills</h3>
              <div className="space-y-6 mb-10">
                {activeContent.skillGroups?.slice(0, 3).map((group: any, idx: number) => (
                  <div key={idx}>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-2">{group.group}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center rounded-full border-2 border-black bg-white text-black text-xs px-3 py-1 font-normal">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-0 border-4 border-black scroll-mt-20">
          <SectionHeader number={4} title="CONTACT" bgColor="#f97316" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 border-r-4 border-black bg-orange-50">
              <p className="text-lg font-bold text-black mb-4">
                Come find me on the internet!
              </p>
              <p className="text-base text-gray-800 mb-8 leading-relaxed">
                {activeContent.bio.contactMessage}
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-2 tracking-wider">LOCATION</p>
                  <p className="text-base font-semibold text-black">{activeContent.bio.location}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-8 bg-orange-50">
              {activeContent.social.bluesky && (
                <Button variant="outline" className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-3 text-sm" asChild>
                  <a href={activeContent.social.bluesky} target="_blank" rel="noopener noreferrer">
                    <SiBluesky className="mr-2 h-4 w-4" /> BLUESKY
                  </a>
                </Button>
              )}
              {activeContent.social.linkedin && (
                <Button variant="outline" className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-3 text-sm" asChild>
                  <a href={activeContent.social.linkedin} target="_blank" rel="noopener noreferrer">
                    <SiLinkedin className="mr-2 h-4 w-4" /> LINKEDIN
                  </a>
                </Button>
              )}
              {activeContent.social.resume && (
                <Button className="bg-black text-white hover:bg-gray-800 font-black px-8 py-3 border-2 border-black text-sm" asChild>
                  <a href={activeContent.social.resume} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> RESUME
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
