import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const item = await prisma.listItem.findUnique({
      where: { id: params.itemId },
      include: {
        list: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.list.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot hold your own items" },
        { status: 403 }
      )
    }

    if (item.status !== "WISHED") {
      return NextResponse.json(
        { error: "Item is not available for holding" },
        { status: 400 }
      )
    }

    const updatedItem = await prisma.listItem.update({
      where: { id: params.itemId },
      data: {
        status: "ON_HOLD",
        heldByUserId: session.user.id,
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

    await prisma.notification.create({
      data: {
        userId: item.list.userId,
        message: `An item on your '${item.list.name}' list has been reserved!`,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error holding item:", error)
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

    const item = await prisma.listItem.findUnique({
      where: { id: params.itemId },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.heldByUserId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedItem = await prisma.listItem.update({
      where: { id: params.itemId },
      data: {
        status: "WISHED",
        heldByUserId: null,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error releasing item hold:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}