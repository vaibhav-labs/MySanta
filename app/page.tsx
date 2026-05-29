import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { Footer } from "@/components/Footer"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="bg-white border-b border-secondary">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <GiftSVGIcon />
              <span className="text-lg font-bold text-primary tracking-tight">MySanta</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-in">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-5">
              Share Your Wish Lists<br />
              with Friends and Family
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Create beautiful gift lists, share them effortlessly, and give the perfect gifts every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-in">
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-3xl shadow-card-hover p-8 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)'}}>
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-secondary py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">
              Everything You Need for Perfect Gift Giving
            </h2>
            <p className="text-gray-500 text-lg">Simple, elegant, and designed for meaningful connections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<GiftCardIcon />}
              title="Create Lists"
              description="Build beautiful wish lists for any occasion — birthdays, holidays, weddings, or just because."
            />
            <FeatureCard
              icon={<ShareCardIcon />}
              title="Share with Friends"
              description="Connect with loved ones and share your lists privately. No more guessing what they want."
            />
            <FeatureCard
              icon={<HeartCardIcon />}
              title="Give Perfect Gifts"
              description="Coordinate with others to avoid duplicates. See what your friends really want."
            />
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="container py-16">
        <div className="bg-primary rounded-3xl p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to make gift-giving effortless?
          </h3>
          <p className="text-gray-300 mb-7">
            Join and start sharing wish lists with people you love.
          </p>
          <Link href="/sign-in">
            <Button className="bg-white text-primary hover:bg-gray-100 rounded-xl px-8 py-3 text-base font-semibold">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white border border-secondary rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-light mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function GiftSVGIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand">
      <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 11V22" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="7" width="18" height="4" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
      <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
      <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
    </svg>
  )
}

function GiftCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7C12 5 10 3 8 4C6 5 8 7 12 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 7C12 5 14 3 16 4C18 5 16 7 12 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function ShareCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function HeartCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-brand">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function HeroIllustration() {
  return (
    <svg width="280" height="240" viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Big heart */}
      <path d="M140 200 C140 200 40 140 40 90 C40 60 65 40 90 40 C110 40 130 52 140 65 C150 52 170 40 190 40 C215 40 240 60 240 90 C240 140 140 200 140 200Z" fill="#EF4444" fillOpacity="0.9"/>
      {/* Gift box 1 - top left */}
      <rect x="60" y="55" width="44" height="36" rx="4" fill="#fff" fillOpacity="0.9"/>
      <rect x="60" y="49" width="44" height="10" rx="3" fill="#fff"/>
      <line x1="82" y1="49" x2="82" y2="91" stroke="#EF4444" strokeWidth="2"/>
      <path d="M82 49 C82 49 75 40 76 38 C77 36 82 38 82 49Z" fill="#EF4444"/>
      <path d="M82 49 C82 49 89 40 88 38 C87 36 82 38 82 49Z" fill="#EF4444"/>
      {/* Gift box 2 - bottom right */}
      <rect x="178" y="130" width="50" height="42" rx="4" fill="#fff" fillOpacity="0.9"/>
      <rect x="178" y="123" width="50" height="11" rx="3" fill="#fff"/>
      <line x1="203" y1="123" x2="203" y2="172" stroke="#EF4444" strokeWidth="2"/>
      <path d="M203 123 C203 123 195 112 196 110 C197 108 203 111 203 123Z" fill="#EF4444"/>
      <path d="M203 123 C203 123 211 112 210 110 C209 108 203 111 203 123Z" fill="#EF4444"/>
      {/* Gift box 3 - bottom left small */}
      <rect x="68" y="148" width="36" height="30" rx="3" fill="#fff" fillOpacity="0.9"/>
      <rect x="68" y="142" width="36" height="9" rx="2" fill="#fff"/>
      <line x1="86" y1="142" x2="86" y2="178" stroke="#EF4444" strokeWidth="2"/>
      <path d="M86 142 C86 142 81 134 82 133 C83 132 86 134 86 142Z" fill="#EF4444"/>
      <path d="M86 142 C86 142 91 134 90 133 C89 132 86 134 86 142Z" fill="#EF4444"/>
      {/* Sparkles */}
      <circle cx="48" cy="118" r="3" fill="#FCD34D"/>
      <circle cx="232" cy="70" r="2.5" fill="#FCD34D"/>
      <circle cx="155" cy="35" r="2" fill="#FCD34D"/>
      <circle cx="95" cy="175" r="2" fill="#FCD34D"/>
    </svg>
  )
}
