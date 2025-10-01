"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { GiftsSentIcon, GiftsReceivedIcon, StatsIcon } from "@/components/ui/Icons"

interface DashboardStatsProps {
  stats: {
    giftsSent: number
    giftsReceived: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm text-gray-600">
            <GiftsSentIcon className="w-4 h-4" />
            <span>Gifts Sent</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-semibold text-black">
            {stats.giftsSent}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total gifts purchased for others
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm text-gray-600">
            <GiftsReceivedIcon className="w-4 h-4" />
            <span>Gifts Received</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-semibold text-black">
            {stats.giftsReceived}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total gifts purchased from your lists
          </p>
        </CardContent>
      </Card>
    </div>
  )
}