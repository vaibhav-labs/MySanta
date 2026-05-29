"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { ShareListButton } from "@/components/ShareButton"
import { formatDate } from "@/lib/utils"

interface ListHeaderProps {
  list: {
    id: string
    name: string
    user: {
      id: string
      name: string | null
      email: string
      address: string | null
    } | null
    event?: {
      name: string
      eventDate: Date
    } | null
    isOwner: boolean
  }
}

export function ListHeader({ list }: ListHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-black">{list.name}</h1>
          {list.event && (
            <p className="text-gray-600">
              For {list.event.name} on {formatDate(new Date(list.event.eventDate))}
            </p>
          )}
          {!list.isOwner && list.user && (
            <p className="text-sm text-gray-500 mt-1">
              Created by {list.user.name || list.user.email}
            </p>
          )}
        </div>

        {list.isOwner && (
          <div className="flex items-center space-x-3">
            <Button variant="outline">Edit List</Button>
            <ShareListButton listId={list.id} listName={list.name} />
          </div>
        )}
      </div>

      {!list.isOwner && (
        <div className="bg-gray-50 border border-secondary p-4 mb-6">
          <h3 className="font-medium text-black mb-2">Shopping for {list.user?.name || "someone special"}?</h3>
          <p className="text-sm text-gray-600">
            Select items to hold, then proceed to purchase them. The recipient will be notified when gifts are purchased.
          </p>
        </div>
      )}
    </div>
  )
}