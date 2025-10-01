import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Navigation } from "@/components/Navigation"
import { EventCard } from "@/components/events/EventCard"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

async function getUserEvents(userId: string) {
  return prisma.event.findMany({
    where: { userId },
    include: {
      lists: {
        include: {
          items: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
    orderBy: { eventDate: "asc" },
  })
}

export default async function EventsPage() {
  const user = await requireAuth()
  const events = await getUserEvents(user.id)

  const today = new Date()
  const upcomingEvents = events.filter(event => new Date(event.eventDate) >= today)
  const pastEvents = events.filter(event => new Date(event.eventDate) < today)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-black mb-2">
              Events
            </h1>
            <p className="text-gray-600">
              Manage your special occasions and gift lists.
            </p>
          </div>
          <Link href="/events/new">
            <Button>Create Event</Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-black mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first event and get an automatic gift list!
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