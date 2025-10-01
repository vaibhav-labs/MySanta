"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { formatDate } from "@/lib/utils"

interface ListCardProps {
  list: {
    id: string
    name: string
    createdAt: Date
    event?: {
      name: string
      eventDate: Date
    } | null
    items: {
      id: string
      status: string
    }[]
  }
}

export function ListCard({ list }: ListCardProps) {
  const totalItems = list.items.length
  const purchasedItems = list.items.filter(item => item.status === "PURCHASED").length

  return (
    <Link href={`/lists/${list.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{list.name}</CardTitle>
          {list.event && (
            <p className="text-sm text-gray-600">
              {list.event.name} • {formatDate(new Date(list.event.eventDate))}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Purchased</span>
              <span className="font-medium text-green-600">{purchasedItems}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{
                  width: totalItems > 0 ? `${(purchasedItems / totalItems) * 100}%` : "0%",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Created {formatDate(new Date(list.createdAt))}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}