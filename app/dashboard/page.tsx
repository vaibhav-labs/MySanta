import { requireAuth } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { RecentLists } from "@/components/dashboard/RecentLists"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"

async function getStats(userId: string) {
  const userLists = await prisma.list.findMany({
    where: { userId },
    select: { id: true },
  })
  const listIds = userLists.map((l) => l.id)

  const [giftsSent, giftsReceived] = await Promise.all([
    prisma.listItem.count({ where: { heldByUserId: userId, status: "PURCHASED" } }),
    prisma.listItem.count({ where: { listId: { in: listIds }, status: "PURCHASED" } }),
  ])

  return { giftsSent, giftsReceived }
}

async function getLists(userId: string) {
  const lists = await db.list.findMany(userId)
  
  // Get details for each list
  const listsWithDetails = await Promise.all(
    lists.slice(0, 5).map(async (list: any) => {
      const event = list.eventId ? await db.event.findById(list.eventId) : null
      const items = await db.listItem.findMany(list.id)
      
      return {
        ...list,
        event,
        items: items.map((item: any) => ({
          id: item.id,
          status: item.status,
        })),
      }
    })
  )
  
  return listsWithDetails.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

async function getEvents(userId: string) {
  const events = await db.event.findMany(userId)
  
  // Filter for upcoming events and limit to 5
  const now = new Date()
  const upcomingEvents = events
    .filter((event: any) => new Date(event.eventDate) > now)
    .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5)
  
  // Get list counts for each event
  const eventsWithCounts = await Promise.all(
    upcomingEvents.map(async (event: any) => {
      const lists = await db.list.findMany(userId)
      const eventLists = lists.filter((list: any) => list.eventId === event.id)
      
      return {
        ...event,
        _count: {
          lists: eventLists.length
        }
      }
    })
  )
  
  return eventsWithCounts
}

export default async function DashboardPage() {
  const user = await requireAuth()

  const [stats, lists, events] = await Promise.all([
    getStats(user.id),
    getLists(user.id),
    getEvents(user.id),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <DashboardStats stats={stats} userName={user.name} />
          </div>
          <div>
            <UpcomingEvents events={events} />
          </div>
        </div>

        <div>
          <RecentLists lists={lists} />
        </div>
      </main>

      <Footer />
    </div>
  )
}