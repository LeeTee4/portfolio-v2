export interface PersonalInfo {
  id: string
  name: string
  title?: string
  bio?: string
  profile_image_url?: string
  resume_url?: string
  created_at: string
  updated_at: string
}

export interface ContactDetails {
  id: string
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  description?: string
  grade?: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description?: string
  long_description?: string
  technologies?: string[]
  project_url?: string
  github_url?: string
  image_url?: string
  featured: boolean
  status: "completed" | "in_progress" | "planned"
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  title: string
  issuing_organization: string
  issue_date?: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category?: string
  proficiency_level?: number
  created_at: string
}
