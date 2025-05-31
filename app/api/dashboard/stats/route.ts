import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(createApiResponse(false, null, "Unauthorized"), { status: 401 })
    }

    // Get counts for each section
    const [{ count: projectsCount }, { count: educationCount }, { count: certificatesCount }] = await Promise.all([
      supabase.from("project").select("*", { count: "exact", head: true }),
      supabase.from("education").select("*", { count: "exact", head: true }),
      supabase.from("certificate").select("*", { count: "exact", head: true }),
    ])

    const stats = {
      projects: projectsCount || 0,
      education: educationCount || 0,
      certificates: certificatesCount || 0,
    }

    return NextResponse.json(createApiResponse(true, stats))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
