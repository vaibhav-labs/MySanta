import { requireAuth } from "@/lib/auth-helpers"
import { Navigation } from "@/components/Navigation"
import { CreateNewListForm } from "@/components/lists/CreateNewListForm"

export default async function NewListPage() {
  await requireAuth()

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-black mb-6">
            Create New List
          </h1>
          <CreateNewListForm />
        </div>
      </main>
    </div>
  )
}