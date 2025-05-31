"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, GraduationCap, FolderOpen, Award, Eye, Loader2, Code } from "lucide-react"

interface DashboardStats {
  projects: number
  education: number
  certificates: number
  skills: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const result = await response.json()

        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const statsData = [
    {
      title: "Projects",
      count: stats?.projects || 0,
      icon: FolderOpen,
      href: "/dashboard/projects",
    },
    {
      title: "Education",
      count: stats?.education || 0,
      icon: GraduationCap,
      href: "/dashboard/education",
    },
    {
      title: "Certificates",
      count: stats?.certificates || 0,
      icon: Award,
      href: "/dashboard/certificates",
    },
    {
      title: "Skills",
      count: stats?.skills || 0,
      icon: Code,
      href: "/dashboard/skills",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Manage your portfolio content and view your public portfolio</p>
        </div>
        <Button asChild>
          <Link href="/">
            <Eye className="mr-2 h-4 w-4" />
            View Portfolio
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <Button asChild variant="link" className="p-0 h-auto">
                <Link href={stat.href}>Manage {stat.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/personal-info">
                <User className="mr-2 h-4 w-4" />
                Update Personal Info
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/projects">
                <FolderOpen className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/certificates">
                <Award className="mr-2 h-4 w-4" />
                Add Certificate
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/skills">
                <Code className="mr-2 h-4 w-4" />
                Manage Skills
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Status</CardTitle>
            <CardDescription>Your portfolio completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Setup</span>
                <span className="text-green-600">Complete</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Projects Added</span>
                <span className={stats && stats.projects > 0 ? "text-green-600" : "text-yellow-600"}>
                  {stats && stats.projects > 0 ? "Complete" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Education Added</span>
                <span className={stats && stats.education > 0 ? "text-green-600" : "text-yellow-600"}>
                  {stats && stats.education > 0 ? "Complete" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Skills Added</span>
                <span className={stats && stats.skills > 0 ? "text-green-600" : "text-yellow-600"}>
                  {stats && stats.skills > 0 ? "Complete" : "Pending"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
