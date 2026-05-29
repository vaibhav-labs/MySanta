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
      <div className="bg-brand p-6 border border-secondary">
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-1">Welcome back</p>
        <h1 className="font-display text-5xl uppercase text-ink leading-none">{first}.</h1>
        <p className="text-sm text-ink/60 mt-2">Here's the vibe check on your gifts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-secondary p-5 hover:border-ink transition-colors">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Gifts Sent</p>
          <p className="font-display text-6xl text-ink leading-none">{stats.giftsSent}</p>
        </div>
        <div className="border border-secondary p-5 hover:border-ink transition-colors">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Received</p>
          <p className="font-display text-6xl text-ink leading-none">{stats.giftsReceived}</p>
        </div>
      </div>
    </div>
  )
}
