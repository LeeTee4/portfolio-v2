"use client"

import { useEffect } from "react"

export function useAnalytics() {
  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: window.location.pathname,
          }),
        })
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug("Analytics tracking failed:", error)
      }
    }

    // Track visit after a short delay to ensure page is loaded
    const timer = setTimeout(trackVisit, 1000)

    return () => clearTimeout(timer)
  }, [])
}
