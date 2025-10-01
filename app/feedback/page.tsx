import { Footer } from "@/components/Footer"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-secondary bg-white">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <div className="text-xl font-semibold text-black flex items-center space-x-2">
              <span>🎁 MySanta</span>
            </div>
            <div className="text-sm text-gray-600">
              Beta Feedback
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-4">
              Help Us Improve MySanta
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              We're building the ultimate gift list manager and we'd love your feedback!
            </p>
            <p className="text-gray-500">
              Share your thoughts, report bugs, or suggest new features.
            </p>
          </div>

          <div className="bg-gray-50 border border-secondary rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-black mb-3">About MySanta</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Create and manage gift lists for any occasion</li>
              <li>• Share lists with friends and family</li>
              <li>• Hold gifts to avoid duplicates</li>
              <li>• Import products from any website</li>
              <li>• Track events and get reminders</li>
              <li>• Build your gift-giving network</li>
            </ul>
          </div>

          <FeedbackForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}