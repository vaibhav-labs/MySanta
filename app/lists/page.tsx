import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Navigation } from "@/components/Navigation"
import { CreateListButton } from "@/components/lists/CreateListButton"
import { ListCard } from "@/components/lists/ListCard"

async function getUserLists(userId: string) {
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
  })
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
            <h1 className="text-2xl font-semibold text-black mb-2">
              My Lists
            </h1>
            <p className="text-gray-600">
              Manage your gift lists and add new items.
            </p>
          </div>
          <CreateListButton />
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-black mb-2">
              No lists yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first gift list to get started.
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