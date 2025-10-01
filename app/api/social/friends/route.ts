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

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: session.user.id, status: "ACCEPTED" },
          { addresseeId: session.user.id, status: "ACCEPTED" }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true
          }
        },
        addressee: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true
          }
        }
      }
    })

    const friendsList = friends.map(friendship => {
      const friend = friendship.requesterId === session.user.id
        ? friendship.addressee
        : friendship.requester
      return {
        id: friend.id,
        name: friend.name,
        email: friend.email,
        gender: friend.gender,
        friendshipId: friendship.id
      }
    })

    return NextResponse.json(friendsList)
  } catch (error) {
    console.error("Error fetching friends:", error)
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

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot add yourself as a friend" },
        { status: 400 }
      )
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: session.user.id, addresseeId: targetUser.id },
          { requesterId: targetUser.id, addresseeId: session.user.id }
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json(
        { error: "Friend request already exists or users are already friends" },
        { status: 400 }
      )
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: session.user.id,
        addresseeId: targetUser.id,
        status: "PENDING"
      },
      include: {
        addressee: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Friend request sent",
      friendship
    })
  } catch (error) {
    console.error("Error sending friend request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}