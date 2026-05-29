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
        <div className="container h-14 flex items-center justify-between">
          <BrandMark />
          <div className="h-6 w-24 bg-surface animate-pulse" />
        </div>
      </nav>
    )
  }

  if (!session) {
    return (
      <nav className="border-b border-secondary bg-white sticky top-0 z-40">
        <div className="container h-14 flex items-center justify-between">
          <BrandMark />
          <Link href="/sign-in">
            <button className="text-xs font-bold uppercase tracking-widest px-5 py-2 bg-ink text-white hover:bg-gray-800 transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-secondary bg-white sticky top-0 z-40">
      <div className="container">
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard">
            <BrandMark />
          </Link>

          <div className="flex items-center space-x-0.5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname?.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1.5 px-3 py-2 text-sm transition-all ${
                    active
                      ? 'bg-brand text-ink font-bold'
                      : 'text-gray-500 hover:text-ink hover:bg-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">{label}</span>
                </Link>
              )
            })}

            <NotificationBell />

            {/* Avatar */}
            <div className="relative group ml-1">
              <button className="flex items-center justify-center w-8 h-8 overflow-hidden border-2 border-secondary hover:border-ink transition-colors">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-ink flex items-center justify-center text-white text-xs font-bold">
                    {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </button>

              <div className="absolute right-0 mt-1 w-52 bg-white border border-secondary shadow-card-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-secondary">
                  <p className="text-sm font-bold text-ink truncate">{session.user.name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                </div>
                <div className="py-1">
                  <Link href="/profile" className="flex items-center space-x-2 px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors">
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
    <span style={{fontFamily:'Syne,sans-serif', fontWeight:700}} className="text-xl text-ink tracking-tight">MySanta</span>
  )
}
