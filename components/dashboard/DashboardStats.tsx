"use client"

interface DashboardStatsProps {
  stats: { giftsSent: number; giftsReceived: number }
  userName?: string | null
}

export function DashboardStats({ stats, userName }: DashboardStatsProps) {
  const first = userName?.split(' ')[0] || 'You'
  return (
    <div className="space-y-4">
      {/* Welcome */}
      <div className="rounded-2xl p-6 text-white" style={{background:'linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)'}}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:'rgba(255,255,255,0.6)'}}>Welcome back</p>
        <h1 className="font-display font-extrabold text-4xl text-white leading-tight">{first} 👋</h1>
        <p className="text-sm mt-2" style={{color:'rgba(255,255,255,0.7)'}}>Here's the vibe check on your gifts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 border border-secondary hover:border-brand transition-colors bg-white" style={{}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{background:'#EDE9FE'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37a2 2 0 0 1 1.42-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.35 6.35l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:'#9CA3AF'}}>Gifts Sent</p>
          <p className="font-display font-bold text-5xl text-ink">{stats.giftsSent}</p>
        </div>
        <div className="rounded-2xl p-5 border border-secondary hover:border-pink-400 transition-colors bg-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{background:'#FCE7F3'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:'#9CA3AF'}}>Received</p>
          <p className="font-display font-bold text-5xl text-ink">{stats.giftsReceived}</p>
        </div>
      </div>
    </div>
  )
}
