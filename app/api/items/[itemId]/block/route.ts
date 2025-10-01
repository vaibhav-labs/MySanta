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

    const { itemId } = params

    // Check if item exists
    const item = await db.listItem.findById(itemId)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Get the list to check ownership
    const list = await db.list.findById(item.list_id)
    
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    // Check if user is trying to block their own item
    if (list.user_id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot block your own item" },
        { status: 400 }
      )
    }

    // Check if already blocked
    const blocks = await db.itemBlock.findByItem(itemId)
    const existingBlock = blocks.find((b: any) => b.user_id === session.user.id)

    if (existingBlock) {
      return NextResponse.json(
        { error: "Item already blocked" },
        { status: 400 }
      )
    }

    // Create block
    await db.itemBlock.create(itemId, session.user.id)

    return NextResponse.json({ message: "Item blocked successfully" })
  } catch (error) {
    console.error("Error blocking item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = params

    // Remove block
    await db.itemBlock.delete(itemId, session.user.id)

    return NextResponse.json({ message: "Item unblocked successfully" })
  } catch (error) {
    console.error("Error unblocking item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}