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

    // Get all items and filter them
    const allItems = await db.listItem.findMany()
    
    // Count gifts sent (items user has purchased for others)
    const giftsSent = allItems.filter((item: any) => 
      item.held_by_user_id === session.user.id && item.status === "PURCHASED"
    ).length
    
    // Get user's lists to count gifts received
    const userLists = await db.list.findMany(session.user.id)
    const userListIds = userLists.map((l: any) => l.id)
    
    // Count gifts received (items in user's lists that are purchased)
    const giftsReceived = allItems.filter((item: any) => 
      userListIds.includes(item.list_id) && item.status === "PURCHASED"
    ).length

    // Get user's events and lists counts
    const events = await db.event.findMany(session.user.id)
    const lists = await db.list.findMany(session.user.id)
    
    // Get friend count
    const friendships = await db.friendship.findMany(session.user.id)
    const friendsCount = friendships.filter((f: any) => f.status === 'ACCEPTED').length

    const stats = {
      giftsSent,
      giftsReceived,
      totalLists: lists.length,
      totalEvents: events.length,
      friendsCount,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}