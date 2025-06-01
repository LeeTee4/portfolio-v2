"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Header } from "../components/portfolio/header"

import { Hero } from "../components/portfolio/hero"
import { ProjectsSection } from "../components/portfolio/projects-section"
import { EducationSection } from "../components/portfolio/education-section"
import { CertificatesSection } from "../components/portfolio/certificates-section"
import { ContactSection } from "../components/portfolio/contact-section"
import { Footer } from "../components/portfolio/footer"
import { Certificate, ContactDetails, Education, PersonalInfo, Project, Skill } from "../lib/types"
import { SkillsSection } from "@/components/portfolio/skills-section"

export default function HomePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [personalResponse, contactResponse, projectsResponse, educationResponse, certificatesResponse] =
          await Promise.all([
            fetch("/api/personal-info"),
            fetch("/api/contact-details"),
            fetch("/api/projects"),
            fetch("/api/education?limit=3"),
            fetch("/api/certificates?limit=6"),
            fetch("/api/skills"),
          ])

        const [personalResult, contactResult, projectsResult, educationResult, certificatesResult] = await Promise.all([
          personalResponse.json(),
          contactResponse.json(),
          projectsResponse.json(),
          educationResponse.json(),
          certificatesResponse.json(),
        ])

        if (personalResult.success) setPersonalInfo(personalResult.data)
        if (contactResult.success) setContactDetails(contactResult.data)
        if (projectsResult.success) setProjects(projectsResult.data || [])
        if (educationResult.success) setEducation(educationResult.data || [])
        if (certificatesResult.success) setCertificates(certificatesResult.data || [])
      } catch (error) {
        console.error("Error fetching portfolio data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header personalInfo={personalInfo} />
      <main>
        <Hero personalInfo={personalInfo} contactDetails={contactDetails} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} showViewAll={true} />
        <EducationSection education={education} />
        <CertificatesSection certificates={certificates} />
        <ContactSection contactDetails={contactDetails} />
      </main>
      <Footer personalInfo={personalInfo} />
    </div>
  )
}
