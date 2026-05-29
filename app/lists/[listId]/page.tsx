import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Navigation } from "@/components/Navigation"
import { ListHeader } from "@/components/lists/ListHeader"
import { ListItems } from "@/components/lists/ListItems"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

async function getList(listId: string, userId: string | null) {
  const list = await db.list.findById(listId)
  if (!list) return null

  const [event, owner, items] = await Promise.all([
    list.eventId ? db.event.findById(list.eventId) : Promise.resolve(null),
    db.user.findById(list.userId),
    db.listItem.findMany(listId),
  ])

  const itemsWithDetails = await Promise.all(
    items.map(async (item: any) => {
      const heldByUser = item.heldByUserId
        ? await db.user.findById(item.heldByUserId)
        : null
      return {
        ...item,
        heldByUser: heldByUser ? { id: heldByUser.id, name: heldByUser.name } : null,
      }
    })
  )

  const isOwner = !!userId && list.userId === userId

  // Hide purchased/received items from anyone who isn't the owner
  const filteredItems = isOwner
    ? itemsWithDetails
    : itemsWithDetails.filter(
        (item: any) =>
          !["PURCHASED", "RECEIVED", "BOUGHT_SELF", "REMOVED"].includes(item.status)
      )

  return {
    ...list,
    event,
    user: owner
      ? { id: owner.id, name: owner.name, email: owner.email, address: owner.address }
      : null,
    items: filteredItems,
    isOwner,
  }
}

export default async function ListDetailPage({
  params,
}: {
  params: { listId: string }
}) {
  // No requireAuth — the page is publicly viewable
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id ?? null

  const list = await getList(params.listId, currentUserId)
  if (!list) notFound()

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container py-8">
        <ListHeader list={list} />
        {/* Pass currentUserId so ListItems knows whether the visitor is authenticated */}
        <ListItems list={list} currentUserId={currentUserId} />
      </main>
    </div>
  )
}
