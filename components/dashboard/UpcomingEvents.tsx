"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { CalendarIcon, PlusIcon } from "@/components/ui/Icons"
import { formatDate } from "@/lib/utils"

interface Event {
  id: string
  name: string
  occasion: string
  eventDate: Date
}

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5" />
          <span>Upcoming Events</span>
        </CardTitle>
        <Link href="/events/new">
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <PlusIcon className="w-4 h-4" />
            <span>Add Event</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No upcoming events in the next 30 days.</p>
            <Link href="/events/new">
              <Button size="sm" className="flex items-center space-x-1">
                <PlusIcon className="w-4 h-4" />
                <span>Add Event</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-3 border border-secondary"
              >
                <h3 className="font-medium text-black text-sm">{event.name}</h3>
                <p className="text-xs text-gray-600">{event.occasion}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(new Date(event.eventDate))}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}