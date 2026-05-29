import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-secondary bg-white">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-display text-2xl text-ink">MySanta</span>
            <p className="text-gray-400 text-xs mt-1">Your wishlist. Their move.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 md:gap-8 text-sm" style={{color:'#6B7280'}}>
            <Link href="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
            <Link href="/lists" className="hover:text-ink transition-colors">My Lists</Link>
            <Link href="/events" className="hover:text-ink transition-colors">Events</Link>
            <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
            <Link href="/feedback" className="hover:text-ink transition-colors">Feedback</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-secondary flex items-center justify-between">
          <p className="text-xs text-gray-400">© {currentYear} MySanta · made with care by VJ</p>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-brand" />
            <div className="w-4 h-4 bg-ink" />
            <div className="w-4 h-4" style={{background:'#E63946'}} />
          </div>
        </div>
      </div>
    </footer>
  )
}
