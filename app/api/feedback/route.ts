import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    const newFeedback = await prisma.feedback.create({
      data: {
        name: name || null,
        email: email || null,
        feedback,
        rating: rating || null,
        category,
      },
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

    const where = category ? { category } : {}

    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    const stats = await prisma.feedback.aggregate({
      where,
      _count: { id: true },
      _avg: { rating: true },
    })

    return NextResponse.json({
      feedback,
      stats: {
        total: stats._count.id,
        averageRating: stats._avg.rating,
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