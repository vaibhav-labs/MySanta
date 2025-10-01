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
              <span>🎁</span>
              <span className="text-xl font-semibold text-black">MySanta</span>
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