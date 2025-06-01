"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import type { Education } from "@/lib/types"
import { motion } from "framer-motion"

interface EducationSectionProps {
  education: Education[]
}

export function EducationSection({ education }: EducationSectionProps) {
  if (!education || education.length === 0) {
    return null
  }

  return (
    <section id="education" className="py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold">Education</h2>
            <p className="text-gray-500 mt-2">My academic background</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <EducationCard education={edu} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EducationCard({ education }: { education: Education }) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between flex-col md:flex-row gap-4">
          <div>
            <CardTitle className="text-xl text-primary-dark">{education.degree}</CardTitle>
            <CardDescription className="text-base font-medium">{education.institution}</CardDescription>
            {education.field_of_study && <p className="text-sm text-gray-500 mt-1">{education.field_of_study}</p>}
          </div>
          <div className="text-right text-sm text-gray-500 md:min-w-32">
            {education.start_date && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(education.start_date).getFullYear()} -{" "}
                {education.end_date ? new Date(education.end_date).getFullYear() : "Present"}
              </div>
            )}
            {education.grade && (
              <div className="mt-1 bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full text-xs inline-block">
                Grade: {education.grade}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      {education.description && (
        <CardContent>
          <p className="text-gray-600">{education.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
