import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function POST() {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 400 })
    }

    return NextResponse.json(createApiResponse(true, null, null, "Logout successful"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
