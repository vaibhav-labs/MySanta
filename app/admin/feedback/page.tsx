import { requireAuth } from "@/lib/auth-helpers"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { FeedbackManager } from "@/components/feedback/FeedbackManager"

export default async function AdminFeedbackPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black mb-2">
              Feedback Management
            </h1>
            <p className="text-gray-600">
              View and manage feedback from users testing MySanta.
            </p>
          </div>

          <FeedbackManager />
        </div>
      </main>

      <Footer />
    </div>
  )
}