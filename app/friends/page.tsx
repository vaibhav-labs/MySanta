import { requireAuth } from "@/lib/auth-helpers"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { FriendsGrid } from "@/components/friends/FriendsGrid"

export default async function FriendsPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">
              My Friends
            </h1>
            <p className="text-gray-600">
              See what your friends are wishing for and their upcoming events.
            </p>
          </div>

          <FriendsGrid />
        </div>
      </main>

      <Footer />
    </div>
  )
}