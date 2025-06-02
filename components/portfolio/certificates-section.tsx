"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from  "@/components/ui/button"
import { Calendar, ExternalLink } from "lucide-react"
import type { Certificate } from "@/lib/types"
import { motion } from "framer-motion"

interface CertificatesSectionProps {
  certificates: Certificate[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  if (!certificates || certificates.length === 0) {
    return null
  }

  return (
    <section id="certificates" className="py-10 px-4 bg-gradient-to-b from-primary/10 to-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Certificates</h2>
            <p className="text-gray-500 mt-2">Professional certifications and achievements</p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <CertificateCard certificate={cert} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const isExpired = (expiryDate?: string) => {
    if (expiryDate === "no_expiry") {
      return false
    }
    else if (expiryDate && new Date(expiryDate) < new Date()) {
      return false
    }
    return true
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-primary/20">
      {certificate.image_url && (
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={certificate.image_url || "/placeholder.svg"}
            alt={certificate.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg text-primary-dark">{certificate.title}</CardTitle>
        <CardDescription className="font-medium">{certificate.issuing_organization}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-grow">
        <div className="space-y-2">
          {certificate.issue_date && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              Issued: {new Date(certificate.issue_date).toLocaleDateString()}
            </div>
          )}
          {certificate.expiry_date && (
            <div
              className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                isExpired(certificate.expiry_date) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              }`}
            >
              {isExpired(certificate.expiry_date) ? "Expired" : "Valid"} until:{" "}
              {certificate.expiry_date === "no_expiry"
                ? "No Expiry"
                : new Date(certificate.expiry_date).toLocaleDateString()}
            </div>
          )}
        </div>

        {certificate.credential_url && (
          <Button size="sm" variant="outline" asChild className="mt-auto">
            <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-3 w-3" />
              Verify Certificate
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
