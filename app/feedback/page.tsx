import { Footer } from "@/components/Footer"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-secondary bg-white sticky top-0 z-40">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <span className="font-display text-2xl text-ink" style={{letterSpacing:'0.01em'}}>MySanta</span>
            <div className="text-xs font-bold uppercase tracking-widest" style={{color:'#9CA3AF'}}>
              Beta feedback
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="font-display text-ink mb-4" style={{fontSize:'clamp(2.5rem,6vw,5rem)', lineHeight:'0.95'}}>
              Tell us what's <span className="bg-brand px-1">broken.</span>
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Or what's working, or what you wish existed. Any of it helps. We read every single one.
            </p>
          </div>

          <div className="bg-ink text-white p-6 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(255,255,255,0.4)'}}>What MySanta does</p>
            <ul className="text-sm space-y-1.5" style={{color:'rgba(255,255,255,0.7)'}}>
              <li>· Wishlists for any occasion</li>
              <li>· Shareable links your friends can open without an account</li>
              <li>· No two people end up buying the same thing</li>
              <li>· Auto-fill from any product URL</li>
              <li>· Event reminders</li>
              <li>· See what friends are wishing for</li>
            </ul>
          </div>

          <FeedbackForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}