import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mysanta.fun"),
  title: "MySanta — Your Wishlist. Their Move.",
  description: "Make a wishlist for any occasion. Share one link. No more duplicate gifts, no more guessing.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://www.mysanta.fun",
    siteName: "MySanta",
    title: "MySanta — Your Wishlist. Their Move.",
    description: "Make a wishlist for any occasion. Share one link. No more duplicate gifts, no more guessing.",
    // Image is supplied per-route via app/**/opengraph-image.tsx files
    // (Next's file-system convention). Leaving images empty here so each
    // page can ship its own preview.
  },
  twitter: {
    card: "summary_large_image",
    title: "MySanta — Your Wishlist. Their Move.",
    description: "Make a wishlist for any occasion. Share one link. No more duplicate gifts, no more guessing.",
  },
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
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
