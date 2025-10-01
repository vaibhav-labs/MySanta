"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { RecentListsIcon, PlusIcon, EyeIcon } from "@/components/ui/Icons"
import { formatDate } from "@/lib/utils"

interface List {
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

interface RecentListsProps {
  lists: List[]
}

export function RecentLists({ lists }: RecentListsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <RecentListsIcon className="w-5 h-5" />
          <span>Recent Lists</span>
        </CardTitle>
        <Link href="/lists">
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <EyeIcon className="w-4 h-4" />
            <span>View All</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't created any lists yet.</p>
            <Link href="/lists/new">
              <Button className="flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                <span>Create Your First List</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="block p-4 border border-secondary hover:bg-hover transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-black">{list.name}</h3>
                    {list.event && (
                      <p className="text-sm text-gray-600">
                        {list.event.name} • {formatDate(new Date(list.event.eventDate))}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Created {formatDate(new Date(list.createdAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">
                      {list.items.length} items
                    </p>
                    <p className="text-xs text-gray-500">
                      {list.items.filter(item => item.status === "PURCHASED").length} purchased
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}