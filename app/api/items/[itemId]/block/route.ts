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

    // findById includes the list relation
    const item = await db.listItem.findById(itemId)
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Prevent owner blocking their own item
    if (item.list.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot block your own item" },
        { status: 400 }
      )
    }

    // Check if already blocked by this user
    const blocks = await db.itemBlock.findByItem(itemId)
    const existingBlock = blocks.find((b: any) => b.userId === session.user.id)

    if (existingBlock) {
      return NextResponse.json(
        { error: "Item already blocked" },
        { status: 400 }
      )
    }

    await db.itemBlock.create(itemId, session.user.id)

    const updatedBlocks = await db.itemBlock.findByItem(itemId)

    return NextResponse.json({
      message: "Item blocked successfully",
      blockCount: updatedBlocks.length,
    })
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

    await db.itemBlock.delete(itemId, session.user.id)

    const updatedBlocks = await db.itemBlock.findByItem(itemId)

    return NextResponse.json({
      message: "Item unblocked successfully",
      blockCount: updatedBlocks.length,
    })
  } catch (error) {
    console.error("Error unblocking item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
