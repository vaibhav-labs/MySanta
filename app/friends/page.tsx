import { requireAuth } from "@/lib/auth-helpers"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { FriendsGrid } from "@/components/friends/FriendsGrid"

export default async function FriendsPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-ink mb-2" style={{fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:'0.95'}}>
              Your <span className="bg-brand px-1">People.</span>
            </h1>
            <p className="text-gray-500">
              See what they're after, and what's coming up for them.
            </p>
          </div>

          <FriendsGrid />
        </div>
      </main>

      <Footer />
    </div>
  )
}