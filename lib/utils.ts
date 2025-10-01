import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if the date is valid
  if (!dateObj || isNaN(dateObj.getTime())) {
    return "Invalid Date"
  }
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

export function formatPriceUSD(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function isOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId
}

export function getUpcomingEvents(events: any[], daysAhead: number = 30) {
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + daysAhead)

  return events.filter(event => {
    const dateValue = event.eventDate || event.event_date
    const eventDate = new Date(dateValue)
    return !isNaN(eventDate.getTime()) && eventDate >= today && eventDate <= futureDate
  }).sort((a, b) => {
    const aDate = new Date(a.eventDate || a.event_date)
    const bDate = new Date(b.eventDate || b.event_date)
    return aDate.getTime() - bDate.getTime()
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}