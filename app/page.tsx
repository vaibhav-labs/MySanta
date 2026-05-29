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
      <div className="bg-ink text-white py-2.5 overflow-hidden">
        <div className="marquee-track">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-xs font-medium tracking-widest uppercase whitespace-nowrap px-6">
              Filtered gifting is boring. We're only all time human.&nbsp;&nbsp;·&nbsp;&nbsp;
              Your wishlist. Their problem.&nbsp;&nbsp;·&nbsp;&nbsp;
              No more "I don't know what to get you" energy.&nbsp;&nbsp;·&nbsp;&nbsp;
              Birthdays · Weddings · Festivals · All vibes covered.&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="border-b border-secondary bg-white sticky top-0 z-50">
        <div className="container">
          <div className="flex h-14 items-center justify-between">
            <span className="font-display text-2xl tracking-wider text-ink uppercase">MySanta</span>
            <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
              <Link href="/how-it-works" className="hover:text-ink transition-colors">How it works</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Events</Link>
              <Link href="/sign-in" className="hover:text-ink transition-colors">Friends</Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/sign-in" className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-ink transition-colors hidden md:block">
                Sign In
              </Link>
              <Link href="/sign-in">
                <button className="bg-brand text-ink text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-brand-dark transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="border-b border-secondary">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[88vh]">

            {/* Left — text */}
            <div className="flex flex-col justify-center py-16 lg:py-0 lg:pr-16 border-r border-secondary">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
                The wishlist platform
              </p>
              <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-none text-ink uppercase mb-6">
                Your<br />
                Wish<span className="bg-brand px-1">list.</span><br />
                Their<br />
                Move.
              </h1>
              <p className="text-base text-gray-500 max-w-sm leading-relaxed mb-10">
                Create a wishlist for any occasion. Share one link. Let your people get you exactly what you want — no hints, no duplicates, no awkward gifts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sign-in">
                  <button className="bg-ink text-white text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-gray-800 transition-colors w-full sm:w-auto">
                    Create my wishlist →
                  </button>
                </Link>
                <Link href="/how-it-works">
                  <button className="border border-ink text-ink text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-surface transition-colors w-full sm:w-auto">
                    See how it works →
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — visual block */}
            <div className="bg-ink hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
              {/* Decorative large text */}
              <div className="font-display text-[160px] leading-none text-white/5 uppercase select-none absolute -bottom-4 -right-4">
                GIFT
              </div>
              {/* Mock wishlist card */}
              <div className="mt-auto relative z-10">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Preview</p>
                <div className="bg-white/10 border border-white/10 p-5 mb-2">
                  <p className="text-brand font-display text-lg uppercase tracking-wider mb-3">Alex's Birthday 🎂</p>
                  {[
                    { name: 'AirPods Pro 2', price: '₹24,900', status: 'WISHED' },
                    { name: 'Nike Air Jordan 1', price: '₹12,995', status: 'HELD' },
                    { name: 'PS5 Controller', price: '₹5,990', status: 'PURCHASED' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between py-2.5 border-t border-white/10">
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        <p className="text-white/40 text-xs">{item.price}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${
                        item.status === 'PURCHASED' ? 'bg-brand text-ink' :
                        item.status === 'HELD' ? 'bg-white/20 text-white' :
                        'border border-white/30 text-white/60'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs">Shared link works without sign-up for viewers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Yellow marquee strip ── */}
      <div className="bg-brand py-3.5 overflow-hidden border-b border-ink/10">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-[0.2em] text-ink whitespace-nowrap px-6">
              Birthdays &nbsp;✦&nbsp; Weddings &nbsp;✦&nbsp; Baby Showers &nbsp;✦&nbsp;
              Graduation &nbsp;✦&nbsp; Anniversaries &nbsp;✦&nbsp; Christmas &nbsp;✦&nbsp;
              Diwali &nbsp;✦&nbsp; Valentine's Day &nbsp;✦&nbsp; Holi &nbsp;✦&nbsp; Eid &nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section className="border-b border-secondary">
        <div className="container">
          <div className="py-6 border-b border-secondary">
            <h2 className="font-display text-6xl md:text-7xl uppercase text-ink">
              Three steps. Zero stress.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { n: '01', title: 'Build your list', body: 'Add items from any website using URL auto-fill. Set quantities, variants, prices. No friction.' },
              { n: '02', title: 'Share the link', body: 'Get one shareable URL. Send it on WhatsApp, Instagram, email — wherever your people are.' },
              { n: '03', title: 'Get the gifts', body: 'Friends browse, hold items to avoid duplicates, and buy. You get notified. No spoilers.' },
            ].map((s, i) => (
              <div key={s.n} className={`py-10 px-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-secondary' : ''}`}>
                <p className="font-display text-7xl text-brand leading-none mb-4">{s.n}</p>
                <h3 className="font-display text-3xl uppercase text-ink mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Occasions grid ── */}
      <section className="border-b border-secondary bg-ink text-white">
        <div className="container">
          <div className="py-6 border-b border-white/10">
            <h2 className="font-display text-6xl md:text-7xl uppercase">
              Works for <span className="text-brand">every vibe.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Birthday', sub: 'Drop the hint, skip the awkward' },
              { label: 'Wedding', sub: 'Registry done right' },
              { label: 'Diwali', sub: 'The gift of exactly that' },
              { label: 'Baby Shower', sub: 'Everything they actually need' },
              { label: 'Graduation', sub: 'Celebrate the level up' },
              { label: 'Christmas', sub: 'Santa just got an upgrade' },
              { label: 'Valentine\'s', sub: 'Obvious but make it yours' },
              { label: 'Just Because', sub: 'Any day is a good day' },
            ].map((o, i) => (
              <div key={o.label} className={`py-8 px-6 border-white/10 ${
                i % 4 !== 3 ? 'border-r' : ''
              } ${i < 4 ? 'border-b' : ''}`}>
                <p className="font-display text-2xl uppercase text-white mb-1">{o.label}</p>
                <p className="text-white/40 text-xs">{o.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statement CTA ── */}
      <section className="border-b border-secondary">
        <div className="container py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              The part time human truth
            </p>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none uppercase text-ink mb-10">
              Filtered gifting<br />
              is <span className="bg-brand px-2">boring.</span><br />
              We're only all<br />
              time human.
            </h2>
            <Link href="/sign-in">
              <button className="bg-ink text-white text-sm font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-800 transition-colors">
                Create my wishlist — it's free →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-b border-secondary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 py-12 gap-8">
            <div>
              <p className="font-display text-4xl uppercase text-ink mb-3">MySanta</p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                The wishlist platform for people who know what they want and the friends who actually listen.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Navigate</p>
              <ul className="space-y-2 text-sm">
                {['Dashboard', 'My Lists', 'Events', 'Friends', 'Search'].map(l => (
                  <li key={l}><Link href="/sign-in" className="text-gray-500 hover:text-ink transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                {[['Terms', '/terms'], ['Privacy', '/terms'], ['Feedback', '/feedback']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-gray-500 hover:text-ink transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Yellow brand strip ── */}
      <div className="bg-brand py-5">
        <div className="container flex items-center justify-between">
          <p className="font-display text-2xl uppercase text-ink tracking-wider">MySanta</p>
          <p className="text-ink/50 text-xs font-semibold uppercase tracking-widest">
            © {new Date().getFullYear()} — mysanta.fun
          </p>
        </div>
      </div>
    </div>
  )
}
