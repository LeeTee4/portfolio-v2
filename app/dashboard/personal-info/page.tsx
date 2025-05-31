"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Save,
  User,
  FileText,
  ImageIcon,
  ExternalLink,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PersonalInfo } from "@/lib/types";

export default function PersonalInfoPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    profile_image_url: "",
    resume_url: "",
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await fetch("/api/personal-info");
        const result = await response.json();

        if (result.success && result.data) {
          setPersonalInfo(result.data);
          setFormData({
            name: result.data.name || "",
            title: result.data.title || "",
            bio: result.data.bio || "",
            profile_image_url: result.data.profile_image_url || "",
            resume_url: result.data.resume_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
        setMessage({
          type: "error",
          text: "Failed to load personal information",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/personal-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setPersonalInfo(result.data);
        setMessage({
          type: "success",
          text: "Personal information saved successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to save personal information",
        });
      }
    } catch (error) {
      console.error("Error saving personal info:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Personal Information</h1>
        <p className="text-muted-foreground">
          Manage your profile information and professional details
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Preview
              </CardTitle>
              <CardDescription>
                How your profile will appear to visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={formData.profile_image_url || "/placeholder.svg"}
                    alt={formData.name}
                  />
                  <AvatarFallback className="text-lg">
                    {formData.name ? getInitials(formData.name) : "??"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {formData.name || "Your Name"}
                  </h3>
                  {formData.title && (
                    <p className="text-sm text-muted-foreground">
                      {formData.title}
                    </p>
                  )}
                </div>

                {formData.bio && (
                  <p className="text-sm text-muted-foreground text-center line-clamp-3">
                    {formData.bio}
                  </p>
                )}

                {formData.resume_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      View Resume
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Your core profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      placeholder="Full Stack Developer"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell visitors about yourself, your experience, passions, and what makes you unique..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Media & Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media & Documents
                </CardTitle>
                <CardDescription>
                  Profile image and resume links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile_image_url">Profile Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profile_image_url"
                      type="url"
                      placeholder="https://example.com/your-photo.jpg"
                      value={formData.profile_image_url}
                      onChange={(e) =>
                        handleInputChange("profile_image_url", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume_url">Resume/CV URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="resume_url"
                      type="url"
                      placeholder="https://example.com/your-resume.pdf"
                      value={formData.resume_url}
                      onChange={(e) =>
                        handleInputChange("resume_url", e.target.value)
                      }
                      className="flex-1"
                    />
                    {formData.resume_url && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a
                          href={formData.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Link to your resume hosted on Google Drive, Dropbox, or your
                    website
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Statistics */}
            {personalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Statistics</CardTitle>
                  <CardDescription>
                    Information about your portfolio profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Profile Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(personalInfo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(personalInfo.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Personal Information
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Profile Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Professional Photo</h4>
              <p className="text-sm text-muted-foreground">
                Use a high-quality, professional headshot. Avoid casual photos
                or group pictures.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Compelling Bio</h4>
              <p className="text-sm text-muted-foreground">
                Write in first person, highlight your expertise, and include
                what makes you unique.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Professional Title</h4>
              <p className="text-sm text-muted-foreground">
                Be specific about your role. "Senior React Developer" is better
                than "Developer".
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Updated Resume</h4>
              <p className="text-sm text-muted-foreground">
                Keep your resume current and ensure it's accessible via a public
                link.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
