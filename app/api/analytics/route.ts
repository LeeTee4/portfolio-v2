import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "daily" // daily, weekly, monthly
    const days = Number.parseInt(searchParams.get("days") || "30")

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const startDateStr = startDate.toISOString().split("T")[0]
    const endDateStr = endDate.toISOString().split("T")[0]

    let data, error

    if (period === "weekly") {
      const { data: weeklyData, error: weeklyError } = await supabase.rpc("get_weekly_visits", {
        start_date: startDateStr,
        end_date: endDateStr,
      })
      data = weeklyData
      error = weeklyError
    } else if (period === "monthly") {
      const { data: monthlyData, error: monthlyError } = await supabase.rpc("get_monthly_visits", {
        start_date: startDateStr,
        end_date: endDateStr,
      })
      data = monthlyData
      error = monthlyError
    } else {
      // Default to daily
      const { data: dailyData, error: dailyError } = await supabase.rpc("get_daily_visits", {
        start_date: startDateStr,
        end_date: endDateStr,
      })
      data = dailyData
      error = dailyError
    }

    if (error) {
      return NextResponse.json(createApiResponse(false, null, error.message), { status: 400 })
    }

    // Get total visits
    const { count: totalVisits } = await supabase.from("analytics").select("*", { count: "exact", head: true })

    // Get today's visits
    const today = new Date().toISOString().split("T")[0]
    const { count: todayVisits } = await supabase
      .from("analytics")
      .select("*", { count: "exact", head: true })
      .eq("visit_date", today)

    // Get unique visitors (by IP)
    const { data: uniqueVisitors } = await supabase
      .from("analytics")
      .select("ip_address")
      .gte("visit_date", startDateStr)
      .lte("visit_date", endDateStr)

    const uniqueVisitorCount = new Set(uniqueVisitors?.map((v) => v.ip_address)).size

    // Get top pages
    const { data: topPages } = await supabase
      .from("analytics")
      .select("page_path")
      .gte("visit_date", startDateStr)
      .lte("visit_date", endDateStr)

    const pageStats = topPages?.reduce((acc: Record<string, number>, page) => {
      acc[page.page_path] = (acc[page.page_path] || 0) + 1
      return acc
    }, {})

    const topPagesArray = Object.entries(pageStats || {})
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const analytics = {
      chartData: data,
      totalVisits: totalVisits || 0,
      todayVisits: todayVisits || 0,
      uniqueVisitors: uniqueVisitorCount,
      topPages: topPagesArray,
      period,
      dateRange: {
        start: startDateStr,
        end: endDateStr,
      },
    }

    return NextResponse.json(createApiResponse(true, analytics))
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 })
  }
}
