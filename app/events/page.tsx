import { requireAuth } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { Navigation } from "@/components/Navigation"
import { EventCard } from "@/components/events/EventCard"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

async function getUserEvents(userId: string) {
  const events = await db.event.findMany(userId)
  
  // Get lists for each event
  const eventsWithDetails = await Promise.all(
    events.map(async (event: any) => {
      const lists = await db.list.findMany(userId)
      const eventLists = lists.filter((list: any) => list.eventId === event.id)
      
      // Get items for each list
      const listsWithItems = await Promise.all(
        eventLists.map(async (list: any) => {
          const items = await db.listItem.findMany(list.id)
          return {
            ...list,
            items: items.map((item: any) => ({
              id: item.id,
              status: item.status,
            })),
          }
        })
      )
      
      return {
        ...event,
        lists: listsWithItems,
      }
    })
  )
  
  return eventsWithDetails.sort((a, b) => 
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  )
}

export default async function EventsPage() {
  const user = await requireAuth()
  const events = await getUserEvents(user.id)

  const today = new Date()
  const upcomingEvents = events.filter((event: any) => new Date(event.eventDate) >= today)
  const pastEvents = events.filter((event: any) => new Date(event.eventDate) < today)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-ink mb-2" style={{fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:'0.95'}}>
              Your <span className="bg-brand px-1">Events.</span>
            </h1>
            <p className="text-gray-500">
              Birthdays, weddings, whatever's coming up. Each one gets a list.
            </p>
          </div>
          <Link href="/events/new">
            <Button>Create Event</Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="font-display text-2xl text-ink mb-2">
              Nothing on the calendar yet.
            </h3>
            <p className="text-gray-500 mb-6">
              Add an event and a gift list comes with it.
            </p>
            <Link href="/events/new">
              <Button>Create Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-black mb-4">
                  Upcoming Events ({upcomingEvents.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-black mb-4">
                  Past Events ({pastEvents.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}