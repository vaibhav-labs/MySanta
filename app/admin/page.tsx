import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { Navigation } from "@/components/Navigation"
import { AdminStats } from "@/components/admin/AdminStats"
import { UserManagement } from "@/components/admin/UserManagement"

async function getAdminStats() {
  const [totalUsers, totalLists, totalItems, totalEvents, totalPurchases, newUsersThisMonth] =
    await Promise.all([
      prisma.user.count(),
      prisma.list.count(),
      prisma.listItem.count(),
      prisma.event.count(),
      prisma.listItem.count({ where: { status: "PURCHASED" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])

  return { totalUsers, totalLists, totalItems, totalEvents, totalPurchases, newUsersThisMonth }
}

async function getUsers(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit

  const [allUsersRaw, totalCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { lists: true } },
      },
    }),
    prisma.user.count(),
  ])

  const usersWithCounts = await Promise.all(
    allUsersRaw.map(async (user) => {
      const itemsHeld = await prisma.listItem.count({
        where: { heldByUserId: user.id, status: "PURCHASED" },
      })
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "USER" | "ADMIN",
        createdAt: user.createdAt,
        _count: {
          lists: user._count.lists,
          itemsHeld,
        },
      }
    })
  )

  return {
    users: usersWithCounts,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  await requireAdmin()

  const page = parseInt(searchParams.page || "1")
  const [stats, userData] = await Promise.all([
    getAdminStats(),
    getUsers(page),
  ])

  return (
    <div className="min-h-screen bg-surface">
      <Navigation />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users and monitor platform statistics.
          </p>
        </div>

        <div className="space-y-8">
          <AdminStats stats={stats} />
          <UserManagement userData={userData} currentPage={page} />
        </div>
      </main>
    </div>
  )
}
