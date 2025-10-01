"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { UsersIcon, GiftIcon, CalendarIcon, ListIcon, MaleIcon, FemaleIcon, OtherGenderIcon, SearchIcon } from "@/components/ui/Icons"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-hot-toast"

interface SocialActivity {
  id: string
  activityType: "NEW_LIST" | "NEW_EVENT" | "LIST_UPDATE"
  entityType: "LIST" | "EVENT"
  entityId: string
  entityName: string
  createdAt: string
  user: {
    id: string
    name: string | null
    gender: string
  }
}

interface Friend {
  id: string
  name: string | null
  email: string
  gender: string
  friendshipId: string
}

interface Contact {
  id: string
  name: string
  email: string
  photo?: string
}

export function SocialFeed() {
  const [activities, setActivities] = useState<SocialActivity[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showContacts, setShowContacts] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [importingContacts, setImportingContacts] = useState(false)

  useEffect(() => {
    fetchActivities()
    fetchFriends()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/social/activity")
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/social/friends")
      if (response.ok) {
        const data = await response.json()
        setFriends(data)
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error)
    }
  }

  const addFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      const response = await fetch("/api/social/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      })

      if (response.ok) {
        setEmail("")
        setShowAddFriend(false)
        fetchFriends()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to send friend request")
      }
    } catch (error) {
      alert("Failed to send friend request")
    }
  }

  const fetchContacts = async () => {
    setLoadingContacts(true)
    try {
      const response = await fetch("/api/social/contacts")
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to fetch contacts")
      }
    } catch (error) {
      toast.error("Failed to fetch contacts")
    } finally {
      setLoadingContacts(false)
    }
  }

  const importSelectedContacts = async () => {
    if (selectedContacts.size === 0) {
      toast.error("Please select contacts to import")
      return
    }

    setImportingContacts(true)
    try {
      const selectedEmails = contacts
        .filter(contact => selectedContacts.has(contact.id))
        .map(contact => contact.email)

      const response = await fetch("/api/social/invite-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: selectedEmails })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Added ${data.results.friendsAdded} new friends!`)
        setSelectedContacts(new Set())
        setShowContacts(false)
        fetchFriends()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to import contacts")
      }
    } catch (error) {
      toast.error("Failed to import contacts")
    } finally {
      setImportingContacts(false)
    }
  }

  const toggleContactSelection = (contactId: string) => {
    const newSelected = new Set(selectedContacts)
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId)
    } else {
      newSelected.add(contactId)
    }
    setSelectedContacts(newSelected)
  }

  const selectAllContacts = () => {
    setSelectedContacts(new Set(contacts.map(c => c.id)))
  }

  const deselectAllContacts = () => {
    setSelectedContacts(new Set())
  }

  const getActivityIcon = (activityType: string, entityType: string) => {
    if (entityType === "EVENT") return <CalendarIcon className="w-5 h-5 text-blue-600" />
    if (activityType === "NEW_LIST") return <ListIcon className="w-5 h-5 text-green-600" />
    return <GiftIcon className="w-5 h-5 text-red-600" />
  }

  const getActivityText = (activity: SocialActivity) => {
    const userName = activity.user.name || "Someone"
    switch (activity.activityType) {
      case "NEW_LIST":
        return `${userName} created a new list "${activity.entityName}"`
      case "NEW_EVENT":
        return `${userName} created a new event "${activity.entityName}"`
      case "LIST_UPDATE":
        return `${userName} updated their list "${activity.entityName}"`
      default:
        return `${userName} made an update`
    }
  }

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <MaleIcon className="w-4 h-4 text-blue-600" />
      case "female":
        return <FemaleIcon className="w-4 h-4 text-pink-600" />
      default:
        return <OtherGenderIcon className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Friends Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <UsersIcon className="w-5 h-5" />
              <span>Friends ({friends.length})</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => setShowAddFriend(!showAddFriend)}
              >
                Add Friend
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowContacts(!showContacts)
                  if (!showContacts && contacts.length === 0) {
                    fetchContacts()
                  }
                }}
                className="flex items-center space-x-1"
              >
                <SearchIcon className="w-4 h-4" />
                <span>Import from Google</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showAddFriend && (
            <form onSubmit={addFriend} className="mb-4 space-y-2">
              <input
                type="email"
                placeholder="Enter friend's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <div className="flex space-x-2">
                <Button type="submit" size="sm">Send Request</Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddFriend(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {showContacts && (
            <div className="mb-4 space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-black">Import from Google Contacts</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContacts(false)}
                  >
                    Close
                  </Button>
                </div>

                {loadingContacts ? (
                  <div className="text-center py-4">
                    <div className="animate-pulse">Loading contacts...</div>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>No contacts found or you need to sign in with Google to access contacts.</p>
                    <p className="text-sm mt-1">Make sure you've granted contacts permission when signing in.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {contacts.length} contacts found • {selectedContacts.size} selected
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={selectAllContacts}
                          disabled={selectedContacts.size === contacts.length}
                        >
                          Select All
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={deselectAllContacts}
                          disabled={selectedContacts.size === 0}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => toggleContactSelection(contact.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedContacts.has(contact.id)}
                            onChange={() => toggleContactSelection(contact.id)}
                            className="w-4 h-4"
                          />
                          {contact.photo ? (
                            <img
                              src={contact.photo}
                              alt={contact.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                            <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowContacts(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={importSelectedContacts}
                        loading={importingContacts}
                        disabled={selectedContacts.size === 0}
                      >
                        Add {selectedContacts.size} Friend{selectedContacts.size !== 1 ? 's' : ''}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {friends.length === 0 ? (
            <p className="text-gray-500 text-sm">No friends yet. Add some friends to see their activity!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  {getGenderIcon(friend.gender)}
                  <span className="text-sm font-medium truncate">
                    {friend.name || friend.email}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity. Add friends to see their updates!</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                  {getActivityIcon(activity.activityType, activity.entityType)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getGenderIcon(activity.user.gender)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}