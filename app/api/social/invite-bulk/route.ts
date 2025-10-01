import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface BulkInviteRequest {
  emails: string[]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: BulkInviteRequest = await request.json()
    const { emails } = body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Emails array is required" },
        { status: 400 }
      )
    }

    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmails = emails.filter(email => emailRegex.test(email))

    if (validEmails.length === 0) {
      return NextResponse.json(
        { error: "No valid emails provided" },
        { status: 400 }
      )
    }

    // Check for existing users and friendships
    const existingUsers = await prisma.user.findMany({
      where: {
        email: { in: validEmails }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    const currentUserId = session.user.id

    // Check existing friendships
    const existingFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            userId: currentUserId,
            friendId: { in: existingUsers.map(u => u.id) }
          },
          {
            friendId: currentUserId,
            userId: { in: existingUsers.map(u => u.id) }
          }
        ]
      }
    })

    const existingFriendIds = new Set([
      ...existingFriendships.map(f => f.userId),
      ...existingFriendships.map(f => f.friendId)
    ])

    // Filter out users who are already friends or self
    const newFriends = existingUsers.filter(user =>
      user.id !== currentUserId && !existingFriendIds.has(user.id)
    )

    // Create friendships
    const friendships = newFriends.map(friend => ({
      userId: currentUserId,
      friendId: friend.id,
      status: "ACCEPTED" as const // Auto-accept for users on the platform
    }))

    // Create reverse friendships (bidirectional)
    const reverseFriendships = newFriends.map(friend => ({
      userId: friend.id,
      friendId: currentUserId,
      status: "ACCEPTED" as const
    }))

    // Bulk create friendships
    if (friendships.length > 0) {
      await prisma.friendship.createMany({
        data: [...friendships, ...reverseFriendships],
        skipDuplicates: true
      })
    }

    // Emails of users not on platform (could be used for email invitations later)
    const existingUserEmails = new Set(existingUsers.map(u => u.email))
    const notOnPlatformEmails = validEmails.filter(email => !existingUserEmails.has(email))

    return NextResponse.json({
      success: true,
      results: {
        friendsAdded: newFriends.length,
        alreadyFriends: existingUsers.length - newFriends.length,
        notOnPlatform: notOnPlatformEmails.length,
        invalidEmails: emails.length - validEmails.length,
        newFriends: newFriends.map(f => ({
          id: f.id,
          name: f.name,
          email: f.email
        })),
        notOnPlatformEmails
      }
    })

  } catch (error) {
    console.error("Bulk invite error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}