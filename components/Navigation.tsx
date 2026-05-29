"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { DashboardIcon, CalendarIcon, ListIcon, UserIcon, MaleIcon, FemaleIcon, OtherGenderIcon, SearchIcon, UsersIcon } from "@/components/ui/Icons"
import { getInitials } from "@/lib/utils"

function GiftLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand">
      <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 11V22" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 7h18v4H3z" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7c0 0-2-4 0-4s2 4 0 4z" fill="currentColor"/>
      <path d="M12 7c0 0 2-4 0-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 7c0 0-2-4-4-2s2 2 4 2z" fill="currentColor"/>
      <path d="M12 7c0 0 2-4 4-2s-2 2-4 2z" fill="currentColor"/>
    </svg>
  )
}

function getGenderIcon(gender?: string) {
  switch (gender) {
    case "male": return MaleIcon
    case "female": return FemaleIcon
    default: return OtherGenderIcon
  }
}

export function Navigation() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <nav className="border-b border-secondary bg-white">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <BrandMark />
            <div className="h-8 w-8 bg-surface animate-pulse rounded-full" />
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
            <BrandMark />
            <Link href="/sign-in">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-secondary bg-white sticky top-0 z-40">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard">
            <BrandMark />
          </Link>

          <div className="flex items-center space-x-1">
            <NavLink href="/dashboard" icon={DashboardIcon} label="Dashboard" />
            <NavLink href="/events" icon={CalendarIcon} label="Events" />
            <NavLink href="/lists" icon={ListIcon} label="My Lists" />
            <NavLink href="/search" icon={SearchIcon} label="Search" />
            <NavLink href="/friends" icon={UsersIcon} label="Friends" />

            <div className="relative group ml-2">
              <button className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-light hover:bg-brand/20 transition-colors">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  (() => {
                    const GenderIcon = getGenderIcon((session.user as any)?.gender)
                    return <GenderIcon className="w-4 h-4 text-brand" />
                  })()
                )}
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary rounded-xl shadow-card-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link href="/profile" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-primary hover:bg-surface rounded-t-xl transition-colors">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-surface rounded-b-xl transition-colors"
                  >
                    <span className="w-4 h-4 text-gray-400">✕</span>
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

function BrandMark() {
  return (
    <div className="flex items-center space-x-2">
      <GiftLogo />
      <span className="text-lg font-bold text-primary tracking-tight">MySanta</span>
    </div>
  )
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-primary hover:bg-surface transition-colors"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
