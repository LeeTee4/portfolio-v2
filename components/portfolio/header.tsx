"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import type { PersonalInfo } from "@/lib/types"

interface HeaderProps {
  personalInfo: PersonalInfo | null
}

export function Header({ personalInfo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          {personalInfo?.name || "Portfolio"}
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-md hover:bg-primary/10" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#skills" className="text-sm hover:text-primary transition-colors">
            Skills
          </Link>
          <Link href="#projects" className="text-sm hover:text-primary transition-colors">
            Projects
          </Link>
          <Link href="#education" className="text-sm hover:text-primary transition-colors">
            Education
          </Link>
          <Link href="#certificates" className="text-sm hover:text-primary transition-colors">
            Certificates
          </Link>
          <Link href="#contact" className="text-sm hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col gap-4">
            <Link
              href="#skills"
              className="text-sm hover:text-primary transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Skills
            </Link>
            <Link
              href="#projects"
              className="text-sm hover:text-primary transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="#education"
              className="text-sm hover:text-primary transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Education
            </Link>
            <Link
              href="#certificates"
              className="text-sm hover:text-primary transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Certificates
            </Link>
            <Link
              href="#contact"
              className="text-sm hover:text-primary transition-colors p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
