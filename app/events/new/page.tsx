import { requireAuth } from "@/lib/auth-helpers"
import { Navigation } from "@/components/Navigation"
import { CreateEventForm } from "@/components/events/CreateEventForm"

export default async function NewEventPage() {
  await requireAuth()

  return (
    <div className="min-h-screen bg-surface">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-lg mx-auto">
          <CreateEventForm />
        </div>
      </main>
    </div>
  )
}