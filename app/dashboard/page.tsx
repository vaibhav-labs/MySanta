import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { RecentLists } from "@/components/dashboard/RecentLists"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"

async function getStats(userId: string) {
  const [giftsSent, giftsReceived] = await Promise.all([
    prisma.listItem.count({
      where: {
        heldByUserId: userId,
        status: "PURCHASED",
      },
    }),
    prisma.listItem.count({
      where: {
        list: {
          userId: userId,
        },
        status: "PURCHASED",
      },
    }),
  ])

  return { giftsSent, giftsReceived }
}

async function getLists(userId: string) {
  return prisma.list.findMany({
    where: { userId },
    include: {
      event: true,
      items: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })
}

async function getEvents(userId: string) {
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + 30)

  return prisma.event.findMany({
    where: {
      userId,
      eventDate: {
        gte: today,
        lte: futureDate,
      },
    },
    orderBy: { eventDate: "asc" },
    take: 5,
  })
}

export default async function DashboardPage() {
  const user = await requireAuth()

  const [stats, lists, events] = await Promise.all([
    getStats(user.id),
    getLists(user.id),
    getEvents(user.id),
  ])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Welcome back, {user.name || "there"}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your gift lists and activities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats stats={stats} />
            <RecentLists lists={lists} />
          </div>

          <div>
            <UpcomingEvents events={events} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}