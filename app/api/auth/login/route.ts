import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(createApiResponse(false, null, "Email and password are required"), { status: 400 })
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 401 })
    }

    return NextResponse.json(createApiResponse(true, { user: data.user }, null, "Login successful"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
