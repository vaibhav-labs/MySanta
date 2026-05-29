import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-white text-ink overflow-hidden">

      {/* ── Top ticker ── */}
      <div style={{background:'#7C3AED'}} className="overflow-hidden py-2.5">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-semibold tracking-wider whitespace-nowrap px-8" style={{color:'rgba(255,255,255,0.7)'}}>
              Birthdays &nbsp;·&nbsp; Weddings &nbsp;·&nbsp; Diwali &nbsp;·&nbsp; Baby Showers &nbsp;·&nbsp;
              Christmas &nbsp;·&nbsp; Graduation &nbsp;·&nbsp; Eid &nbsp;·&nbsp; Valentine's &nbsp;·&nbsp;
              Anniversaries &nbsp;·&nbsp; Holi &nbsp;·&nbsp; Just Because &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="border-b border-secondary bg-white sticky top-0 z-50">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <span className="font-display text-xl font-bold text-ink">MySanta</span>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{color:'#6B7280'}}>
              <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Sign in</Link>
            </div>
            <Link href="/sign-in">
              <button style={{background:'#7C3AED', color:'white'}} className="text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="border-b border-secondary">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8" style={{background:'#EDE9FE', border:'1px solid #DDD6FE'}}>
                <span className="w-2 h-2 rounded-full" style={{background:'#7C3AED'}} />
                <span className="text-xs font-semibold" style={{color:'#7C3AED'}}>Free wishlist platform</span>
              </div>

              <h1 className="font-display font-extrabold leading-none mb-6" style={{fontSize:'clamp(3rem,7vw,6rem)', letterSpacing:'-0.02em'}}>
                Your wishlist.{" "}
                <span className="gradient-text">Their move.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{color:'#6B7280', fontWeight:300}}>
                Drop a list of things you actually want. Share one link.
                Let your people get you exactly that — no guessing, no duplicates, no weird surprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/sign-in">
                  <button style={{background:'#7C3AED', color:'white'}} className="font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity text-sm w-full sm:w-auto shadow-glow">
                    Create my wishlist →
                  </button>
                </Link>
                <Link href="/how-it-works">
                  <button className="border border-secondary text-ink font-medium px-8 py-3.5 rounded-lg hover:border-ink transition-colors text-sm w-full sm:w-auto">
                    See how it works
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-8 border-t border-secondary pt-8">
                {[
                  { n: 'Free', label: 'forever' },
                  { n: '2 min', label: 'to set up' },
                  { n: 'Any site', label: 'URL auto-fill' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-display font-bold text-xl text-ink">{s.n}</p>
                    <p className="text-xs mt-0.5" style={{color:'#9CA3AF'}}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — preview card (NO opacity tricks, solid colours only) */}
            <div className="rounded-2xl overflow-hidden border border-secondary shadow-card-hover">
              {/* Header */}
              <div style={{background:'#7C3AED'}} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{background:'#FFD600'}} />
                  <p style={{color:'rgba(255,255,255,0.7)', fontSize:'11px', fontWeight:600}}>Shared wishlist</p>
                </div>
                <p className="font-display font-bold text-xl text-white">Priya's Birthday 🎂</p>
              </div>
              {/* Items */}
              <div className="bg-white divide-y divide-gray-100">
                {[
                  { name: 'AirPods Pro 2nd Gen', price: '₹24,900', platform: 'Apple', status: 'available', color: '#7C3AED' },
                  { name: 'Nike Air Jordan 1', price: '₹12,995', platform: 'Nike', status: 'held', color: '#EC4899' },
                  { name: 'Kindle Paperwhite', price: '₹13,999', platform: 'Amazon', status: 'available', color: '#7C3AED' },
                  { name: 'PS5 DualSense', price: '₹5,990', platform: 'Amazon', status: 'purchased', color: '#22C55E' },
                ].map(item => (
                  <div key={item.name} className="flex items-center justify-between px-5 py-3.5 bg-white">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.price} · {item.platform}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                      background: item.status === 'purchased' ? '#DCFCE7' :
                                  item.status === 'held' ? '#FCE7F3' : '#EDE9FE',
                      color: item.status === 'purchased' ? '#16A34A' :
                             item.status === 'held' ? '#EC4899' : '#7C3AED',
                    }}>
                      {item.status === 'purchased' ? '✓ Bought' : item.status === 'held' ? 'Reserved' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
              {/* CTA inside card */}
              <div style={{background:'#F8F7FF'}} className="px-5 py-4 border-t border-gray-100">
                <button className="w-full font-semibold py-2.5 rounded-lg text-sm text-white" style={{background:'#7C3AED'}}>
                  Hold a gift →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multi-colour strip ── */}
      <div className="overflow-hidden py-3" style={{background:'linear-gradient(90deg,#7C3AED,#EC4899,#FF5C3A,#FFD600,#06B6D4,#7C3AED)'}}>
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-bold tracking-widest whitespace-nowrap px-8 text-white" style={{textShadow:'0 1px 3px rgba(0,0,0,0.2)'}}>
              URL auto-fill &nbsp;✦&nbsp; No duplicates &nbsp;✦&nbsp;
              Public sharing &nbsp;✦&nbsp; Chip in together &nbsp;✦&nbsp;
              Surprise-proof &nbsp;✦&nbsp; Free forever &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="border-b border-secondary" style={{background:'#F8F7FF'}}>
        <div className="container py-20">
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#7C3AED'}}>Features</p>
            <h2 className="font-display font-extrabold text-ink" style={{fontSize:'clamp(2.5rem,5vw,4.5rem)', letterSpacing:'-0.02em'}}>
              Everything hits different.<br />
              <span className="gradient-text">No awkward gifts. Ever.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big: URL autofill */}
            <div className="md:col-span-2 rounded-2xl p-8 text-white" style={{background:'linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{background:'rgba(255,255,255,0.2)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Paste a URL, done.</h3>
              <p style={{color:'rgba(255,255,255,0.75)'}} className="text-sm leading-relaxed max-w-xs">
                Amazon, Flipkart, Myntra, Nike, or anywhere — auto-fills name, price, and image from any product link.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Amazon', 'Flipkart', 'Myntra', 'Nike', '+ any site'].map(s => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{background:'rgba(255,255,255,0.2)', color:'white'}}>{s}</span>
                ))}
              </div>
            </div>

            {/* No duplicates */}
            <div className="rounded-2xl p-7 text-white" style={{background:'#FFD600'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{background:'rgba(0,0,0,0.1)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-2">No duplicates, ever.</h3>
              <p className="text-sm leading-relaxed" style={{color:'rgba(0,0,0,0.6)'}}>Friends hold items before buying. Everyone else sees it's taken.</p>
            </div>

            {/* Chip in */}
            <div className="rounded-2xl p-7 bg-white border border-secondary shadow-card">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{background:'#EDE9FE'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-2">Chip in together.</h3>
              <p className="text-sm leading-relaxed text-gray-400">Split expensive gifts across multiple friends. Join collaborations to share the cost.</p>
            </div>

            {/* Surprises */}
            <div className="rounded-2xl p-7 text-white" style={{background:'#EC4899'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{background:'rgba(255,255,255,0.2)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Surprises stay surprises.</h3>
              <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.75)'}}>You get notified when gifts are purchased — not who bought what. Mystery preserved.</p>
            </div>

            {/* Save to my list */}
            <div className="rounded-2xl p-7 bg-white border border-secondary shadow-card">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{background:'#CFFAFE'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-2">Save to your own list.</h3>
              <p className="text-sm leading-relaxed text-gray-400">Love something on a friend's list? One click copies it to your own wishlist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="border-b border-secondary bg-ink text-white">
        <div className="container py-20">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#7C3AED'}}>Works for everything</p>
            <h2 className="font-display font-extrabold" style={{fontSize:'clamp(2.5rem,5vw,4.5rem)', letterSpacing:'-0.02em'}}>
              Every occasion,<br />
              <span style={{color:'#FFD600'}}>perfectly covered.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Birthday', color: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
              { label: 'Wedding', color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
              { label: 'Diwali', color: '#FFD600', bg: 'rgba(255,214,0,0.15)' },
              { label: 'Baby Shower', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
              { label: 'Graduation', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
              { label: 'Christmas', color: '#FF5C3A', bg: 'rgba(255,92,58,0.15)' },
              { label: "Valentine's", color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
              { label: 'Just Because', color: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
            ].map(o => (
              <div key={o.label} className="rounded-xl px-4 py-5 flex items-center justify-between" style={{background:o.bg, border:`1px solid ${o.color}30`}}>
                <span className="font-display font-bold text-white" style={{fontSize:'15px'}}>{o.label}</span>
                <div className="w-2.5 h-2.5 rounded-full" style={{background:o.color}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background:'linear-gradient(135deg,#7C3AED 0%,#EC4899 60%,#FF5C3A 100%)'}}>
        <div className="container py-20">
          <h2 className="font-display font-extrabold text-white mb-3" style={{fontSize:'clamp(2.5rem,6vw,5.5rem)', letterSpacing:'-0.02em', lineHeight:1.05}}>
            Filtered gifting<br />is boring.<br />
            <span style={{color:'#FFD600'}}>Start yours.</span>
          </h2>
          <p className="text-lg mb-10" style={{color:'rgba(255,255,255,0.75)', fontWeight:300}}>
            Free forever. Set up in 2 minutes. No credit card.
          </p>
          <Link href="/sign-in">
            <button className="bg-white text-ink font-bold px-10 py-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Create my wishlist — it's free →
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-secondary bg-white">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-display font-bold text-xl text-ink">MySanta</span>
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
