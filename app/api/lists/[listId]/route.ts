import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isOwner } from "@/lib/utils"

export async function GET(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const list = await prisma.list.findUnique({
      where: {
        id: params.listId,
      },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
          },
        },
        items: {
          include: {
            heldByUser: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 })
    }

    const isListOwner = isOwner(session.user.id, list.userId)

    if (!isListOwner) {
      list.items = list.items.filter(
        (item) =>
          !["PURCHASED", "RECEIVED", "BOUGHT_SELF", "REMOVED"].includes(
            item.status
          )
      )
    }

    return NextResponse.json({ ...list, isOwner: isListOwner })
  } catch (error) {
    console.error("Error fetching list:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
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

    const updatedList = await prisma.list.update({
      where: { id: params.listId },
      data: { name },
      include: {
        event: true,
        items: true,
      },
    })

    return NextResponse.json(updatedList)
  } catch (error) {
    console.error("Error updating list:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.list.delete({
      where: { id: params.listId },
    })

    return NextResponse.json({ message: "List deleted successfully" })
  } catch (error) {
    console.error("Error deleting list:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}