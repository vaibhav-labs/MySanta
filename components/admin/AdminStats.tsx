"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface AdminStatsProps {
  stats: {
    totalUsers: number
    totalLists: number
    totalItems: number
    totalPurchases: number
    newUsersThisMonth: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users on the platform",
    },
    {
      title: "New Users This Month",
      value: stats.newUsersThisMonth,
      description: "Users who joined this month",
    },
    {
      title: "Total Lists",
      value: stats.totalLists,
      description: "Gift lists created",
    },
    {
      title: "Total Items",
      value: stats.totalItems,
      description: "Items added to lists",
    },
    {
      title: "Total Purchases",
      value: stats.totalPurchases,
      description: "Items marked as purchased",
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-medium text-black mb-4">Platform Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold text-black">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}