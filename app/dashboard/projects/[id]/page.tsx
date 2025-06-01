"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, ArrowLeft, Plus, X, FolderOpen, ExternalLink, Github, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { Project } from "@/lib/types"

const projectStatuses = [
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In Progress" },
  { value: "planned", label: "Planned" },
]

const commonTechnologies = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "TypeScript",
  "JavaScript",
  "Python",
  "Django",
  "Flask",
  "PHP",
  "Laravel",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "Go",
  "Rust",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Vercel",
  "Netlify",
  "Firebase",
  "Supabase",
  "GraphQL",
  "REST API",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
  "Chakra UI",
  "Styled Components",
  "SASS/SCSS",
  "Webpack",
  "Vite",
  "Jest",
  "Cypress",
  "Playwright",
  "Git",
  "GitHub Actions",
  "CI/CD",
]

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [newTechnology, setNewTechnology] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    long_description: "",
    technologies: [] as string[],
    project_url: "",
    github_url: "",
    image_url: "",
    featured: false,
    status: "completed" as "completed" | "in_progress" | "planned",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        const result = await response.json()

        if (result.success) {
          const projectData = result.data
          setProject(projectData)
          setFormData({
            title: projectData.title || "",
            description: projectData.description || "",
            long_description: projectData.long_description || "",
            technologies: projectData.technologies || [],
            project_url: projectData.project_url || "",
            github_url: projectData.github_url || "",
            image_url: projectData.image_url || "",
            featured: projectData.featured || false,
            status: projectData.status || "completed",
            start_date: projectData.start_date || "",
            end_date: projectData.end_date || "",
          })
        } else {
          setMessage({ type: "error", text: "Project not found" })
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        setMessage({ type: "error", text: "Failed to load project" })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTechnology = (tech: string) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }))
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }))
  }

  const handleAddCustomTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      handleAddTechnology(newTechnology.trim())
      setNewTechnology("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Project updated successfully!" })
        setProject(result.data)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update project" })
      }
    } catch (error) {
      console.error("Error updating project:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return

    setDeleting(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Project deleted successfully!" })
        // Redirect to projects list after a short delay
        setTimeout(() => {
          router.push("/dashboard/projects")
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete project" })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setDeleting(false)
    }
  }

  const suggestedTechnologies = commonTechnologies.filter(
    (tech) => !formData.technologies.includes(tech) && tech.toLowerCase().includes(newTechnology.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Project Not Found</h1>
            <p className="text-muted-foreground">The requested project could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">Update your project details</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </>
          )}
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Project Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Project Preview
              </CardTitle>
              <CardDescription>How your project will appear in the portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.image_url && (
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <img
                    src={formData.image_url || "/placeholder.svg"}
                    alt={formData.title || "Project preview"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{formData.title || "Project Title"}</h3>
                {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formData.status}</Badge>
                  {formData.featured && <Badge variant="secondary">Featured</Badge>}
                </div>

                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {formData.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{formData.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {formData.project_url && (
                    <Button size="sm" variant="outline" disabled>
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Live Demo
                    </Button>
                  )}
                  {formData.github_url && (
                    <Button size="sm" variant="outline" disabled>
                      <Github className="mr-1 h-3 w-3" />
                      Code
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core details about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="My Awesome Project"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your project (1-2 sentences)"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={2}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.description.length}/200 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long_description">Detailed Description</Label>
                  <Textarea
                    id="long_description"
                    placeholder="Provide a detailed description of your project, including features, challenges, and solutions..."
                    value={formData.long_description}
                    onChange={(e) => handleInputChange("long_description", e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">{formData.long_description.length}/1000 characters</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                  <p className="text-xs text-muted-foreground">(Will be displayed prominently on your portfolio)</p>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
                <CardDescription>Select or add the technologies used in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Technologies */}
                {formData.technologies.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Technologies</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTechnology(tech)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Technology */}
                <div className="space-y-2">
                  <Label htmlFor="new_technology">Add Technology</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new_technology"
                      placeholder="Type technology name..."
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomTechnology()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddCustomTechnology}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Suggested Technologies */}
                  {newTechnology && suggestedTechnologies.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTechnologies.slice(0, 10).map((tech) => (
                          <Button
                            key={tech}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleAddTechnology(tech)
                              setNewTechnology("")
                            }}
                          >
                            {tech}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Technologies */}
                  {!newTechnology && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Popular technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {commonTechnologies
                          .filter((tech) => !formData.technologies.includes(tech))
                          .slice(0, 15)
                          .map((tech) => (
                            <Button
                              key={tech}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddTechnology(tech)}
                            >
                              {tech}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Links and Media */}
            <Card>
              <CardHeader>
                <CardTitle>Links and Media</CardTitle>
                <CardDescription>Project links and images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project_url">Live Demo URL</Label>
                    <Input
                      id="project_url"
                      type="url"
                      placeholder="https://myproject.com"
                      value={formData.project_url}
                      onChange={(e) => handleInputChange("project_url", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub Repository</Label>
                    <Input
                      id="github_url"
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={formData.github_url}
                      onChange={(e) => handleInputChange("github_url", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Project Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange("image_url", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>When did you work on this project?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange("start_date", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange("end_date", e.target.value)}
                      disabled={formData.status === "in_progress"}
                    />
                    {formData.status === "in_progress" && (
                      <p className="text-xs text-muted-foreground">End date is disabled for in-progress projects</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Statistics */}
            {project && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Statistics</CardTitle>
                  <CardDescription>Information about this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/projects">Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Project...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
