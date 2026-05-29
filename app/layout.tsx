import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "MySanta — Your Wishlist. Their Move.",
  description: "Create wishlists for any occasion. Share one link. Get exactly what you want — no hints, no duplicates, no awkward gifts.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#0D0D0D',
                border: '1px solid #E5E5E5',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
