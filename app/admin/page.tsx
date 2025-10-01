import { requireAdmin } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { Navigation } from "@/components/Navigation"
import { AdminStats } from "@/components/admin/AdminStats"
import { UserManagement } from "@/components/admin/UserManagement"

async function getAdminStats() {
  const stats = await db.stats.getAdminStats()
  
  // Get purchased items count
  const allItems = await db.listItem.findMany()
  const totalPurchases = allItems.filter((item: any) => item.status === 'PURCHASED').length
  
  // Get new users this month
  const allUsers = await db.user.findMany()
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const newUsersThisMonth = allUsers.filter((user: any) => new Date(user.created_at) >= monthStart).length

  return {
    totalUsers: stats.totalUsers,
    totalLists: stats.totalLists,
    totalItems: stats.totalItems,
    totalPurchases,
    newUsersThisMonth,
  }
}

async function getUsers(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit

  const allUsers = await db.user.findMany()
  const totalCount = allUsers.length
  
  // Sort by created_at desc and paginate
  const sortedUsers = allUsers.sort((a: any, b: any) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const users = sortedUsers.slice(skip, skip + limit)
  
  // Get counts for each user
  const usersWithCounts = await Promise.all(
    users.map(async (user: any) => {
      const lists = await db.list.findMany(user.id)
      const items = await db.listItem.findMany()
      const userPurchases = items.filter((item: any) => 
        item.held_by_user_id === user.id && item.status === 'PURCHASED'
      ).length
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        _count: {
          lists: lists.length,
          itemsHeld: userPurchases,
        },
      }
    })
  )

  return {
    users: usersWithCounts.map(user => ({
      ...user,
      role: user.role as "USER" | "ADMIN"
    })),
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
    <div className="min-h-screen bg-white">
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