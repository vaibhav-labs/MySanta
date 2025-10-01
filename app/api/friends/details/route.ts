import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = session.user.id

    // Get all friends of the current user
    const friendships = await db.friendship.findMany(currentUserId)
    const acceptedFriendships = friendships.filter((f: any) => f.status === 'ACCEPTED')
    
    // Get friend details
    const friendDetails = await Promise.all(
      acceptedFriendships.map(async (friendship: any) => {
        const friendId = friendship.requester_id === currentUserId ? 
          friendship.addressee_id : friendship.requester_id
        
        const friend = await db.user.findById(friendId)
        if (!friend) return null
        
        // Get friend's events and lists
        const events = await db.event.findMany(friendId)
        const lists = await db.list.findMany(friendId)
        
        // Get list items count for each list
        const listsWithCounts = await Promise.all(
          lists.map(async (list: any) => {
            const items = await db.listItem.findMany(list.id)
            return {
              id: list.id,
              name: list.name,
              itemCount: items.length,
              eventId: list.event_id
            }
          })
        )
        
        // Map events with their lists
        const eventsWithDetails = events.map((event: any) => ({
          id: event.id,
          name: event.name,
          occasion: event.occasion,
          description: event.description,
          eventDate: event.event_date,
          createdAt: event.created_at,
          _count: {
            lists: listsWithCounts.filter((l: any) => l.eventId === event.id).length
          }
        }))
        
        return {
          id: friend.id,
          name: friend.name,
          email: friend.email,
          gender: friend.gender,
          image: friend.image,
          events: eventsWithDetails,
          lists: listsWithCounts,
          _count: {
            events: events.length,
            lists: lists.length
          }
        }
      })
    )
    
    // Filter out null values
    const validFriends = friendDetails.filter(f => f !== null)

    return NextResponse.json({
      friends: validFriends,
      total: validFriends.length
    })

  } catch (error) {
    console.error("Error fetching friends details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}