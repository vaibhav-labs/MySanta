import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Use targeted queries instead of fetching all items globally
    const [giftsSent, userLists, events, friendships] = await Promise.all([
      // Gifts sent: items held by this user that are purchased
      prisma.listItem.count({
        where: { heldByUserId: userId, status: "PURCHASED" },
      }),
      // User's lists (needed for giftsReceived)
      prisma.list.findMany({ where: { userId }, select: { id: true } }),
      prisma.event.count({ where: { userId } }),
      db.friendship.findMany(userId),
    ])

    const giftsReceived = await prisma.listItem.count({
      where: {
        listId: { in: userLists.map((l) => l.id) },
        status: "PURCHASED",
      },
    })

    const friendsCount = friendships.filter(
      (f: any) => f.status === "ACCEPTED"
    ).length

    return NextResponse.json({
      giftsSent,
      giftsReceived,
      totalLists: userLists.length,
      totalEvents: events,
      friendsCount,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
