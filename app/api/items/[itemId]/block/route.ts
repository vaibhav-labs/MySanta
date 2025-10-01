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

    const { itemId } = params

    // Check if item exists
    const item = await prisma.listItem.findUnique({
      where: { id: itemId },
      include: {
        list: {
          include: {
            user: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Check if user is trying to block their own item
    if (item.list.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot block your own item" },
        { status: 400 }
      )
    }

    // Check if already blocked
    const existingBlock = await prisma.itemBlock.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId: session.user.id
        }
      }
    })

    if (existingBlock) {
      return NextResponse.json(
        { error: "Item already blocked" },
        { status: 400 }
      )
    }

    // Create block
    await prisma.itemBlock.create({
      data: {
        itemId,
        userId: session.user.id
      }
    })

    // Get updated block count
    const blockCount = await prisma.itemBlock.count({
      where: { itemId }
    })

    return NextResponse.json({
      success: true,
      blockCount,
      message: "Item blocked successfully"
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

    // Delete block
    await prisma.itemBlock.deleteMany({
      where: {
        itemId,
        userId: session.user.id
      }
    })

    // Get updated block count
    const blockCount = await prisma.itemBlock.count({
      where: { itemId }
    })

    return NextResponse.json({
      success: true,
      blockCount,
      message: "Item unblocked successfully"
    })
  } catch (error) {
    console.error("Error unblocking item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}