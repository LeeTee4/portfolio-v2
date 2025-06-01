"use client";

import { Button } from "@/components/ui/button";
import { Mail, ExternalLink, Github, Linkedin, Facebook } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PersonalInfo, ContactDetails } from "@/lib/types";
import { motion } from "framer-motion";

interface HeroProps {
  personalInfo: PersonalInfo | null;
  contactDetails: ContactDetails | null;
}

export function Hero({ personalInfo, contactDetails }: HeroProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-primary/10 to-white">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/3 flex md:justify-start justify-center md:pl-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar className="h-60 w-60 border-4 border-white shadow-lg">
              <AvatarImage
                src={personalInfo?.profile_image_url || "/placeholder.svg"}
                alt={personalInfo?.name || "Profile"}
              />
              <AvatarFallback className="text-5xl bg-primary text-white">
                {personalInfo?.name ? getInitials(personalInfo.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>

        <div className="md:w-2/3 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {personalInfo?.name || "Your Name"}
            </h1>
          </motion.div>

          {personalInfo?.title && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-xl md:text-2xl text-gray-600 mb-4">
                {personalInfo.title}
              </span>
            </motion.p>
          )}

          {personalInfo?.bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{}}
            >
              <span className="text-lg text-gray-500 mb-6 max-w-2xl mx-auto md:mx-0">
                {personalInfo.bio}
              </span>
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
            // md:justify-start is omitted or you can add its styles directly to the style prop if needed
          >
            {contactDetails?.email && (
              <Button asChild variant="outline">
                <a href={`mailto:${contactDetails.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Me
                </a>
              </Button>
            )}
            {personalInfo?.resume_url && (
              <Button asChild>
                <a
                  href={personalInfo.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Resume
                </a>
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "center",
            }}
            // Add responsive justify-start for md screens if needed using a CSS class or inline style
          >
            {contactDetails?.github_url && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/20"
              >
                <a
                  href={contactDetails.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            )}
            {contactDetails?.linkedin_url && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/20"
              >
                <a
                  href={contactDetails.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            )}
            {contactDetails?.facebook_url && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/20"
              >
                <a
                  href={contactDetails.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
