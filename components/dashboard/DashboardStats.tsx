"use client"

interface DashboardStatsProps {
  stats: {
    giftsSent: number
    giftsReceived: number
  }
  userName?: string | null
}

export function DashboardStats({ stats, userName }: DashboardStatsProps) {
  const first = userName?.split(' ')[0] || 'there'

  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <div className="relative rounded-3xl overflow-hidden p-7" style={{background: 'linear-gradient(135deg, #0F0B1A 0%, #2D1B69 100%)'}}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-36 h-36 rounded-full bg-brand-pink/20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-white/50 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl font-extrabold text-white mb-1">{first} 👋</h1>
          <p className="text-white/40 text-sm">Here's the vibe check on your gifts.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)'}}>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brand/10 pointer-events-none" />
          <div className="w-9 h-9 rounded-xl bg-brand/20 flex items-center justify-center mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-3xl font-extrabold text-brand mb-0.5">{stats.giftsSent}</div>
          <p className="text-brand/70 text-xs font-medium">Gifts sent</p>
        </div>

        <div className="rounded-2xl p-5 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)'}}>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brand-pink/10 pointer-events-none" />
          <div className="w-9 h-9 rounded-xl bg-brand-pink/20 flex items-center justify-center mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand-pink">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="text-3xl font-extrabold text-brand-pink mb-0.5">{stats.giftsReceived}</div>
          <p className="text-brand-pink/70 text-xs font-medium">Gifts received</p>
        </div>
      </div>
    </div>
  )
}
