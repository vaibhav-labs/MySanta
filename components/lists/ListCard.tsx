"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface ListCardProps {
  list: {
    id: string
    name: string
    createdAt: Date
    event?: { name: string; eventDate: Date } | null
    items: { id: string; status: string }[]
  }
}

export function ListCard({ list }: ListCardProps) {
  const total = list.items.length
  const purchased = list.items.filter(i => i.status === "PURCHASED").length
  const progress = total > 0 ? (purchased / total) * 100 : 0

  return (
    <Link href={`/lists/${list.id}`}>
      <div className="border border-secondary hover:border-ink transition-all cursor-pointer group p-5 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl uppercase text-ink group-hover:text-gray-600 transition-colors truncate leading-tight">
              {list.name}
            </h3>
            {list.event && (
              <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide truncate">
                {list.event.name} · {formatDate(new Date(list.event.eventDate))}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ml-3 w-8 h-8 bg-brand flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ink">
              <rect x="3" y="11" width="18" height="11" rx="1" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M12 11V22" stroke="currentColor" strokeWidth="2.5"/>
              <rect x="3" y="7" width="18" height="4" rx="0" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-3">
          <span className="text-gray-400 font-bold">{total} items</span>
          <span className="font-bold text-ink">{purchased} purchased</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface h-1">
          <div className="h-1 bg-ink transition-all" style={{ width: `${progress}%` }} />
        </div>

        <p className="text-xs text-gray-400 mt-3 uppercase tracking-wide">
          {formatDate(new Date(list.createdAt))}
        </p>
      </div>
    </Link>
  )
}
