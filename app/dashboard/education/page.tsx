"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, GraduationCap, Calendar, Edit, Trash2, Save, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Education } from "@/lib/types"

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
    grade: "",
    is_current: false,
  })

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/education")
      const result = await response.json()

      if (result.success) {
        setEducation(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching education:", error)
      setMessage({ type: "error", text: "Failed to load education data" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: "",
      grade: "",
      is_current: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (edu: Education) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || "",
      description: edu.description || "",
      grade: edu.grade || "",
      is_current: edu.is_current,
    })
    setEditingId(edu.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = editingId ? `/api/education/${editingId}` : "/api/education"
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
          text: editingId ? "Education updated successfully!" : "Education added successfully!",
        })
        resetForm()
        fetchEducation()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save education" })
      }
    } catch (error) {
      console.error("Error saving education:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Education deleted successfully!" })
        fetchEducation()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete education" })
      }
    } catch (error) {
      console.error("Error deleting education:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    }
  }

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
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-muted-foreground">Manage your educational background</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
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
            <CardTitle>{editingId ? "Edit Education" : "Add Education"}</CardTitle>
            <CardDescription>
              {editingId ? "Update your education details" : "Add a new education entry to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    placeholder="University of Example"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    placeholder="Bachelor of Science"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input
                    id="field_of_study"
                    placeholder="Computer Science"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/GPA</Label>
                  <Input
                    id="grade"
                    placeholder="3.8 GPA"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_current"
                  checked={formData.is_current}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      is_current: checked as boolean,
                      end_date: checked ? "" : formData.end_date,
                    })
                  }
                />
                <Label htmlFor="is_current">Currently studying here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your studies, achievements, relevant coursework..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
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
                      {editingId ? "Update" : "Add"} Education
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

      {/* Education List */}
      {education.length > 0 ? (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {edu.degree}
                    </CardTitle>
                    <CardDescription className="text-base font-medium">{edu.institution}</CardDescription>
                    {edu.field_of_study && <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {edu.is_current && <Badge variant="secondary">Current</Badge>}
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
                </div>
              </CardHeader>
              {edu.description && (
                <CardContent>
                  <p className="text-muted-foreground mb-4">{edu.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(edu)}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(edu.id)}>
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No education entries yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your educational background to showcase your academic achievements
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Education Entry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
