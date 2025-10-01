import { requireAuth } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { Navigation } from "@/components/Navigation"
import { ListHeader } from "@/components/lists/ListHeader"
import { ListItems } from "@/components/lists/ListItems"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

async function getList(listId: string, userId: string) {
  const list = await db.list.findById(listId)
  
  if (!list) {
    return null
  }

  // Get additional details
  const event = list.event_id ? await db.event.findById(list.event_id) : null
  const user = await db.user.findById(list.user_id)
  const items = await db.listItem.findMany(listId)
  
  // Get held by user details for items
  const itemsWithDetails = await Promise.all(
    items.map(async (item: any) => {
      const heldByUser = item.held_by_user_id ? await db.user.findById(item.held_by_user_id) : null
      return {
        ...item,
        heldByUser: heldByUser ? {
          id: heldByUser.id,
          name: heldByUser.name,
        } : null,
      }
    })
  )

  const isOwner = list.user_id === userId

  // If not the owner, filter out purchased/received items
  const filteredItems = isOwner ? itemsWithDetails : itemsWithDetails.filter((item: any) =>
    !["PURCHASED", "RECEIVED", "BOUGHT_SELF", "REMOVED"].includes(item.status)
  )

  return {
    ...list,
    event,
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
    } : null,
    items: filteredItems,
    isOwner,
  }
}

export default async function ListDetailPage({
  params,
}: {
  params: { listId: string }
}) {
  const user = await requireAuth()
  const list = await getList(params.listId, user.id)

  if (!list) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <ListHeader list={list} />
        <ListItems list={list} />
      </main>
    </div>
  )
}