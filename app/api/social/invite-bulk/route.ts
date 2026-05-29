import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmails = emails.filter((email) => emailRegex.test(email))

    if (validEmails.length === 0) {
      return NextResponse.json(
        { error: "No valid emails provided" },
        { status: 400 }
      )
    }

    const currentUserId = session.user.id

    // Find existing users matching the supplied emails
    const existingUsers = await prisma.user.findMany({
      where: { email: { in: validEmails } },
      select: { id: true, email: true, name: true },
    })

    const userIds = existingUsers.map((u) => u.id)

    // Find any existing friendships between current user and found users
    const existingFriendships = userIds.length > 0
      ? await prisma.friendship.findMany({
          where: {
            OR: [
              { requesterId: currentUserId, addresseeId: { in: userIds } },
              { addresseeId: currentUserId, requesterId: { in: userIds } },
            ],
          },
        })
      : []

    const existingFriendIds = new Set([
      ...existingFriendships.map((f) => f.requesterId),
      ...existingFriendships.map((f) => f.addresseeId),
    ])

    // Only add users who aren't already friends and aren't the current user
    const newFriends = existingUsers.filter(
      (user) => user.id !== currentUserId && !existingFriendIds.has(user.id)
    )

    // Bulk-create friendships (auto-accepted for users already on the platform)
    if (newFriends.length > 0) {
      await prisma.friendship.createMany({
        data: [
          ...newFriends.map((friend) => ({
            requesterId: currentUserId,
            addresseeId: friend.id,
            status: "ACCEPTED",
          })),
          ...newFriends.map((friend) => ({
            requesterId: friend.id,
            addresseeId: currentUserId,
            status: "ACCEPTED",
          })),
        ],
        skipDuplicates: true,
      })
    }

    const existingUserEmails = new Set(existingUsers.map((u) => u.email))
    const notOnPlatformEmails = validEmails.filter(
      (email) => !existingUserEmails.has(email)
    )

    return NextResponse.json({
      success: true,
      results: {
        friendsAdded: newFriends.length,
        alreadyFriends: existingUsers.length - newFriends.length,
        notOnPlatform: notOnPlatformEmails.length,
        invalidEmails: emails.length - validEmails.length,
        newFriends: newFriends.map((f) => ({ id: f.id, name: f.name, email: f.email })),
        notOnPlatformEmails,
      },
    })
  } catch (error) {
    console.error("Bulk invite error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
