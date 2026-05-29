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
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{color:'#9CA3AF'}}>Wishlists, done properly</p>

              <h1 className="font-display mb-6" style={{fontSize:'clamp(4rem,9vw,8.5rem)', lineHeight:'0.95', letterSpacing:'-0.01em'}}>
                Your<br />
                Wish<span className="bg-brand px-1">list.</span><br />
                Their<br />
                <span style={{color:'#E63946'}}>Move.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{color:'#6B7280', fontWeight:300}}>
                Write down what you actually want. Send one link to your people.
                They pick something off it. No more guessing, no two people buying the same thing, no socks you'll never wear.
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
              Built for the way<br />
              <span style={{color:'#E63946'}}>you actually gift.</span>
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
                Amazon, Flipkart, Myntra, Nike — paste the product link and we pull the name, price, and photo for you.
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
                <h3 className="font-display text-2xl text-ink mb-1.5">No two of the same thing.</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(0,0,0,0.6)'}}>Friends mark what they're buying. Everyone else sees it's taken.</p>
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
                <h3 className="font-display text-2xl text-ink mb-1.5">Split the bigger ones.</h3>
                <p className="text-sm text-gray-400 leading-relaxed">A few friends can pitch in on the same gift instead of one person footing it.</p>
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
                <h3 className="font-display text-2xl text-white mb-1.5">You won't know what you're getting.</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.75)'}}>We tell you a gift was bought — never which one, never by whom. The surprise still works.</p>
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
                <h3 className="font-display text-2xl text-ink mb-1.5">Save it for later.</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Spot something on a friend's list you'd want too? Add it to yours in one click.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending picks ── */}
      <section className="border-b border-secondary">
        <div className="container py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#9CA3AF'}}>Most-added on MySanta</p>
              <h2 className="font-display text-ink" style={{fontSize:'clamp(2.5rem,5vw,5rem)', lineHeight:'0.95', letterSpacing:'-0.01em'}}>
                What people<br />
                <span style={{color:'#E63946'}}>actually ask for.</span>
              </h2>
            </div>
            <p className="text-sm max-w-sm" style={{color:'#6B7280'}}>
              A glance at the picks landing on lists right now — books worth reading, gear worth using, things worth waking up to.
            </p>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              { label: 'All', active: true },
              { label: 'Books' },
              { label: 'Gym' },
              { label: 'Coffee' },
              { label: 'Home' },
            ].map(c => (
              <span
                key={c.label}
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 border"
                style={c.active
                  ? { background: '#0D0D0D', color: '#FFD600', borderColor: '#0D0D0D' }
                  : { background: '#FFFFFF', color: '#6B7280', borderColor: '#E8E8E8' }
                }
              >
                {c.label}
              </span>
            ))}
          </div>

          {/* Grid of curated picks */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              // Books
              { emoji: '📚', name: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', price: '₹449', tag: 'Books', adds: 312, bg: '#FFF8CC' },
              { emoji: '📖', name: 'Atomic Habits', author: 'James Clear', price: '₹399', tag: 'Books', adds: 894, bg: '#F5F5F5' },
              { emoji: '📕', name: 'The Psychology of Money', author: 'Morgan Housel', price: '₹299', tag: 'Books', adds: 521, bg: '#FEE2E4' },

              // Gym
              { emoji: '🏋️', name: 'Adjustable Dumbbell Set (24kg)', author: 'PowerMax · Amazon', price: '₹8,499', tag: 'Gym', adds: 187, bg: '#0D0D0D', dark: true },
              { emoji: '🧘', name: 'Cork Yoga Mat — 6mm', author: 'Boldfit · Flipkart', price: '₹1,799', tag: 'Gym', adds: 244, bg: '#FFF8CC' },
              { emoji: '⚡', name: 'Whoop 4.0 Strap', author: 'Whoop · whoop.com', price: '₹26,990', tag: 'Gym', adds: 96, bg: '#F5F5F5' },

              // Coffee
              { emoji: '☕', name: 'Hario V60 Pour-Over Kit', author: 'Hario · Subko', price: '₹3,200', tag: 'Coffee', adds: 412, bg: '#FEE2E4' },
              { emoji: '⚗️', name: 'AeroPress Original', author: 'AeroPress · Blue Tokai', price: '₹3,490', tag: 'Coffee', adds: 358, bg: '#FFD600' },
              { emoji: '⏱️', name: 'Timemore Chestnut C2 Grinder', author: 'Timemore · Amazon', price: '₹6,850', tag: 'Coffee', adds: 201, bg: '#F5F5F5' },

              // Home decor
              { emoji: '🕯️', name: 'Soy Wax Candle — Oud & Amber', author: 'Bath & Body Works', price: '₹1,499', tag: 'Home', adds: 276, bg: '#FFF8CC' },
              { emoji: '🪴', name: 'Marble Planter — Small', author: 'Nestasia', price: '₹999', tag: 'Home', adds: 163, bg: '#FEE2E4' },
              { emoji: '🖼️', name: 'Framed Art Print — Bauhaus Series', author: 'The Print Press', price: '₹1,850', tag: 'Home', adds: 119, bg: '#0D0D0D', dark: true },
            ].map(p => (
              <div
                key={p.name}
                className="border border-secondary flex flex-col"
                style={{background:'#FFFFFF'}}
              >
                <div
                  className="h-32 flex items-center justify-center text-5xl"
                  style={{ background: p.bg }}
                >
                  <span style={ p.dark ? { filter: 'grayscale(0.1)' } : undefined }>{p.emoji}</span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{color:'#9CA3AF'}}>{p.tag}</span>
                    <span className="text-[10px] font-bold" style={{color:'#E63946'}}>+{p.adds} adds</span>
                  </div>
                  <p className="text-sm font-semibold text-ink leading-snug mb-1">{p.name}</p>
                  <p className="text-xs mb-3" style={{color:'#9CA3AF'}}>{p.author}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="font-display text-lg text-ink leading-none">{p.price}</p>
                    <Link href="/sign-in" className="text-[10px] font-bold uppercase tracking-widest text-ink border-b border-ink hover:text-brand-red transition-colors">
                      Add to list →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-xs" style={{color:'#9CA3AF'}}>
            <div className="w-1.5 h-1.5 bg-brand" />
            <p className="font-semibold uppercase tracking-widest">Updated weekly based on what's landing on lists</p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b border-secondary">
        <div className="container">
          <div className="py-8 border-b border-secondary">
            <h2 className="font-display text-ink" style={{fontSize:'clamp(2.5rem,5vw,5rem)', lineHeight:'0.95'}}>
              Three steps. <span className="bg-brand px-1">That's it.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { n: '01', title: 'Make your list', body: 'Paste in product links from any site. Add sizes, colours, quantity, however much detail you want.' },
              { n: '02', title: 'Send the link', body: 'One URL goes on WhatsApp, Insta, or email. Your friends don\'t need to download anything.' },
              { n: '03', title: 'Get the gifts', body: 'They pick, buy, and tick it off. You find out something\'s on its way — not what.' },
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
              For pretty much <span className="bg-brand text-ink px-1">any occasion.</span>
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
              Stop guessing.<br />
              Start a list.<br />
              <span className="bg-brand px-2">It takes two minutes.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-in">
                <button className="bg-ink text-white font-bold px-10 py-4 text-sm hover:bg-gray-800 transition-colors">
                  Make my wishlist — it's free →
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
