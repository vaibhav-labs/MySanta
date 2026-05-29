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
      <div className="bg-ink overflow-hidden py-2.5">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-semibold tracking-widest whitespace-nowrap px-8" style={{color:'rgba(255,255,255,0.5)'}}>
              Birthdays &nbsp;·&nbsp; Weddings &nbsp;·&nbsp; Diwali &nbsp;·&nbsp; Baby Showers &nbsp;·&nbsp;
              Christmas &nbsp;·&nbsp; Graduation &nbsp;·&nbsp; Eid &nbsp;·&nbsp; Valentine's &nbsp;·&nbsp;
              Holi &nbsp;·&nbsp; Anniversaries &nbsp;·&nbsp; Just Because &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="border-b border-secondary bg-white sticky top-0 z-50">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <span className="font-display text-2xl text-ink" style={{letterSpacing:'0.01em'}}>MySanta</span>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{color:'#6B7280'}}>
              <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Sign in</Link>
            </div>
            <Link href="/sign-in">
              <button className="bg-brand text-ink text-sm font-bold px-5 py-2.5 hover:bg-brand-dark transition-colors">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="border-b border-secondary">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

            {/* Left — text */}
            <div className="lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{color:'#9CA3AF'}}>The wishlist platform</p>

              <h1 className="font-display mb-6" style={{fontSize:'clamp(4rem,9vw,8.5rem)', lineHeight:'0.95', letterSpacing:'-0.01em'}}>
                Your<br />
                Wish<span className="bg-brand px-1">list.</span><br />
                Their<br />
                <span style={{color:'#E63946'}}>Move.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{color:'#6B7280', fontWeight:300}}>
                Drop a list of things you actually want. Share one link.
                Let your people get you exactly that — no guessing, no duplicates, no awkward gifts.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link href="/sign-in">
                  <button className="bg-ink text-white font-bold px-8 py-4 hover:bg-gray-800 transition-colors text-sm w-full sm:w-auto">
                    Create my wishlist →
                  </button>
                </Link>
                <Link href="/how-it-works">
                  <button className="border border-secondary text-ink font-medium px-8 py-4 hover:border-ink transition-colors text-sm w-full sm:w-auto">
                    See how it works
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-8 border-t border-secondary pt-8">
                {[
                  { n: 'Free', label: 'forever for personal use' },
                  { n: '2 min', label: 'to set up your first list' },
                  { n: 'Any site', label: 'URL auto-fill' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-display text-2xl text-ink">{s.n}</p>
                    <p className="text-xs mt-0.5" style={{color:'#9CA3AF'}}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — preview card, fully solid colours */}
            <div className="lg:col-span-2">
              <div className="border border-secondary overflow-hidden shadow-card-hover">
                {/* Card header */}
                <div className="bg-ink px-5 py-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-brand" />
                    <p className="text-xs font-semibold" style={{color:'rgba(255,255,255,0.5)'}}>Shared wishlist</p>
                  </div>
                  <p className="font-display text-2xl text-white">Priya's Birthday 🎂</p>
                </div>
                {/* Items */}
                <div className="bg-white divide-y" style={{borderColor:'#F3F4F6'}}>
                  {[
                    { name: 'AirPods Pro 2nd Gen', price: '₹24,900', status: 'available' },
                    { name: 'Nike Air Jordan 1', price: '₹12,995', status: 'held' },
                    { name: 'Kindle Paperwhite', price: '₹13,999', status: 'available' },
                    { name: 'PS5 DualSense', price: '₹5,990', status: 'purchased' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.price}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1" style={{
                        background: item.status === 'purchased' ? '#FFD600' :
                                    item.status === 'held' ? '#FEE2E4' : '#F5F5F5',
                        color: item.status === 'purchased' ? '#0D0D0D' :
                               item.status === 'held' ? '#E63946' : '#9CA3AF',
                      }}>
                        {item.status === 'purchased' ? '✓ Bought' : item.status === 'held' ? 'Reserved' : 'Available'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t" style={{borderColor:'#F3F4F6', background:'#F9F9F9'}}>
                  <button className="w-full bg-ink text-white font-bold py-3 text-sm hover:bg-gray-800 transition-colors">
                    Hold a gift →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Yellow strip ── */}
      <div className="bg-brand overflow-hidden py-3 border-b border-ink/10">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-bold tracking-widest whitespace-nowrap px-8 text-ink uppercase">
              URL auto-fill &nbsp;✦&nbsp; No duplicate gifts &nbsp;✦&nbsp;
              Share without sign-up &nbsp;✦&nbsp; Chip in together &nbsp;✦&nbsp;
              Surprise-proof &nbsp;✦&nbsp; Free forever &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="border-b border-secondary" style={{background:'#F9F9F9'}}>
        <div className="container py-20">
          <div className="mb-14">
            <h2 className="font-display text-ink" style={{fontSize:'clamp(2.5rem,5vw,5rem)', lineHeight:'0.95', letterSpacing:'-0.01em'}}>
              Everything hits<br />
              different <span style={{color:'#E63946'}}>with MySanta.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big card: auto-fill */}
            <div className="md:col-span-2 bg-ink text-white p-8 min-h-52">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{color:'rgba(255,255,255,0.4)'}}>Auto-fill</span>
              </div>
              <h3 className="font-display text-3xl text-white mb-2">Paste a URL, done.</h3>
              <p className="text-sm leading-relaxed max-w-xs" style={{color:'rgba(255,255,255,0.55)'}}>
                Amazon, Flipkart, Myntra, Nike — paste the product link and we pull the name, price, and image automatically.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Amazon', 'Flipkart', 'Myntra', 'Nike', '+ any site'].map(s => (
                  <span key={s} className="text-xs px-3 py-1 font-semibold border" style={{borderColor:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)'}}>{s}</span>
                ))}
              </div>
            </div>

            {/* No duplicates */}
            <div className="bg-brand p-7 min-h-52 flex flex-col justify-between">
              <div className="w-8 h-8 bg-ink flex items-center justify-center mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink mb-1.5">No duplicates. Ever.</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(0,0,0,0.6)'}}>Friends hold items before buying. Everyone else sees it's taken.</p>
              </div>
            </div>

            {/* Chip in */}
            <div className="bg-white border border-secondary p-7 min-h-44 flex flex-col justify-between shadow-card">
              <div className="w-8 h-8 flex items-center justify-center mb-4" style={{background:'#FEE2E4'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E63946" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink mb-1.5">Chip in together.</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Split expensive gifts. Multiple friends can join one item.</p>
              </div>
            </div>

            {/* Surprises */}
            <div className="p-7 min-h-44 flex flex-col justify-between" style={{background:'#E63946'}}>
              <div className="w-8 h-8 bg-white/20 flex items-center justify-center mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-white mb-1.5">Surprises stay surprises.</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.75)'}}>You get notified when gifts are bought — not who or what. Mystery preserved.</p>
              </div>
            </div>

            {/* Save to list */}
            <div className="bg-white border border-secondary p-7 min-h-44 flex flex-col justify-between shadow-card">
              <div className="w-8 h-8 flex items-center justify-center mb-4" style={{background:'#FFF8CC'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl text-ink mb-1.5">Save to your list.</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Love something on a friend's list? Copy it to yours in one click.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b border-secondary">
        <div className="container">
          <div className="py-8 border-b border-secondary">
            <h2 className="font-display text-ink" style={{fontSize:'clamp(2.5rem,5vw,5rem)', lineHeight:'0.95'}}>
              Three steps. <span className="bg-brand px-1">Zero stress.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { n: '01', title: 'Build your list', body: 'Add items from any website via URL auto-fill. Set quantities, variants, prices.' },
              { n: '02', title: 'Share the link', body: 'One URL. Send it on WhatsApp, Instagram, email. No app needed for friends.' },
              { n: '03', title: 'Get the gifts', body: 'Friends hold items to avoid duplicates, buy, mark purchased. You get notified.' },
            ].map((s, i) => (
              <div key={s.n} className={`py-10 px-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-secondary' : ''}`}>
                <p className="font-display text-7xl text-brand leading-none mb-4">{s.n}</p>
                <h3 className="font-display text-3xl text-ink mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="border-b border-secondary bg-ink">
        <div className="container">
          <div className="py-8 border-b border-white/10">
            <h2 className="font-display text-white" style={{fontSize:'clamp(2.5rem,5vw,5rem)', lineHeight:'0.95'}}>
              Works for <span className="bg-brand text-ink px-1">every vibe.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Birthday' }, { label: 'Wedding' },
              { label: 'Diwali' },   { label: 'Baby Shower' },
              { label: 'Graduation' }, { label: 'Christmas' },
              { label: "Valentine's" }, { label: 'Just Because' },
            ].map((o, i) => (
              <div key={o.label} className={`py-7 px-6 border-white/10 ${i % 4 !== 3 ? 'border-r' : ''} ${i < 4 ? 'border-b' : ''}`}>
                <p className="font-display text-xl text-white">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-b border-secondary">
        <div className="container py-20">
          <div className="max-w-3xl">
            <h2 className="font-display text-ink mb-10" style={{fontSize:'clamp(3rem,7vw,7rem)', lineHeight:'0.9', letterSpacing:'-0.01em'}}>
              Filtered gifting<br />
              is boring.<br />
              <span className="bg-brand px-2">Start yours.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-in">
                <button className="bg-ink text-white font-bold px-10 py-4 text-sm hover:bg-gray-800 transition-colors">
                  Create my wishlist — it's free →
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="border border-secondary text-ink font-medium px-8 py-4 text-sm hover:border-ink transition-colors">
                  How it works
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-display text-2xl text-ink">MySanta</span>
              <p className="text-gray-400 text-xs mt-1">Your wishlist. Their move.</p>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
              <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
              <Link href="/feedback" className="hover:text-ink transition-colors">Feedback</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Sign in</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-secondary flex items-center justify-between">
            <p className="text-xs text-gray-300">© {new Date().getFullYear()} MySanta · mysanta.fun</p>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-brand" />
              <div className="w-4 h-4 bg-ink" />
              <div className="w-4 h-4" style={{background:'#E63946'}} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
