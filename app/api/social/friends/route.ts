import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all friendships for the current user
    const allFriendships = await db.friendship.findMany(session.user.id)
    const acceptedFriendships = allFriendships.filter((f: any) => f.status === 'ACCEPTED')

    // Get friend details
    const friends = await Promise.all(
      acceptedFriendships.map(async (friendship: any) => {
        const friendId = friendship.requester_id === session.user.id 
          ? friendship.addressee_id 
          : friendship.requester_id
        
        const friendData = await db.user.findById(friendId)
        
        return {
          id: friendship.id,
          status: friendship.status,
          createdAt: friendship.created_at,
          requester: friendship.requester_id === session.user.id ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            gender: 'other' // Default as we don't have user data here
          } : {
            id: friendData?.id,
            name: friendData?.name,
            email: friendData?.email,
            gender: friendData?.gender || 'other'
          },
          addressee: friendship.addressee_id === session.user.id ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            gender: 'other'
          } : {
            id: friendData?.id,
            name: friendData?.name,
            email: friendData?.email,
            gender: friendData?.gender || 'other'
          }
        }
      })
    )

    return NextResponse.json({
      friends,
      total: friends.length
    })
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
    const user = await db.user.findByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot send friend request to yourself" },
        { status: 400 }
      )
    }

    // Check if friendship already exists
    const allFriendships = await db.friendship.findMany(session.user.id)
    const existingFriendship = allFriendships.find((f: any) => 
      (f.requester_id === session.user.id && f.addressee_id === user.id) ||
      (f.requester_id === user.id && f.addressee_id === session.user.id)
    )

    if (existingFriendship) {
      return NextResponse.json(
        { error: "Friendship request already exists" },
        { status: 400 }
      )
    }

    // Create friendship
    const friendship = await db.friendship.create({
      requesterId: session.user.id,
      addresseeId: user.id,
      status: "PENDING"
    })

    // Create notification for the addressee
    await db.notification.create({
      userId: user.id,
      message: `${session.user.name || session.user.email} sent you a friend request`,
      isRead: false
    })

    return NextResponse.json(friendship, { status: 201 })
  } catch (error) {
    console.error("Error creating friend request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}