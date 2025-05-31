import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("contact_details").select("*").single()

    if (error && error.code !== "PGRST116") {
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

    const contactData = await request.json()

    // Check if contact details already exist
    const { data: existing } = await supabase.from("contact_details").select("id").single()

    let result
    if (existing) {
      // Update existing record
      result = await supabase
        .from("contact_details")
        .update({ ...contactData, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single()
    } else {
      // Create new record
      result = await supabase.from("contact_details").insert([contactData]).select().single()
    }

    if (result.error) {
      return NextResponse.json(createApiResponse(false, null, result.error.message), { status: 400 })
    }

    return NextResponse.json(createApiResponse(true, result.data, undefined, "Contact details saved successfully"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
