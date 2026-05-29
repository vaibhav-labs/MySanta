import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MySanta — Your Wishlist. Their Move.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row: brand mark + chip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: '#FFD600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ width: 36, height: 8, background: '#0D0D0D' }} />
                <div style={{ width: 36, height: 22, background: '#0D0D0D', borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: '#0D0D0D', letterSpacing: -1 }}>
              MySanta
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              fontWeight: 700,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: 3,
            }}
          >
            mysanta.fun
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 60,
            fontSize: 140,
            fontWeight: 900,
            color: '#0D0D0D',
            lineHeight: 0.95,
            letterSpacing: -3,
          }}
        >
          <div style={{ display: 'flex' }}>
            Your Wish<span style={{ background: '#FFD600', padding: '0 12px' }}>list.</span>
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            Their <span style={{ color: '#E63946', marginLeft: 24 }}>Move.</span>
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            marginTop: 36,
            fontSize: 30,
            color: '#6B7280',
            maxWidth: 880,
            lineHeight: 1.3,
          }}
        >
          Make a list of what you actually want. Share one link. No more duplicate gifts, no more guessing.
        </div>

        {/* Bottom colour bar */}
        <div style={{ display: 'flex', marginTop: 'auto', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#FFD600' }} />
          <div style={{ width: 32, height: 32, background: '#0D0D0D' }} />
          <div style={{ width: 32, height: 32, background: '#E63946' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
