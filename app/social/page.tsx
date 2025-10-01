import { requireAuth } from "@/lib/auth-helpers"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { SocialFeed } from "@/components/social/SocialFeed"

export default async function SocialPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">
              Social
            </h1>
            <p className="text-gray-600">
              Connect with friends and see their gift lists and events.
            </p>
          </div>

          <SocialFeed />
        </div>
      </main>

      <Footer />
    </div>
  )
}