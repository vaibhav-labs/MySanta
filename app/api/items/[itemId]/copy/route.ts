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

    const { listId } = await request.json()

    if (!listId) {
      return NextResponse.json({ error: "listId is required" }, { status: 400 })
    }

    // Verify the destination list belongs to the current user
    const targetList = await db.list.findById(listId)
    if (!targetList) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }
    if (targetList.userId !== session.user.id) {
      return NextResponse.json({ error: "You can only copy items to your own lists" }, { status: 403 })
    }

    // Get the source item
    const sourceItem = await db.listItem.findById(params.itemId)
    if (!sourceItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Create a copy in the target list
    const newItem = await db.listItem.create({
      listId,
      productName:  sourceItem.productName,
      productUrl:   sourceItem.productUrl,
      imageUrl:     sourceItem.imageUrl,
      price:        sourceItem.price,
      currency:     sourceItem.currency || "USD",
      variants:     sourceItem.variants,
      platform:     sourceItem.platform,
      quantity:     sourceItem.quantity || 1,
      status:       "WISHED",
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error copying item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
