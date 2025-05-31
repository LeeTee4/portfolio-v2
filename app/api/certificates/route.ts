import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    let query = supabase.from("certificate").select("*").order("issue_date", { ascending: false })

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 400 })
    }

    return NextResponse.json(createApiResponse(true, data))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const certificateData = await request.json()

    const { data, error } = await supabase.from("certificate").insert([certificateData]).select().single()

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 400 })
    }

    return NextResponse.json(createApiResponse(true, data, undefined, "Certificate created successfully"), { status: 201 })
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
