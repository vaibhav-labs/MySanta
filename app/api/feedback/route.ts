import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, feedback, rating, category = "general" } = body

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      )
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const newFeedback = await db.feedback.create({
      name: name || null,
      email: email || null,
      feedback,
      rating: rating || null,
      category,
    })

    return NextResponse.json({
      message: "Feedback submitted successfully!",
      id: newFeedback.id,
    })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const limit = parseInt(url.searchParams.get("limit") || "50")

    const allFeedback = await db.feedback.findMany()
    
    // Filter and limit in memory
    let filteredFeedback = allFeedback
    if (category) {
      filteredFeedback = allFeedback.filter((f: any) => f.category === category)
    }
    const feedback = filteredFeedback.slice(0, limit)
    
    // Calculate stats
    const relevantFeedback = category ? filteredFeedback : allFeedback
    const totalCount = relevantFeedback.length
    const avgRating = relevantFeedback.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / relevantFeedback.filter((f: any) => f.rating).length || 0

    return NextResponse.json({
      feedback,
      stats: {
        total: totalCount,
        averageRating: avgRating,
      },
    })
  } catch (error) {
    console.error("Feedback fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}