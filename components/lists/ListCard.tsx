"use client"

import Link from "next/link"
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
  const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0

  return (
    <Link href={`/lists/${list.id}`}>
      <div className="bg-white border border-secondary rounded-2xl shadow-card hover:shadow-card-hover transition-all cursor-pointer group p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-primary group-hover:text-brand transition-colors line-clamp-1">
              {list.name}
            </h3>
            {list.event && (
              <p className="text-xs text-gray-400 mt-0.5">
                {list.event.name} · {formatDate(new Date(list.event.eventDate))}
              </p>
            )}
          </div>
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-light flex-shrink-0 ml-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-brand">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-500">{totalItems} items</span>
          <span className="text-brand font-medium">{purchasedItems} purchased</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-brand-light rounded-full h-1.5">
          <div
            className="bg-brand h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Created {formatDate(new Date(list.createdAt))}
        </p>
      </div>
    </Link>
  )
}
