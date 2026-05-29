import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { prisma } from "@/lib/prisma"

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

    const { collaborative = false } = await request.json().catch(() => ({}))

    const item = await db.listItem.findById(params.itemId)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.list.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot hold your own items" },
        { status: 403 }
      )
    }

    if (item.status === "PURCHASED" || item.status === "RECEIVED") {
      return NextResponse.json(
        { error: "Item is no longer available" },
        { status: 400 }
      )
    }

    let updatedItem
    let notificationMessage

    if (collaborative && (item.status === "ON_HOLD" || item.collaboratorIds)) {
      // Join collaborative hold
      const existingCollaborators = item.collaboratorIds
        ? JSON.parse(item.collaboratorIds)
        : (item.heldByUserId ? [item.heldByUserId] : [])

      if (existingCollaborators.includes(session.user.id)) {
        return NextResponse.json(
          { error: "You are already collaborating on this item" },
          { status: 400 }
        )
      }

      const newCollaborators = [...existingCollaborators, session.user.id]

      updatedItem = await db.listItem.update(params.itemId, {
        status: "ON_HOLD",
        collaboratorIds: JSON.stringify(newCollaborators),
        heldByUserId: newCollaborators[0], // Keep first holder as primary
      })

      notificationMessage = `Someone joined the collaboration for an item on your '${item.list.name}' list!`
    } else if (item.status === "WISHED") {
      // New hold
      updatedItem = await db.listItem.update(params.itemId, {
        status: "ON_HOLD",
        heldByUserId: session.user.id,
        collaboratorIds: collaborative ? JSON.stringify([session.user.id]) : null,
      })

      notificationMessage = `An item on your '${item.list.name}' list has been reserved!`
    } else {
      return NextResponse.json(
        { error: "Item is not available for holding" },
        { status: 400 }
      )
    }

    // Create notification for list owner (without revealing who held it)
    await prisma.notification.create({
      data: {
        userId: item.list.userId,
        message: notificationMessage,
        isRead: false,
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

    const item = await db.listItem.findById(params.itemId)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Check if user is involved in holding this item
    const collaborators = item.collaboratorIds ? JSON.parse(item.collaboratorIds) : []
    const isCollaborator = collaborators.includes(session.user.id)
    const isPrimaryHolder = item.heldByUserId === session.user.id

    if (!isPrimaryHolder && !isCollaborator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let updatedItem

    if (collaborators.length > 1) {
      // Remove user from collaboration
      const newCollaborators = collaborators.filter((id: string) => id !== session.user.id)
      updatedItem = await db.listItem.update(params.itemId, {
        collaboratorIds: JSON.stringify(newCollaborators),
        heldByUserId: newCollaborators[0], // New primary holder
      })
    } else {
      // Release hold entirely
      updatedItem = await db.listItem.update(params.itemId, {
        status: "WISHED",
        heldByUserId: null,
        collaboratorIds: null,
      })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error releasing item hold:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}