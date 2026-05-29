"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"

const CARD_ACCENTS = [
  { bg: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', text: '#7C3AED', bar: '#8B5CF6' },
  { bg: 'linear-gradient(135deg,#FCE7F3,#FBCFE8)', text: '#BE185D', bar: '#EC4899' },
  { bg: 'linear-gradient(135deg,#CFFAFE,#A5F3FC)', text: '#0E7490', bar: '#22D3EE' },
  { bg: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)', text: '#065F46', bar: '#10B981' },
  { bg: 'linear-gradient(135deg,#FFEDD5,#FED7AA)', text: '#C2410C', bar: '#F97316' },
]

function getAccent(id: string) {
  const sum = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return CARD_ACCENTS[sum % CARD_ACCENTS.length]
}

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
  const totalItems = list.items.length
  const purchasedItems = list.items.filter(i => i.status === "PURCHASED").length
  const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0
  const accent = getAccent(list.id)

  return (
    <Link href={`/lists/${list.id}`}>
      <div className="bg-white border border-secondary rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
        {/* Coloured top strip */}
        <div className="h-2" style={{background: accent.bar}} />

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1 mr-3">
              <h3 className="font-bold text-primary group-hover:text-brand transition-colors truncate">
                {list.name}
              </h3>
              {list.event && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {list.event.name} · {formatDate(new Date(list.event.eventDate))}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{background: accent.bg}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{color: accent.text}}>
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-gray-400">{totalItems} items</span>
            <span className="font-semibold" style={{color: accent.bar}}>{purchasedItems} purchased</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: accent.bar }} />
          </div>

          <p className="text-xs text-gray-400 mt-3">{formatDate(new Date(list.createdAt))}</p>
        </div>
      </div>
    </Link>
  )
}
