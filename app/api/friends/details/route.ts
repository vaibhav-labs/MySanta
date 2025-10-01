import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUserId = session.user.id

    // Get all friends of the current user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUserId, status: "ACCEPTED" },
          { addresseeId: currentUserId, status: "ACCEPTED" }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            image: true
          }
        },
        addressee: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            image: true
          }
        }
      }
    })

    // Extract friend IDs (excluding current user)
    const friendIds = friendships.map(friendship =>
      friendship.requesterId === currentUserId ? friendship.addresseeId : friendship.requesterId
    )

    if (friendIds.length === 0) {
      return NextResponse.json({
        friends: [],
        total: 0
      })
    }

    // Get friends with their events and lists
    const friendsWithDetails = await prisma.user.findMany({
      where: {
        id: { in: friendIds }
      },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        image: true,
        events: {
          select: {
            id: true,
            name: true,
            occasion: true,
            description: true,
            eventDate: true,
            createdAt: true,
            _count: {
              select: {
                lists: true
              }
            }
          },
          orderBy: {
            eventDate: 'asc'
          },
          take: 5 // Show next 5 upcoming events
        },
        lists: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            event: {
              select: {
                name: true,
                occasion: true,
                eventDate: true
              }
            },
            _count: {
              select: {
                items: true
              }
            },
            items: {
              select: {
                id: true,
                productName: true,
                imageUrl: true,
                price: true,
                currency: true,
                status: true
              },
              where: {
                status: "WISHED" // Only show items that haven't been purchased
              },
              take: 3 // Show first 3 items as preview
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3 // Show 3 most recent lists
        }
      }
    })

    // Transform the data to include friendship info
    const friendsData = friendsWithDetails.map(friend => {
      const friendship = friendships.find(f =>
        (f.requesterId === currentUserId && f.addresseeId === friend.id) ||
        (f.addresseeId === currentUserId && f.requesterId === friend.id)
      )

      return {
        ...friend,
        friendshipId: friendship?.id,
        friendSince: friendship?.createdAt,
        upcomingEvents: friend.events.filter(event =>
          new Date(event.eventDate) >= new Date()
        ),
        pastEvents: friend.events.filter(event =>
          new Date(event.eventDate) < new Date()
        ),
        totalEvents: friend.events.length,
        totalLists: friend.lists.length,
        totalWishlistItems: friend.lists.reduce((acc, list) => acc + list._count.items, 0)
      }
    })

    return NextResponse.json({
      friends: friendsData,
      total: friendsData.length
    })

  } catch (error) {
    console.error("Friends details fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}