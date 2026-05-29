"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DashboardIcon, CalendarIcon, ListIcon, UserIcon, SearchIcon, UsersIcon } from "@/components/ui/Icons"
import { NotificationBell } from "@/components/ui/NotificationBell"

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/events',    label: 'Events',    icon: CalendarIcon },
  { href: '/lists',     label: 'My Lists',  icon: ListIcon },
  { href: '/search',   label: 'Search',    icon: SearchIcon },
  { href: '/friends',  label: 'Friends',   icon: UsersIcon },
]

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === "loading") {
    return (
      <nav className="border-b border-secondary bg-white sticky top-0 z-40">
        <div className="container h-16 flex items-center justify-between">
          <BrandMark />
          <div className="h-8 w-8 bg-brand-light animate-pulse rounded-full" />
        </div>
      </nav>
    )
  }

  if (!session) {
    return (
      <nav className="border-b border-secondary bg-white sticky top-0 z-40">
        <div className="container h-16 flex items-center justify-between">
          <BrandMark />
          <Link href="/sign-in">
            <button className="text-sm font-semibold px-5 py-2 rounded-xl bg-brand text-white hover:bg-brand-dark transition-all">
              Sign In
            </button>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-secondary bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard">
            <BrandMark />
          </Link>

          <div className="flex items-center space-x-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname?.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm transition-all ${
                    active
                      ? 'bg-brand-light text-brand font-semibold'
                      : 'text-gray-500 hover:text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              )
            })}

            {/* Notifications */}
            <NotificationBell />

            {/* Avatar dropdown */}
            <div className="relative group ml-2">
              <button className="flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden ring-2 ring-brand/20 hover:ring-brand/50 transition-all">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-card flex items-center justify-center text-white text-xs font-bold">
                    {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </button>

              <div className="absolute right-0 mt-2 w-52 bg-white border border-secondary rounded-2xl shadow-card-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-secondary">
                  <p className="text-sm font-semibold text-primary truncate">{session.user.name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                </div>
                <div className="py-1">
                  <Link href="/profile" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-primary hover:bg-surface transition-colors">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
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
    <div className="flex items-center space-x-2.5">
      <div className="w-8 h-8 rounded-xl bg-gradient-card flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
          <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
          <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
        </svg>
      </div>
      <span className="text-base font-bold tracking-tight text-primary">MySanta</span>
    </div>
  )
}
