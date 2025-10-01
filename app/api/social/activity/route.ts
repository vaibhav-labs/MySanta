import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's friends
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: session.user.id, status: "ACCEPTED" },
          { addresseeId: session.user.id, status: "ACCEPTED" }
        ]
      }
    })

    const friendIds = friendships.map(friendship =>
      friendship.requesterId === session.user.id
        ? friendship.addresseeId
        : friendship.requesterId
    )

    // Include user's own activities
    friendIds.push(session.user.id)

    // Get social activities from friends and user
    const activities = await prisma.socialActivity.findMany({
      where: {
        userId: {
          in: friendIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            gender: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching social activity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { activityType, entityType, entityId, entityName } = await request.json()

    if (!activityType || !entityType || !entityId || !entityName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const activity = await prisma.socialActivity.create({
      data: {
        userId: session.user.id,
        activityType,
        entityType,
        entityId,
        entityName
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            gender: true
          }
        }
      }
    })

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error creating social activity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}