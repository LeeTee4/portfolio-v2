"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Github, Linkedin, Twitter, Phone, Globe, Facebook } from "lucide-react"
import type { ContactDetails } from "@/lib/types"
import { motion } from "framer-motion"

interface ContactSectionProps {
  contactDetails: ContactDetails | null
}

export function ContactSection({ contactDetails }: ContactSectionProps) {
  if (!contactDetails) {
    return null
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <h3 className="text-xl font-semibold text-primary-dark">Contact Information</h3>

                <div className="space-y-4 flex-grow">
                  {contactDetails.email && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${contactDetails.email}`} className="text-gray-500 hover:text-primary">
                          {contactDetails.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactDetails.phone && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href={`tel:${contactDetails.phone}`} className="text-gray-500 hover:text-primary">
                          {contactDetails.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactDetails.location && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-500">{contactDetails.location}</p>
                      </div>
                    </div>
                  )}

                  {contactDetails.website && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Globe className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">Website</p>
                        <a
                          href={contactDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary"
                        >
                          {contactDetails.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <h3 className="text-xl font-semibold text-primary-dark">Social Profiles</h3>

                <div className="space-y-4 flex-grow">
                  {contactDetails.github_url && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Github className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        <a
                          href={contactDetails.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary"
                        >
                          {contactDetails.github_url.replace(/^https?:\/\/(www\.)?github\.com\//, "@")}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactDetails.linkedin_url && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Linkedin className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <a
                          href={contactDetails.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary"
                        >
                          {contactDetails.linkedin_url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "@")}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactDetails.facebook_url && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Facebook className="h-5 w-5 text-primary-dark" />
                      </div>
                      <div>
                        <p className="font-medium">Facebook</p>
                        <a
                          href={contactDetails.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary"
                        >
                          {contactDetails.facebook_url.replace(/^https?:\/\/(www\.)?facebook\.com\//, "@")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {contactDetails.email && (
                    <Button asChild>
                      <a href={`mailto:${contactDetails.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Me
                      </a>
                    </Button>
                  )}

                  {contactDetails.github_url && (
                    <Button asChild variant="outline">
                      <a href={contactDetails.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}

                  {contactDetails.linkedin_url && (
                    <Button asChild variant="outline">
                      <a href={contactDetails.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
