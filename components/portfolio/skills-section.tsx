"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Skill } from "@/lib/types"
import { motion } from "framer-motion"
import { Code, Database, Palette, Wrench, Smartphone, Cloud, Globe, Star } from "lucide-react"

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) {
    return null
  }

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  // Get category display names and icons
  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { name: string; icon: React.ComponentType<any> }> = {
      frontend: { name: "Frontend Development", icon: Globe },
      backend: { name: "Backend Development", icon: Code },
      database: { name: "Database & Storage", icon: Database },
      devops: { name: "DevOps & Cloud", icon: Cloud },
      mobile: { name: "Mobile Development", icon: Smartphone },
      design: { name: "Design & UI/UX", icon: Palette },
      tools: { name: "Tools & Utilities", icon: Wrench },
      other: { name: "Other Skills", icon: Star },
    }
    return categoryMap[category.toLowerCase()] || { name: category, icon: Star }
  }

  return (
    <section id="skills" className="py-10 px-4 bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 className="text-3xl font-bold">Skills & Expertise</h2>
          <p className="text-gray-500 mt-2">My technical skills and proficiency levels</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
            const categoryInfo = getCategoryInfo(category)
            const CategoryIcon = categoryInfo.icon

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
              >
                <Card className="h-full border-primary/20 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <CategoryIcon className="h-5 w-5 text-primary-dark" />
                      </div>
                      <h3 className="text-lg font-semibold text-primary-dark">{categoryInfo.name}</h3>
                    </div>

                    <div className="space-y-4">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.05 * skillIndex }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {skill.icon_url ? (
                                <img
                                  src={skill.icon_url || "/placeholder.svg"}
                                  alt={`${skill.name} icon`}
                                  className="w-4 h-4 object-contain"
                                  onError={(e) => {
                                    // Hide image if it fails to load
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-primary/60" />
                              )}
                              <span className="font-medium text-sm">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getProficiencyBadge(skill.proficiency_level || 0)}
                              <span className="text-xs text-gray-500">{skill.proficiency_level || 0}/10</span>
                            </div>
                          </div>
                          <div className="relative">
                            <Progress
                              value={(skill.proficiency_level || 0) * 10}
                              className="h-2"
                              indicatorClassName={getProficiencyColor(skill.proficiency_level || 0)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-pulse" />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{getProficiencyLabel(skill.proficiency_level || 0)}</span>
                            <span>{getExperienceLevel(skill.proficiency_level || 0)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary-dark mb-4 text-center">Skills Overview</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
                  const avgProficiency =
                    categorySkills.reduce((sum, skill) => sum + (skill.proficiency_level || 0), 0) /
                    categorySkills.length
                  const categoryInfo = getCategoryInfo(category)

                  return (
                    <div key={category} className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <categoryInfo.icon className="h-4 w-4 text-primary-dark" />
                        <span className="font-medium text-sm">{categoryInfo.name}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{categorySkills.length} skills</span>
                          <span>{avgProficiency.toFixed(1)}/10 avg</span>
                        </div>
                        <Progress value={avgProficiency * 10} className="h-1" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function getProficiencyLabel(level: number): string {
  if (level <= 2) return "Beginner"
  if (level <= 4) return "Basic"
  if (level <= 6) return "Intermediate"
  if (level <= 8) return "Advanced"
  return "Expert"
}

function getExperienceLevel(level: number): string {
  if (level <= 2) return "Learning"
  if (level <= 4) return "Practicing"
  if (level <= 6) return "Competent"
  if (level <= 8) return "Proficient"
  return "Mastery"
}

function getProficiencyColor(level: number): string {
  if (level <= 2) return "bg-red-400"
  if (level <= 4) return "bg-orange-400"
  if (level <= 6) return "bg-yellow-400"
  if (level <= 8) return "bg-blue-400"
  return "bg-green-400"
}

function getProficiencyBadge(level: number) {
  let colorClass = ""
  let label = ""

  if (level <= 2) {
    colorClass = "bg-red-100 text-red-700 border-red-200"
    label = "Beginner"
  } else if (level <= 4) {
    colorClass = "bg-orange-100 text-orange-700 border-orange-200"
    label = "Basic"
  } else if (level <= 6) {
    colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200"
    label = "Intermediate"
  } else if (level <= 8) {
    colorClass = "bg-blue-100 text-blue-700 border-blue-200"
    label = "Advanced"
  } else {
    colorClass = "bg-green-100 text-green-700 border-green-200"
    label = "Expert"
  }

  return <Badge className={`${colorClass} text-xs font-normal border`}>{label}</Badge>
}
