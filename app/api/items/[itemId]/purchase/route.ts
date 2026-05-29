import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const item = await db.listItem.findById(params.itemId)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.list.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot purchase your own items" },
        { status: 403 }
      )
    }

    if (item.heldByUserId !== session.user.id) {
      return NextResponse.json(
        { error: "You must hold this item before purchasing" },
        { status: 403 }
      )
    }

    if (item.status !== "ON_HOLD") {
      return NextResponse.json(
        { error: "Item is not available for purchase" },
        { status: 400 }
      )
    }

    const updatedItem = await db.listItem.update(params.itemId, {
      status: "PURCHASED",
    })

    await db.notification.create({
      userId: item.list.userId,
      message: `A gift from your '${item.list.name}' list has been purchased!`,
      isRead: false,
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error purchasing item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}