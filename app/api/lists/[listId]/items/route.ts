import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { listItemSchema } from "@/lib/validations"
import { isOwner } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const list = await db.list.findById(params.listId )

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    if (!isOwner(session.user.id, list.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    const validation = listItemSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      )
    }

    const {
      productName, productUrl, imageUrl, price, currency, variants, platform,
      itemType, notes, location, experienceDate,
    } = validation.data

    const item = await db.listItem.create({
        listId: params.listId,
        productName,
        productUrl: productUrl || null,
        imageUrl: imageUrl || null,
        price: price || null,
        currency: currency || "USD",
        variants: variants || null,
        platform: platform || null,
        itemType: itemType || "PRODUCT",
        notes: notes || null,
        location: location || null,
        experienceDate: experienceDate || null,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating list item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}