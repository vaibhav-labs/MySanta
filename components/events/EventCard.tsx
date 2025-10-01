"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { GiftIcon, PlusIcon } from "@/components/ui/Icons"
import { formatDate } from "@/lib/utils"

interface EventCardProps {
  event: {
    id: string
    name: string
    occasion: string
    eventDate: Date
    description?: string | null
    lists: {
      id: string
      name: string
      items: {
        id: string
        status: string
      }[]
    }[]
  }
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.eventDate)
  const today = new Date()
  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const isUpcoming = daysUntil >= 0
  const isPast = daysUntil < 0

  const mainList = event.lists[0] // The auto-created list
  const totalItems = mainList?.items.length || 0
  const purchasedItems = mainList?.items.filter(item => item.status === "PURCHASED").length || 0

  const getDateDisplay = () => {
    if (isPast) {
      return `${Math.abs(daysUntil)} days ago`
    } else if (daysUntil === 0) {
      return "Today! 🎉"
    } else if (daysUntil === 1) {
      return "Tomorrow!"
    } else {
      return `${daysUntil} days away`
    }
  }

  return (
    <Card className={`${isUpcoming ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <p className="text-sm text-gray-600">{event.occasion}</p>
            <p className="text-sm font-medium mt-1">
              {formatDate(eventDate)} • {getDateDisplay()}
            </p>
          </div>
          {isUpcoming && daysUntil <= 30 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Soon
            </span>
          )}
        </div>
        {event.description && (
          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mainList && (
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-sm text-black mb-2 flex items-center space-x-1">
                <GiftIcon className="w-4 h-4" />
                <span>Gift List</span>
              </h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Purchased</span>
                <span className="font-medium text-green-600">{purchasedItems}</span>
              </div>
              {totalItems > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(purchasedItems / totalItems) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-2">
            {mainList ? (
              <Link href={`/lists/${mainList.id}`} className="flex-1">
                <Button size="sm" className="w-full flex items-center justify-center space-x-2">
                  <GiftIcon className="w-4 h-4" />
                  <span>View Gift List</span>
                </Button>
              </Link>
            ) : (
              <Link href="/lists/new" className="flex-1">
                <Button size="sm" variant="outline" className="w-full flex items-center justify-center space-x-2">
                  <PlusIcon className="w-4 h-4" />
                  <span>Create List</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}