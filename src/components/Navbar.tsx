// Navbar is a React component because it needs useState for the mobile menu toggle.
// It's rendered with client:load in Layout.astro to hydrate the interactivity.
// Note: no "use client" directive needed — that's a Next.js concept, not Astro.

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="flex justify-between items-stretch relative">
      {/* Logo */}
      <a
        href="/"
        className="inline-flex items-center justify-center bg-white text-black border-l-4 border-r-4 border-black font-black text-lg shadow-lg hover:bg-red-500 hover:text-white transition-colors flex-shrink-0 px-4 whitespace-nowrap uppercase"
      >
        Hank Duhaime
      </a>

      {/* Animated Sine Wave */}
      <div className="hidden sm:flex items-center flex-1 overflow-hidden py-3">
        <svg className="w-full h-8" viewBox="0 0 400 40" preserveAspectRatio="none">
          <defs>
            <pattern id="wave" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0,20 Q10,10 20,20 T40,20" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect x="-40" y="0" width="480" height="40" fill="url(#wave)">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="40 0"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-stretch">
        <a href="/#projects" className="text-xs font-black text-black hover:bg-blue-500 hover:text-white transition-colors uppercase tracking-widest px-6 py-3 border-l-4 border-black flex items-center h-full">PROJECTS</a>
        <a href="/#about" className="text-xs font-black text-black hover:bg-green-500 hover:text-white transition-colors uppercase tracking-widest px-6 py-3 border-l-4 border-black flex items-center h-full">ABOUT</a>
        <a href="/#contact" className="text-xs font-black text-black hover:bg-orange-500 hover:text-white transition-colors uppercase tracking-widest px-6 py-3 border-l-4 border-r-4 border-black flex items-center h-full">CONTACT</a>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden text-black hover:bg-gray-200 transition-colors flex-shrink-0 border-l-4 border-black px-4 flex items-center"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b-4 border-black py-4 px-4 z-50 sm:hidden">
          <div className="flex flex-col gap-2">
            <a href="/#projects" onClick={closeMenu} className="text-xs font-black text-black hover:bg-blue-500 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 border-2 border-transparent hover:border-black">PROJECTS</a>
            <a href="/#about" onClick={closeMenu} className="text-xs font-black text-black hover:bg-green-500 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 border-2 border-transparent hover:border-black">ABOUT</a>
            <a href="/#contact" onClick={closeMenu} className="text-xs font-black text-black hover:bg-orange-500 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 border-2 border-transparent hover:border-black">CONTACT</a>
          </div>
        </div>
      )}
    </nav>
  )
}
