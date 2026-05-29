import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-white text-ink overflow-hidden">

      {/* Top ticker */}
      <div className="bg-ink overflow-hidden py-2.5">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-medium text-white/50 tracking-wider whitespace-nowrap px-8">
              Birthdays &nbsp;·&nbsp; Weddings &nbsp;·&nbsp; Diwali &nbsp;·&nbsp; Baby Showers &nbsp;·&nbsp;
              Christmas &nbsp;·&nbsp; Graduation &nbsp;·&nbsp; Eid &nbsp;·&nbsp; Valentine's &nbsp;·&nbsp;
              Anniversaries &nbsp;·&nbsp; Holi &nbsp;·&nbsp; Just Because &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="border-b border-secondary bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <span style={{fontFamily:'Syne,sans-serif'}} className="text-xl font-bold text-ink tracking-tight">MySanta</span>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Sign in</Link>
            </div>
            <Link href="/sign-in">
              <button className="bg-brand text-white text-sm font-semibold px-5 py-2 hover:bg-brand-dark transition-colors rounded-sm">
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-secondary">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

            {/* Text */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 bg-brand-light border border-brand/20 rounded-full px-3 py-1 mb-8">
                <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                <span className="text-xs font-semibold text-brand">No more awkward gifts</span>
              </div>

              <h1 style={{fontFamily:'Syne,sans-serif', fontWeight:800, lineHeight:1.05}} className="text-[clamp(3rem,7vw,6.5rem)] text-ink mb-6">
                Your wishlist.<br />
                <span style={{color:'#FF5C3A'}}>Their move.</span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg font-light">
                Drop a list of things you actually want. Share one link.
                Let your people get you exactly that — no guessing, no duplicates, no weird surprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/sign-in">
                  <button className="bg-ink text-white font-semibold px-8 py-3.5 hover:bg-gray-800 transition-colors text-sm w-full sm:w-auto rounded-sm">
                    Create my wishlist →
                  </button>
                </Link>
                <Link href="/how-it-works">
                  <button className="border border-secondary text-ink font-medium px-8 py-3.5 hover:border-ink transition-colors text-sm w-full sm:w-auto rounded-sm">
                    See how it works
                  </button>
                </Link>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-8 border-t border-secondary pt-8">
                {[
                  { n: 'Free', label: 'forever for personal use' },
                  { n: '2 min', label: 'to set up your first list' },
                  { n: 'Any site', label: 'URL auto-fill works everywhere' },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-xl text-ink">{s.n}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="lg:col-span-2">
              <div className="bg-ink rounded-2xl overflow-hidden">
                {/* List header */}
                <div className="px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-brand" />
                    <p className="text-white/50 text-xs font-medium">Shared wishlist</p>
                  </div>
                  <p style={{fontFamily:'Syne,sans-serif'}} className="text-white font-bold text-lg">Priya's Birthday 🎂</p>
                </div>
                {/* Items */}
                <div className="divide-y divide-white/10">
                  {[
                    { name: 'AirPods Pro 2nd Gen', price: '₹24,900', platform: 'Apple', status: 'available' },
                    { name: 'Nike Air Jordan 1', price: '₹12,995', platform: 'Nike', status: 'held' },
                    { name: 'Kindle Paperwhite', price: '₹13,999', platform: 'Amazon', status: 'available' },
                    { name: 'PS5 DualSense', price: '₹5,990', platform: 'Amazon', status: 'purchased' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-white/40 text-xs mt-0.5">{item.price} · {item.platform}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        item.status === 'purchased' ? 'bg-brand text-white' :
                        item.status === 'held'      ? 'bg-white/15 text-white/60' :
                                                      'border border-white/20 text-white/50'
                      }`}>
                        {item.status === 'purchased' ? '✓ Bought' : item.status === 'held' ? 'Reserved' : 'Available'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-white/10">
                  <button className="w-full bg-brand text-white text-sm font-semibold py-2.5 rounded-sm hover:bg-brand-dark transition-colors">
                    Hold a gift →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coral strip */}
      <div className="bg-brand overflow-hidden py-3">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-semibold text-white/80 tracking-[0.15em] whitespace-nowrap px-8">
              URL auto-fill &nbsp;✦&nbsp; No duplicate gifts &nbsp;✦&nbsp;
              Public sharing without sign-up &nbsp;✦&nbsp; Surprise-proof &nbsp;✦&nbsp;
              Works for every occasion &nbsp;✦&nbsp; Free forever &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Features — bento grid */}
      <section className="border-b border-secondary bg-surface">
        <div className="container py-20">
          <div className="mb-12">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Features</p>
            <h2 style={{fontFamily:'Syne,sans-serif', fontWeight:800}} className="text-4xl md:text-5xl text-ink">
              Everything hits different<br />with MySanta.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big feature */}
            <div className="md:col-span-2 bg-ink rounded-2xl p-8 min-h-[240px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5 text-white" style={{fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'120px', lineHeight:1}}>
                URL
              </div>
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center mb-6">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="text-white font-bold text-2xl mb-2">Paste a URL, done.</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                  Amazon, Flipkart, Myntra, Nike, anywhere — paste the product URL and we pull the name, price, and image automatically.
                </p>
              </div>
            </div>

            <div className="bg-brand rounded-2xl p-8 min-h-[240px] flex flex-col justify-between">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="text-white font-bold text-2xl mb-2">No duplicates, ever.</h3>
                <p className="text-white/80 text-sm leading-relaxed">Friends hold items before buying. Everyone else sees it's taken.</p>
              </div>
            </div>

            <div className="bg-white border border-secondary rounded-2xl p-8 min-h-[200px] flex flex-col justify-between shadow-card">
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="text-ink font-bold text-xl mb-2">Surprises stay surprises.</h3>
                <p className="text-gray-400 text-sm">You see who bought — not what. Spoilers blocked by design.</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white border border-secondary rounded-2xl p-8 min-h-[200px] flex flex-col justify-between shadow-card">
              <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ink">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="text-ink font-bold text-xl mb-2">Share without sign-up friction.</h3>
                <p className="text-gray-400 text-sm mb-4">Friends view your list with just a link — no account needed to browse. They only sign up if they want to hold or buy something.</p>
                <div className="flex flex-wrap gap-2">
                  {['WhatsApp', 'Instagram DM', 'Email', 'Any link'].map(m => (
                    <span key={m} className="text-xs bg-surface border border-secondary px-3 py-1 text-gray-500 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-secondary">
        <div className="container py-20">
          <div className="mb-12">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Three steps</p>
            <h2 style={{fontFamily:'Syne,sans-serif', fontWeight:800}} className="text-4xl md:text-5xl text-ink">Zero stress gifting.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Build your list', body: 'Add items from any website. Auto-fill with a URL paste. Set quantities, variants, prices.' },
              { n: '2', title: 'Share the link', body: 'One URL. Send it anywhere — WhatsApp, Instagram, email. No app needed for your friends.' },
              { n: '3', title: 'Get the gifts', body: 'Friends hold items to avoid duplicates, buy from the store, mark as purchased. You get notified.' },
            ].map((s, i) => (
              <div key={s.n} className="group">
                <div className="w-10 h-10 bg-brand-light border border-brand/20 rounded-xl flex items-center justify-center mb-5">
                  <span style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-brand">{s.n}</span>
                </div>
                <h3 style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-xl text-ink mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/how-it-works">
              <button className="border border-secondary text-ink text-sm font-medium px-6 py-2.5 hover:border-ink transition-colors rounded-sm">
                See the full walkthrough →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="container py-20">
          <h2 style={{fontFamily:'Syne,sans-serif', fontWeight:800, lineHeight:1.1}} className="text-[clamp(2.5rem,6vw,5.5rem)] text-white mb-8">
            Filtered gifting<br />
            is boring.<br />
            <span style={{color:'#FF5C3A'}}>Start yours.</span>
          </h2>
          <Link href="/sign-in">
            <button className="bg-brand text-white font-semibold px-10 py-4 text-sm hover:bg-brand-dark transition-colors rounded-sm">
              Create my wishlist — it's free →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary bg-white">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span style={{fontFamily:'Syne,sans-serif'}} className="font-bold text-xl text-ink">MySanta</span>
              <p className="text-gray-400 text-xs mt-1">Your wishlist. Their move.</p>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
              <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
              <Link href="/feedback" className="hover:text-ink transition-colors">Feedback</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Sign in</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-secondary">
            <p className="text-xs text-gray-300">© {new Date().getFullYear()} MySanta · mysanta.fun</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
