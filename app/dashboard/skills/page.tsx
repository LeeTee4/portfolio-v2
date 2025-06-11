"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Plus, Code, Edit, Trash2, Save, X, Star } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Skill } from "@/lib/types"

const skillCategories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Database" },
  { value: "devops", label: "DevOps" },
  { value: "mobile", label: "Mobile" },
  { value: "design", label: "Design" },
  { value: "tools", label: "Tools" },
  { value: "softskills", label: "Soft Skills" },
  { value: "other", label: "Other" },
]

const proficiencyLevels = [
  { value: 1, label: "Beginner", color: "bg-red-500" },
  { value: 2, label: "Basic", color: "bg-orange-500" },
  { value: 3, label: "Intermediate", color: "bg-yellow-500" },
  { value: 4, label: "Advanced", color: "bg-blue-500" },
  { value: 5, label: "Expert", color: "bg-green-500" },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency_level: 1,
    icon_url: "",
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills")
      const result = await response.json()

      if (result.success) {
        setSkills(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching skills:", error)
      setMessage({ type: "error", text: "Failed to load skills" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      proficiency_level: 1,
      icon_url: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category || "",
      proficiency_level: skill.proficiency_level || 1,
      icon_url: skill.icon_url || "",
    })
    setEditingId(skill.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({
          type: "success",
          text: editingId ? "Skill updated successfully!" : "Skill added successfully!",
        })
        resetForm()
        fetchSkills()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save skill" })
      }
    } catch (error) {
      console.error("Error saving skill:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Skill deleted successfully!" })
        fetchSkills()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete skill" })
      }
    } catch (error) {
      console.error("Error deleting skill:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    }
  }

  const getProficiencyLabel = (level: number) => {
    return proficiencyLevels.find((p) => p.value === level)?.label || "Unknown"
  }

  const getProficiencyColor = (level: number) => {
    return proficiencyLevels.find((p) => p.value === level)?.color || "bg-gray-500"
  }

  const filteredSkills =
    selectedCategory === "all" ? skills : skills.filter((skill) => skill.category === selectedCategory)

  const skillsByCategory = skillCategories.reduce(
    (acc, category) => {
      acc[category.value] = skills.filter((skill) => skill.category === category.value)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills and proficiency levels</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Skill" : "Add Skill"}</CardTitle>
            <CardDescription>
              {editingId ? "Update your skill details" : "Add a new skill to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name *</Label>
                  <Input
                    id="name"
                    placeholder="React, Node.js, Python..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proficiency_level">Proficiency Level</Label>
                  <Select
                    value={formData.proficiency_level.toString()}
                    onValueChange={(value) => setFormData({ ...formData, proficiency_level: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`} />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon URL</Label>
                  <Input
                    id="icon"
                    placeholder="e.g www.nodejs.org/nodejs.ico"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? "Update" : "Add"} Skill
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="category-filter">Filter by category:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {skillCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label} ({skillsByCategory[category.value]?.length || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Skills Display */}
      {filteredSkills.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      {skill.name}
                    </CardTitle>
                    {skill.category && (
                      <Badge variant="secondary" className="mt-1">
                        {skillCategories.find((c) => c.value === skill.category)?.label || skill.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skill.proficiency_level && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Proficiency</span>
                        <span className="font-medium">{getProficiencyLabel(skill.proficiency_level)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={skill.proficiency_level * 20} className="flex-1" />
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < (skill.proficiency_level ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(skill.id)}>
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === "all"
                ? "No skills yet"
                : `No ${skillCategories.find((c) => c.value === selectedCategory)?.label} skills`}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {selectedCategory === "all"
                ? "Add your technical skills to showcase your expertise"
                : "No skills found in this category. Try a different filter or add new skills."}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Skills Overview */}
      {skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>Summary of your skills by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {skillCategories.map((category) => {
                const categorySkills = skillsByCategory[category.value] || []
                const avgProficiency =
                  categorySkills.length > 0
                    ? categorySkills.reduce((sum, skill) => sum + (skill.proficiency_level || 0), 0) /
                      categorySkills.length
                    : 0

                return (
                  <div key={category.value} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.label}</span>
                      <Badge variant="outline">{categorySkills.length}</Badge>
                    </div>
                    {categorySkills.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Avg. Proficiency</span>
                          <span>{avgProficiency.toFixed(1)}/5</span>
                        </div>
                        <Progress value={avgProficiency * 20} className="h-2" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
