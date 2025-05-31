import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 401 })
    }

    return NextResponse.json(createApiResponse(true, { user }))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
