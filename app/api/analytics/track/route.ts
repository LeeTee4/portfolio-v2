import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get client IP address
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwarded?.split(",")[0] || realIp || "unknown"

    // Get user agent and referrer
    const userAgent = request.headers.get("user-agent") || "unknown"
    const referrer = request.headers.get("referer") || null

    // Get request body for additional data
    const body = await request.json().catch(() => ({}))
    const pagePath = body.path || "/"

    // Insert visit record
    const { data, error } = await supabase
      .from("analytics")
      .insert([
        {
          ip_address: ip,
          user_agent: userAgent,
          referrer: referrer,
          page_path: pagePath,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Analytics tracking error:", error)
      // Don't fail the request if analytics fails
      return NextResponse.json(createApiResponse(true, null, "Visit tracked"))
    }

    return NextResponse.json(createApiResponse(true, data, "Visit tracked successfully"))
  } catch (error) {
    console.error("Analytics tracking error:", error)
    // Don't fail the request if analytics fails
    return NextResponse.json(createApiResponse(true, null, "Visit tracked"))
  }
}
