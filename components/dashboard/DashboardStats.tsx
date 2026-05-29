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
      <div className="bg-ink p-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:'rgba(255,255,255,0.4)'}}>Welcome back</p>
        <h1 className="font-display text-5xl text-white leading-none">{first}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-brand" />
          <p className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>Here's the vibe check on your gifts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-secondary p-5 hover:border-ink transition-colors bg-white">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#9CA3AF'}}>Gifts Sent</p>
          <p className="font-display text-6xl text-ink leading-none">{stats.giftsSent}</p>
        </div>
        <div className="p-5 hover:opacity-90 transition-opacity" style={{background:'#FFD600'}}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'rgba(0,0,0,0.5)'}}>Received</p>
          <p className="font-display text-6xl text-ink leading-none">{stats.giftsReceived}</p>
        </div>
      </div>
    </div>
  )
}
