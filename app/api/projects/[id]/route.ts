import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("project").select("*").eq("id", params.id).single()

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 404 })
    }

    return NextResponse.json(createApiResponse(true, data))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const projectData = await request.json()

    const { data, error } = await supabase
      .from("project")
      .update({ ...projectData, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 400 })
    }

    return NextResponse.json(createApiResponse(true, data, undefined, "Project updated successfully"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { error } = await supabase.from("project").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 400 })
    }

    return NextResponse.json(createApiResponse(true, null, undefined, "Project deleted successfully"))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
