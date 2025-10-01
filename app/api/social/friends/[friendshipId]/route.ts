import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { friendshipId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { friendshipId } = params
    const { action } = await request.json()

    if (!["accept", "decline", "block"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

    const friendship = await db.friendship.findById(friendshipId )

    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      )
    }

    // Only the addressee can accept/decline requests
    if (friendship.addresseeId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const statusMap = {
      accept: "ACCEPTED",
      decline: "DECLINED",
      block: "BLOCKED"
    }

    await db.friendship.update(friendshipId , { status: statusMap[action as keyof typeof statusMap] })

    return NextResponse.json({
      success: true,
      message: `Friend request ${action}ed`
    })
  } catch (error) {
    console.error("Error updating friendship:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { friendshipId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { friendshipId } = params

    const friendship = await db.friendship.findById(friendshipId )

    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      )
    }

    // User can only delete if they are part of the friendship
    if (friendship.requesterId !== session.user.id && friendship.addresseeId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    await db.friendship.delete(friendshipId)

    return NextResponse.json({
      success: true,
      message: "Friendship removed"
    })
  } catch (error) {
    console.error("Error deleting friendship:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}