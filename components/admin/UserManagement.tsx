"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { formatDate } from "@/lib/utils"
import { toast } from "react-hot-toast"

interface User {
  id: string
  name: string | null
  email: string
  role: "USER" | "ADMIN"
  createdAt: Date
  _count: {
    lists: number
    itemsHeld: number
  }
}

interface UserManagementProps {
  userData: {
    users: User[]
    totalCount: number
    totalPages: number
  }
  currentPage: number
}

export function UserManagement({ userData, currentPage }: UserManagementProps) {
  const [users, setUsers] = useState(userData.users)
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    setLoading(prev => ({ ...prev, [userId]: true }))

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to delete user")
        return
      }

      setUsers(prev => prev.filter(user => user.id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleSuspendUser = async (userId: string) => {
    toast.error("Suspend functionality not implemented in this demo")
  }

  const getPaginationLinks = () => {
    const links = []
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(userData.totalPages, currentPage + 2)

    for (let i = startPage; i <= endPage; i++) {
      links.push(i)
    }

    return links
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <div className="text-sm text-gray-600">
          {userData.totalCount} total users
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary">
                <th className="text-left py-3 px-2 font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Lists</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Gifts Sent</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Joined</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium text-black">
                        {user.name || "Unnamed User"}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-900">
                    {user._count.lists}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-900">
                    {user._count.itemsHeld}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-500">
                    {formatDate(new Date(user.createdAt))}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                        disabled={loading[user.id]}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        loading={loading[user.id]}
                        disabled={user.role === "ADMIN"}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {userData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, userData.totalCount)} of {userData.totalCount} users
            </div>

            <div className="flex items-center space-x-1">
              {currentPage > 1 && (
                <Link href={`/admin?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}

              {getPaginationLinks().map((page) => (
                <Link key={page} href={`/admin?page=${page}`}>
                  <Button
                    variant={page === currentPage ? "primary" : "outline"}
                    size="sm"
                  >
                    {page}
                  </Button>
                </Link>
              ))}

              {currentPage < userData.totalPages && (
                <Link href={`/admin?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}