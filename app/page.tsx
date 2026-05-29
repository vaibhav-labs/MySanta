import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-[#0F0B1A] text-white overflow-hidden">

      {/* Nav */}
      <nav className="relative z-50 border-b border-white/10">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-card flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
                  <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
                  <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">MySanta</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/sign-in" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/sign-in">
                <button className="text-sm font-semibold px-5 py-2 rounded-xl bg-brand text-white hover:bg-brand-dark transition-all hover:shadow-glow">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-brand/20 blur-[120px]" />
          <div className="absolute top-[100px] right-[-50px] w-[400px] h-[400px] rounded-full bg-brand-pink/20 blur-[100px]" />
          <div className="absolute bottom-0 left-[30%] w-[350px] h-[350px] rounded-full bg-brand-cyan/15 blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-1.5 mb-7">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                <span className="text-xs font-medium text-white/80">Gift giving, but make it iconic</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Your Wishlist.{" "}
                <span className="gradient-text">Their Move.</span>
              </h1>

              <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-md">
                Drop your wishlist. Share the link. Let your people get you exactly what you want — no hints, no awkward gifts.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sign-in">
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-card text-white font-semibold text-sm hover:opacity-90 transition-all hover:shadow-glow">
                    Create my wishlist
                  </button>
                </Link>
                <Link href="/sign-in">
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass text-white/80 font-semibold text-sm hover:bg-white/10 transition-all">
                    See how it works
                  </button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center space-x-4 mt-10">
                <div className="flex -space-x-2">
                  {['#8B5CF6','#EC4899','#22D3EE','#10B981'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F0B1A]" style={{background:c}} />
                  ))}
                </div>
                <p className="text-sm text-white/50">
                  <span className="text-white font-semibold">2,000+</span> wishlists shared this month
                </p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="relative h-[480px] hidden lg:block">
              {/* Main card */}
              <div className="absolute top-8 left-8 right-8 glass rounded-3xl p-5 shadow-glass">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Birthday Wishlist</p>
                    <p className="font-bold">Alex's 22nd 🎂</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-semibold">3 items</div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: 'AirPods Pro 2', price: '₹24,900', status: 'wished', color: '#8B5CF6' },
                    { name: 'Nike Air Jordan 1', price: '₹12,995', status: 'held', color: '#EC4899' },
                    { name: 'PS5 Controller', price: '₹5,990', status: 'purchased', color: '#10B981' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg" style={{background: `${item.color}30`}}>
                          <div className="w-full h-full rounded-lg" style={{background: `${item.color}20`}} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-white/40">{item.price}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${item.color}20`,
                          color: item.color
                        }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="absolute bottom-24 right-4 glass rounded-2xl px-4 py-3 shadow-glass">
                <p className="text-xs text-white/50 mb-0.5">just now</p>
                <p className="text-sm font-semibold">Priya held an item 💜</p>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute bottom-4 left-4 glass rounded-2xl px-4 py-3 shadow-glass">
                <p className="text-xs text-white/50 mb-0.5">2 min ago</p>
                <p className="text-sm font-semibold">Gift purchased! 🎁</p>
              </div>

              {/* Decorative rings */}
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full border border-brand/20" />
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-brand/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="border-y border-white/10 py-4 bg-white/5 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{animation: 'none'}}>
          <p className="text-white/30 text-sm font-medium px-6 tracking-widest uppercase">
            Birthdays &nbsp;·&nbsp; Weddings &nbsp;·&nbsp; Anniversaries &nbsp;·&nbsp; Baby Showers &nbsp;·&nbsp; Graduation &nbsp;·&nbsp; Christmas &nbsp;·&nbsp; Diwali &nbsp;·&nbsp; Valentine's &nbsp;·&nbsp; Holi &nbsp;·&nbsp; Eid &nbsp;·&nbsp; Birthdays &nbsp;·&nbsp; Weddings &nbsp;·&nbsp; Anniversaries &nbsp;·&nbsp; Baby Showers &nbsp;·&nbsp; Graduation &nbsp;·&nbsp; Christmas &nbsp;·&nbsp; Diwali &nbsp;·&nbsp; Valentine's &nbsp;·&nbsp; Holi &nbsp;·&nbsp; Eid
          </p>
        </div>
      </div>

      {/* Bento features */}
      <section className="py-24 bg-surface">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-primary mb-3">
              Everything hits different with <span className="gradient-text">MySanta</span>
            </h2>
            <p className="text-gray-500 text-lg">No more "I don't know what to get you" energy.</p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Big card */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-hero text-white relative overflow-hidden min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand-cyan">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Auto-fill from any link</h3>
                <p className="text-white/60">Paste any product URL — Amazon, Flipkart, Myntra, wherever — and we pull the name, price, and image automatically.</p>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-semibold">Amazon</div>
                <div className="px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-semibold">Flipkart</div>
                <div className="px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-xs font-semibold">Myntra</div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-semibold">+ any site</div>
              </div>
            </div>

            {/* Small card 1 */}
            <div className="rounded-3xl p-7 bg-gradient-warm text-white min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1.5">Share, don't spoil</h3>
                <p className="text-white/70 text-sm">Friends can hold items so nobody buys the same thing. You never see who's getting what.</p>
              </div>
            </div>

            {/* Small card 2 */}
            <div className="rounded-3xl p-7 bg-gradient-green text-white min-h-[200px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1.5">Track everything</h3>
                <p className="text-white/70 text-sm">See what's been held, purchased, or still available — all in one clean view.</p>
              </div>
            </div>

            {/* Big card 2 */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-white border border-secondary shadow-card min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Works for every occasion</h3>
                    <p className="text-gray-500 text-sm">Birthdays, weddings, baby showers — every vibe covered.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Birthday', color: '#8B5CF6', bg: '#EDE9FE' },
                  { label: 'Wedding', color: '#EC4899', bg: '#FCE7F3' },
                  { label: 'Festival', color: '#F97316', bg: '#FFEDD5' },
                  { label: 'Baby Shower', color: '#22D3EE', bg: '#CFFAFE' },
                ].map(o => (
                  <div key={o.label} className="rounded-2xl p-3 text-center" style={{background: o.bg}}>
                    <p className="text-xs font-bold" style={{color: o.color}}>{o.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 dark-section">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-3">
              Three steps. <span className="gradient-text">Zero stress.</span>
            </h2>
            <p className="text-white/50 text-lg">No app download. No sign-up for friends. Just share a link.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Build your list', desc: 'Add items from any website using our auto-fill. Set quantities, variants, and prices.', gradient: 'from-brand to-brand-pink', icon: '✦' },
              { step: '02', title: 'Share the link', desc: 'Get a shareable URL. Send it to your squad on WhatsApp, Instagram, email — wherever.', gradient: 'from-brand-pink to-brand-cyan', icon: '⊹' },
              { step: '03', title: 'Get the gifts', desc: 'Friends browse, hold items to avoid duplicates, and buy. You get notified — no spoilers.', gradient: 'from-brand-cyan to-brand-green', icon: '✿' },
            ].map((s) => (
              <div key={s.step} className="glass rounded-3xl p-8 relative">
                <div className={`text-5xl font-black mb-6 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface">
        <div className="container">
          <div className="rounded-3xl overflow-hidden relative" style={{background: 'linear-gradient(135deg, #0F0B1A 0%, #2D1B69 100%)'}}>
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-brand/25 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-brand-pink/25 blur-3xl pointer-events-none" />
            <div className="relative z-10 py-16 px-10 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Ready to be that friend?<br/>
                <span className="gradient-text">Start your wishlist.</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
                Free forever for personal use. Takes 2 minutes to set up.
              </p>
              <Link href="/sign-in">
                <button className="px-10 py-4 rounded-xl bg-gradient-card text-white font-bold text-base hover:opacity-90 transition-all hover:shadow-glow">
                  Create my wishlist — it's free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0B1A] border-t border-white/10 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2.5 mb-4 md:mb-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-card flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="font-bold text-white">MySanta</span>
            </div>
            <p className="text-white/30 text-sm">
              Made with love. &copy; {new Date().getFullYear()} MySanta.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-white/30 text-sm hover:text-white/60 transition-colors">Terms</Link>
              <Link href="/feedback" className="text-white/30 text-sm hover:text-white/60 transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
