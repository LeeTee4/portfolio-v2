import type { PersonalInfo } from "@/lib/types"

interface FooterProps {
  personalInfo: PersonalInfo | null
}

export function Footer({ personalInfo }: FooterProps) {
  return (
    <footer className="border-t py-8 px-4 bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {personalInfo?.name || "Portfolio"}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
