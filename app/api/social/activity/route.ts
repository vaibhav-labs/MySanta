import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's friends
    const allFriendships = await db.friendship.findMany(session.user.id)
    const acceptedFriendships = allFriendships.filter((f: any) => f.status === 'ACCEPTED')
    
    const friendIds = acceptedFriendships.map((friendship: any) =>
      friendship.requester_id === session.user.id
        ? friendship.addressee_id
        : friendship.requester_id
    )

    // Include user's own activities
    friendIds.push(session.user.id)

    // Get social activities from friends and user
    const activities = await db.socialActivity.findMany(friendIds)

    return NextResponse.json({
      activities,
      total: activities.length
    })
  } catch (error) {
    console.error("Error fetching social activities:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}