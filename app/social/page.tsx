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
            <h1 className="font-display text-ink mb-2" style={{fontSize:'clamp(2.5rem,5vw,4rem)', lineHeight:'0.95'}}>
              The <span className="bg-brand px-1">Feed.</span>
            </h1>
            <p className="text-gray-500">
              What your friends have been up to — new lists, upcoming events.
            </p>
          </div>

          <SocialFeed />
        </div>
      </main>

      <Footer />
    </div>
  )
}