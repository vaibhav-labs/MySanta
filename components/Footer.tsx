import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-secondary">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-brand">
                <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 11V22" stroke="currentColor" strokeWidth="1.8"/>
                <rect x="3" y="7" width="18" height="4" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
                <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
                <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
              </svg>
              <span className="text-lg font-bold text-primary">MySanta</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              The perfect platform for creating and sharing gift lists. Make every occasion special
              with thoughtful gift giving and seamless coordination with friends and family.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-black mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/lists" className="text-gray-600 hover:text-black transition-colors">
                  My Lists
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-600 hover:text-black transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-black transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-black mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-black transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-black transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-secondary">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <div className="mb-2 md:mb-0">
              © {currentYear} MySanta. All rights reserved by VJ.
            </div>
            <div className="flex items-center space-x-4">
              <span>Made with ❤️ for thoughtful gift giving</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}