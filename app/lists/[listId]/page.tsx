import { requireAuth } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Navigation } from "@/components/Navigation"
import { ListHeader } from "@/components/lists/ListHeader"
import { ListItems } from "@/components/lists/ListItems"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

async function getList(listId: string, userId: string) {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
        },
      },
      items: {
        include: {
          heldByUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!list) {
    return null
  }

  const isOwner = list.userId === userId

  if (!isOwner) {
    list.items = list.items.filter(
      (item) =>
        !["PURCHASED", "RECEIVED", "BOUGHT_SELF", "REMOVED"].includes(
          item.status
        )
    )
  }

  return { ...list, isOwner }
}

export default async function ListPage({
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