import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { query } from "@/lib/supabase"

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
    const placeholders = validEmails.map((_, i) => `$${i + 1}`).join(', ')
    const existingUsers = await query(
      `SELECT id, email, name FROM users WHERE email IN (${placeholders})`,
      validEmails
    )

    const currentUserId = session.user.id

    // Check existing friendships
    const userIds = existingUsers.map((u: any) => u.id)
    let existingFriendships: any[] = []
    
    if (userIds.length > 0) {
      const idPlaceholders = userIds.map((_, i) => `$${i + 2}`).join(', ')
      existingFriendships = await query(
        `SELECT * FROM friendships 
         WHERE (requester_id = $1 AND addressee_id IN (${idPlaceholders}))
            OR (addressee_id = $1 AND requester_id IN (${idPlaceholders}))`,
        [currentUserId, ...userIds, ...userIds]
      )
    }

    const existingFriendIds = new Set([
      ...existingFriendships.map((f: any) => f.requester_id),
      ...existingFriendships.map((f: any) => f.addressee_id)
    ])

    // Filter out users who are already friends or self
    const newFriends = existingUsers.filter((user: any) =>
      user.id !== currentUserId && !existingFriendIds.has(user.id)
    )

    // Create friendships
    const friendships = newFriends.map(friend => ({
      requesterId: currentUserId,
      addresseeId: friend.id,
      status: "ACCEPTED" as const // Auto-accept for users on the platform
    }))

    // Create reverse friendships (bidirectional)
    const reverseFriendships = newFriends.map(friend => ({
      requesterId: friend.id,
      addresseeId: currentUserId,
      status: "ACCEPTED" as const
    }))

    // Bulk create friendships
    if (friendships.length > 0) {
      for (const friendship of [...friendships, ...reverseFriendships]) {
        await db.friendship.create(friendship)
      }
    }

    // Emails of users not on platform (could be used for email invitations later)
    const existingUserEmails = new Set(existingUsers.map((u: any) => u.email))
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