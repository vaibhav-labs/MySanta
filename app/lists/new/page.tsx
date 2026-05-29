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
          <h1 className="font-display text-ink mb-6" style={{fontSize:'clamp(2rem,4vw,3rem)', lineHeight:'0.95'}}>
            New <span className="bg-brand px-1">List.</span>
          </h1>
          <CreateNewListForm />
        </div>
      </main>
    </div>
  )
}