import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { updateListItemSchema } from "@/lib/validations"
import { isOwner } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export async function PUT(
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

    if (!isOwner(session.user.id, item.list.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateListItemSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      )
    }

    const updatedItem = await db.listItem.update(params.itemId, validation.data)

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating item:", error)
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

    const item = await db.listItem.findById(params.itemId)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (!isOwner(session.user.id, item.list.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.listItem.delete(params.itemId)

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}