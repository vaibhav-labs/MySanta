import { requireAuth } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { RecentLists } from "@/components/dashboard/RecentLists"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"

async function getStats(userId: string) {
  // Get all items and filter them
  const allItems = await db.listItem.findMany()
  
  // Count gifts sent (items user has purchased for others)
  const giftsSent = allItems.filter((item: any) => 
    item.held_by_user_id === userId && item.status === "PURCHASED"
  ).length
  
  // Get user's lists to count gifts received
  const userLists = await db.list.findMany(userId)
  const userListIds = userLists.map((l: any) => l.id)
  
  // Count gifts received (items in user's lists that are purchased)
  const giftsReceived = allItems.filter((item: any) => 
    userListIds.includes(item.list_id) && item.status === "PURCHASED"
  ).length

  return { giftsSent, giftsReceived }
}

async function getLists(userId: string) {
  const lists = await db.list.findMany(userId)
  
  // Get details for each list
  const listsWithDetails = await Promise.all(
    lists.slice(0, 5).map(async (list: any) => {
      const event = list.event_id ? await db.event.findById(list.event_id) : null
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
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

async function getEvents(userId: string) {
  const events = await db.event.findMany(userId)
  
  // Filter for upcoming events and limit to 5
  const now = new Date()
  const upcomingEvents = events
    .filter((event: any) => new Date(event.event_date) > now)
    .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5)
  
  // Get list counts for each event
  const eventsWithCounts = await Promise.all(
    upcomingEvents.map(async (event: any) => {
      const lists = await db.list.findMany(userId)
      const eventLists = lists.filter((list: any) => list.event_id === event.id)
      
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
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Welcome back, {user.name || user.email}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your gifts and events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <DashboardStats stats={stats} />
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