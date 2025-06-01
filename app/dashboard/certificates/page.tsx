"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Award, Calendar, Edit, Trash2, Save, X, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Certificate } from "@/lib/types"

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    issuing_organization: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
    description: "",
    image_url: "",
  })
    const [noExpiry, setNoExpiry] = useState(false);

  const handleNoExpiryChange = (e: { target: { checked: any } }) => {
    const checked = e.target.checked;
    setNoExpiry(checked);
    setFormData({
      ...formData,
      expiry_date: checked ? "no_expiry" : "",
    });
  };

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/certificates")
      const result = await response.json()

      if (result.success) {
        setCertificates(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching certificates:", error)
      setMessage({ type: "error", text: "Failed to load certificates" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      issuing_organization: "",
      issue_date: "",
      expiry_date: "",
      credential_id: "",
      credential_url: "",
      description: "",
      image_url: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (cert: Certificate) => {
    setFormData({
      title: cert.title,
      issuing_organization: cert.issuing_organization,
      issue_date: cert.issue_date || "",
      expiry_date: cert.expiry_date || "",
      credential_id: cert.credential_id || "",
      credential_url: cert.credential_url || "",
      description: cert.description || "",
      image_url: cert.image_url || "",
    })
    setEditingId(cert.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = editingId ? `/api/certificates/${editingId}` : "/api/certificates"
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
          text: editingId ? "Certificate updated successfully!" : "Certificate added successfully!",
        })
        resetForm()
        fetchCertificates()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save certificate" })
      }
    } catch (error) {
      console.error("Error saving certificate:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return

    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Certificate deleted successfully!" })
        fetchCertificates()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete certificate" })
      }
    } catch (error) {
      console.error("Error deleting certificate:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    }
  }

  const isExpired = (expiryDate: string) => {
    if (expiryDate === "no_expiry") {
      return false
    }
    else if (new Date(expiryDate) < new Date()) {
      return false
    }
    return true
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
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Manage your professional certifications and achievements</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="mr-2 h-4 w-4" />
          Add Certificate
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
            <CardTitle>{editingId ? "Edit Certificate" : "Add Certificate"}</CardTitle>
            <CardDescription>
              {editingId ? "Update your certificate details" : "Add a new certificate to your portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title *</Label>
                  <Input
                    id="title"
                    placeholder="AWS Certified Solutions Architect"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuing_organization">Issuing Organization *</Label>
                  <Input
                    id="issuing_organization"
                    placeholder="Amazon Web Services"
                    value={formData.issuing_organization}
                    onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
        <Label htmlFor="expiry_date">Expiry Date</Label>
        <div className="flex items-center gap-2">
          <Input
            id="expiry_date"
            type="date"
            value={noExpiry ? "" : formData.expiry_date}
            onChange={(e) =>
              setFormData({ ...formData, expiry_date: e.target.value })
            }
            disabled={noExpiry}
          />
          <label className="flex items-center space-x-1 text-sm">
            <input
              type="checkbox"
              checked={noExpiry}
              onChange={handleNoExpiryChange}
            />
            <span>No Expiry</span>
          </label>
        </div>
      </div>

                <div className="space-y-2">
                  <Label htmlFor="credential_id">Credential ID</Label>
                  <Input
                    id="credential_id"
                    placeholder="ABC123456789"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential_url">Credential URL</Label>
                  <Input
                    id="credential_url"
                    type="url"
                    placeholder="https://verify.example.com/certificate"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Certificate Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/certificate-image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this certificate represents, skills gained, etc..."
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
                      {editingId ? "Update" : "Add"} Certificate
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

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              {cert.image_url && (
                <div className="aspect-video bg-muted">
                  <img
                    src={cert.image_url || "/placeholder.svg"}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      {cert.title}
                    </CardTitle>
                    <CardDescription className="font-medium">{cert.issuing_organization}</CardDescription>
                  </div>
                  {cert.expiry_date && (
                    <Badge variant={isExpired(cert.expiry_date) ? "destructive" : "secondary"}>
                      {isExpired(cert.expiry_date) ? "Expired" : "Valid"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cert.issue_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Issued: {new Date(cert.issue_date).toLocaleDateString()}
                    </div>
                  )}

                  {cert.expiry_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Expires: {cert.expiry_date === "no_expiry" ? "No Expiry Date" : new Date(cert.expiry_date).toLocaleDateString()}
                    </div>
                  )}

                  {cert.credential_id && (
                    <div className="text-sm">
                      <span className="font-medium">ID:</span> {cert.credential_id}
                    </div>
                  )}

                  {cert.description && <p className="text-sm text-muted-foreground">{cert.description}</p>}

                  <div className="flex gap-2">
                    {cert.credential_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Verify
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(cert)}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(cert.id)}>
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
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your professional certifications to showcase your expertise and achievements
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Certificate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
