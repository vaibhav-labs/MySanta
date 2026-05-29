"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

interface Notification {
  id: string
  message: string
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
    }
  }, [session?.user?.id])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    setLoading(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notificationIds.includes(notif.id) ? { ...notif, isRead: true } : notif
          )
        )
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
    }
    setLoading(false)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!session?.user?.id) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-600">
          <path
            d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
                        markAsRead(unreadIds)
                      }}
                      disabled={loading}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                      {!notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => markAsRead([notification.id])}
                          disabled={loading}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}