"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { DashboardIcon, CalendarIcon, ListIcon, UserIcon, MaleIcon, FemaleIcon, OtherGenderIcon, SearchIcon, UsersIcon } from "@/components/ui/Icons"
import { getInitials } from "@/lib/utils"

function getGenderIcon(gender?: string) {
  switch (gender) {
    case "male":
      return MaleIcon
    case "female":
      return FemaleIcon
    default:
      return OtherGenderIcon
  }
}

export function Navigation() {
  const { data: session, status } = useSession()
  const [showSearch, setShowSearch] = useState(false)

  if (status === "loading") {
    return (
      <nav className="border-b border-secondary bg-white">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-black flex items-center space-x-2">
              <span>🎁</span>
              <span>MySanta</span>
            </Link>
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full" />
          </div>
        </div>
      </nav>
    )
  }

  if (!session) {
    return (
      <nav className="border-b border-secondary bg-white">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-black flex items-center space-x-2">
              <span>🎁</span>
              <span>MySanta</span>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-secondary bg-white">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-xl font-semibold text-black flex items-center space-x-2">
            <span>🎁</span>
            <span>MySanta</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center space-x-2 text-sm text-black hover:text-gray-600 transition-colors">
              <DashboardIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/events" className="flex items-center space-x-2 text-sm text-black hover:text-gray-600 transition-colors">
              <CalendarIcon className="w-4 h-4" />
              <span>Events</span>
            </Link>
            <Link href="/lists" className="flex items-center space-x-2 text-sm text-black hover:text-gray-600 transition-colors">
              <ListIcon className="w-4 h-4" />
              <span>My Lists</span>
            </Link>
            <Link href="/search" className="flex items-center space-x-2 text-sm text-black hover:text-gray-600 transition-colors">
              <SearchIcon className="w-4 h-4" />
              <span>Search</span>
            </Link>
            <Link href="/friends" className="flex items-center space-x-2 text-sm text-black hover:text-gray-600 transition-colors">
              <UsersIcon className="w-4 h-4" />
              <span>Friends</span>
            </Link>
            <Link href="/social" className="flex items-center space-x-2 text-sm text-black hover:text-gray-600 transition-colors">
              <UsersIcon className="w-4 h-4" />
              <span>Social</span>
            </Link>

            <div className="relative group">
              <button className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    (() => {
                      const GenderIcon = getGenderIcon((session.user as any)?.gender)
                      return <GenderIcon className="w-5 h-5" />
                    })()
                  )}
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-black hover:bg-hover"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-black hover:bg-hover"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}