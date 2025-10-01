"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ProductImage } from "@/components/ui/ProductImage"
import { CalendarIcon, ListIcon, HeartIcon, PlusIcon, ExternalLinkIcon } from "@/components/ui/Icons"
import { formatPrice } from "@/lib/currencies"
import { toast } from "react-hot-toast"

interface FriendEvent {
  id: string
  name: string
  occasion: string
  description?: string
  eventDate: string
  createdAt: string
  _count: {
    lists: number
  }
}

interface FriendList {
  id: string
  name: string
  createdAt: string
  event?: {
    name: string
    occasion: string
    eventDate: string
  }
  _count: {
    items: number
  }
  items: {
    id: string
    productName: string
    imageUrl?: string | null
    price?: number | null
    currency?: string
    status: string
  }[]
}

interface Friend {
  id: string
  name: string | null
  email: string | null
  gender?: string | null
  image?: string | null
  friendshipId?: string
  friendSince?: string
  upcomingEvents: FriendEvent[]
  pastEvents: FriendEvent[]
  totalEvents: number
  totalLists: number
  totalWishlistItems: number
  events: FriendEvent[]
  lists: FriendList[]
}

interface FriendsResponse {
  friends: Friend[]
  total: number
}

export function FriendsGrid() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/friends/details")

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch friends")
      }

      const data: FriendsResponse = await response.json()
      setFriends(data.friends)
    } catch (error) {
      console.error("Error fetching friends:", error)
      setError(error instanceof Error ? error.message : "Failed to load friends")
      toast.error("Failed to load friends")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeUntilEvent = (eventDate: string) => {
    const now = new Date()
    const event = new Date(eventDate)
    const diffTime = event.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Past event"
    if (diffDays === 0) return "Today!"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays <= 7) return `In ${diffDays} days`
    if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`
    return `In ${Math.ceil(diffDays / 30)} months`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading friends...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchFriends}>Try Again</Button>
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-black mb-2">No friends yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your network by adding friends from your contacts or inviting others to join MySanta.
          </p>
          <Button className="flex items-center space-x-2 mx-auto">
            <PlusIcon className="w-4 h-4" />
            <span>Add Friends</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {friends.map((friend) => (
        <Card key={friend.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {friend.image ? (
                  <img
                    src={friend.image}
                    alt={friend.name || "Friend"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-2xl font-medium">
                    {(friend.name || friend.email || "?")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black text-lg">
                  {friend.name || "Friend"}
                </h3>
                {friend.email && (
                  <p className="text-sm text-gray-600">{friend.email}</p>
                )}
                {friend.friendSince && (
                  <p className="text-xs text-gray-500">
                    Friends since {formatDate(friend.friendSince)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-lg font-semibold text-black">{friend.totalEvents}</div>
                <div className="text-xs text-gray-600">Events</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-black">{friend.totalLists}</div>
                <div className="text-xs text-gray-600">Lists</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-black">{friend.totalWishlistItems}</div>
                <div className="text-xs text-gray-600">Wishes</div>
              </div>
            </div>

            {friend.upcomingEvents.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-black mb-3 flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Upcoming Events</span>
                </h4>
                <div className="space-y-2">
                  {friend.upcomingEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-black">{event.name}</p>
                          <p className="text-xs text-gray-600">{event.occasion}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.eventDate)}</p>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          {getTimeUntilEvent(event.eventDate)}
                        </div>
                      </div>
                      {event._count.lists > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {event._count.lists} {event._count.lists === 1 ? 'list' : 'lists'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {friend.lists.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-black mb-3 flex items-center space-x-2">
                  <ListIcon className="w-4 h-4" />
                  <span>Recent Lists</span>
                </h4>
                <div className="space-y-3">
                  {friend.lists.slice(0, 2).map((list) => (
                    <div key={list.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-black">{list.name}</p>
                          {list.event && (
                            <p className="text-xs text-gray-600">
                              For {list.event.name} ({list.event.occasion})
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {list._count.items} {list._count.items === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      {list.items.length > 0 && (
                        <div className="flex space-x-2 mt-2 overflow-x-auto">
                          {list.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex-shrink-0">
                              <ProductImage
                                src={item.imageUrl}
                                alt={item.productName}
                                size="small"
                                lazy={false}
                                quality="low"
                                className="w-12 h-12 rounded"
                              />
                            </div>
                          ))}
                          {list._count.items > 3 && (
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{list._count.items - 3}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <HeartIcon className="w-4 h-4" />
                <span>View Profile</span>
              </Button>
              {friend.lists.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center space-x-1"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  <span>View Lists</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}