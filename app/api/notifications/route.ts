import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return Response.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notificationIds } = await request.json()

    if (!Array.isArray(notificationIds)) {
      return Response.json({ error: "Invalid notification IDs" }, { status: 400 })
    }

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
      data: { isRead: true },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}