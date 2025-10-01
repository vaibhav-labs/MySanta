import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { listItemSchema } from "@/lib/validations"
import { isOwner } from "@/lib/utils"

export async function POST(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const list = await prisma.list.findUnique({
      where: { id: params.listId },
    })

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

    const { productName, productUrl, imageUrl, price, currency, variants, platform } =
      validation.data

    const item = await prisma.listItem.create({
      data: {
        listId: params.listId,
        productName,
        productUrl,
        imageUrl: imageUrl || null,
        price: price || null,
        currency: currency || "USD",
        variants: variants || null,
        platform,
      },
      include: {
        heldByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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