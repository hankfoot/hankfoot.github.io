import { type ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio website",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Sticky Header */}
        <div className="fixed top-0 left-0 right-0 z-40 border-b-4 border-black">
              <header className="bg-white">
                <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
              <Navbar />
            </div>
          </header>
        </div>
        {/* Add padding to body to account for fixed header */}
            <div className="pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
