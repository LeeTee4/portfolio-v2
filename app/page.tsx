"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Github, Linkedin, Mail, ExternalLink, Calendar, MapPin, Loader2 } from "lucide-react"
import type { Project, Education, Certificate, PersonalInfo, ContactDetails } from "@/lib/types"

export default function HomePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [personalResponse, contactResponse, projectsResponse, educationResponse, certificatesResponse] =
          await Promise.all([
            fetch("/api/personal-info"),
            fetch("/api/contact-details"),
            fetch("/api/projects?featured=true&limit=6"),
            fetch("/api/education?limit=3"),
            fetch("/api/certificates?limit=6"),
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{personalInfo?.name || "Portfolio"}</h1>
          <nav className="flex items-center gap-4">
            <Link href="#projects" className="text-sm hover:underline">
              Projects
            </Link>
            <Link href="#education" className="text-sm hover:underline">
              Education
            </Link>
            <Link href="#certificates" className="text-sm hover:underline">
              Certificates
            </Link>
            <Link href="#contact" className="text-sm hover:underline">
              Contact
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Dashboard</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{personalInfo?.name || "Your Name"}</h1>
          {personalInfo?.title && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">{personalInfo.title}</p>
          )}
          {personalInfo?.bio && (
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{personalInfo.bio}</p>
          )}

          <div className="flex items-center justify-center gap-4 mb-8">
            {contactDetails?.email && (
              <Button asChild variant="outline">
                <a href={`mailto:${contactDetails.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Me
                </a>
              </Button>
            )}
            {personalInfo?.resume_url && (
              <Button asChild>
                <a href={personalInfo.resume_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Resume
                </a>
              </Button>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {contactDetails?.github_url && (
              <Button asChild variant="ghost" size="icon">
                <a href={contactDetails.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            )}
            {contactDetails?.linkedin_url && (
              <Button asChild variant="ghost" size="icon">
                <a href={contactDetails.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projects && projects.length > 0 && (
        <section id="projects" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project: Project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.image_url && (
                    <div className="aspect-video bg-muted">
                      <img
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {project.project_url && (
                        <Button size="sm" asChild>
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-1 h-3 w-3" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section id="education" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Education</h2>
            <div className="space-y-6">
              {education.map((edu: Education) => (
                <Card key={edu.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{edu.degree}</CardTitle>
                        <CardDescription className="text-base font-medium">{edu.institution}</CardDescription>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground mt-1">{edu.field_of_study}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {edu.start_date && (
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(edu.start_date).getFullYear()} -{" "}
                            {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                          </div>
                        )}
                        {edu.grade && <div className="mt-1">Grade: {edu.grade}</div>}
                      </div>
                    </div>
                  </CardHeader>
                  {edu.description && (
                    <CardContent>
                      <p className="text-muted-foreground">{edu.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates && certificates.length > 0 && (
        <section id="certificates" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Certificates</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert: Certificate) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.issuing_organization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cert.issue_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                        </div>
                      )}
                      {cert.credential_url && (
                        <Button size="sm" variant="outline" asChild className="w-full">
                          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            View Certificate
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            I'm always open to discussing new opportunities and interesting projects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {contactDetails?.email && (
              <Button asChild size="lg">
                <a href={`mailto:${contactDetails.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {contactDetails.email}
                </a>
              </Button>
            )}
            {contactDetails?.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {contactDetails.location}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            {contactDetails?.github_url && (
              <Button asChild variant="outline">
                <a href={contactDetails.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {contactDetails?.linkedin_url && (
              <Button asChild variant="outline">
                <a href={contactDetails.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {personalInfo?.name || "Portfolio"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
