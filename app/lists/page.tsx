import { requireAuth } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { Navigation } from "@/components/Navigation"
import { CreateListButton } from "@/components/lists/CreateListButton"
import { ListCard } from "@/components/lists/ListCard"

async function getUserLists(userId: string) {
  const lists = await db.list.findMany(userId)
  
  // Get details for each list
  const listsWithDetails = await Promise.all(
    lists.map(async (list: any) => {
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

export default async function ListsPage() {
  const user = await requireAuth()
  const lists = await getUserLists(user.id)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-ink mb-2" style={{fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:'0.95'}}>
              My <span className="bg-brand px-1">Lists.</span>
            </h1>
            <p className="text-gray-500">
              Pick one to add to or share, or start a new one.
            </p>
          </div>
          <CreateListButton />
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="font-display text-2xl text-ink mb-2">
              No lists yet.
            </h3>
            <p className="text-gray-500 mb-6">
              Start one and add anything you've got your eye on.
            </p>
            <CreateListButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}