import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MySanta — Your wishlist. Their move.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Reusable gift-box logo (matches the favicon)
function Logo({ scale = 1 }: { scale?: number }) {
  const s = (n: number) => n * scale
  return (
    <div
      style={{
        width: s(220),
        height: s(220),
        background: '#FFD600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: s(40),
        position: 'relative',
      }}
    >
      {/* Ribbon top */}
      <div style={{ display: 'flex', position: 'absolute', top: s(38), left: s(46), gap: s(8) }}>
        <div style={{ width: s(56), height: s(36), background: '#E63946', borderRadius: s(20) }} />
        <div style={{ width: s(56), height: s(36), background: '#E63946', borderRadius: s(20) }} />
      </div>
      {/* Box top bar */}
      <div style={{ display: 'flex', position: 'absolute', top: s(80), left: s(28), width: s(164), height: s(28), background: '#0D0D0D' }} />
      {/* Box body */}
      <div style={{ display: 'flex', position: 'absolute', top: s(108), left: s(28), width: s(164), height: s(82), background: '#0D0D0D', borderRadius: `0 0 ${s(6)}px ${s(6)}px` }} />
      {/* Vertical ribbon */}
      <div style={{ display: 'flex', position: 'absolute', top: s(38), left: s(102), width: s(16), height: s(152), background: '#FFD600' }} />
    </div>
  )
}

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          display: 'flex',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left panel — yellow with logo */}
        <div
          style={{
            width: 480,
            height: '100%',
            background: '#FFD600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Logo scale={1.2} />
        </div>

        {/* Right panel — text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 64,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 900, color: '#0D0D0D', letterSpacing: -1 }}>
              MySanta
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 16,
                fontWeight: 700,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: 3,
              }}
            >
              mysanta.fun
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 96,
                fontWeight: 900,
                color: '#0D0D0D',
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              Your wishlist.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 96,
                fontWeight: 900,
                color: '#E63946',
                lineHeight: 1,
                letterSpacing: -2,
                marginTop: 8,
              }}
            >
              Their move.
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 32,
                fontSize: 26,
                color: '#6B7280',
                maxWidth: 600,
                lineHeight: 1.3,
              }}
            >
              Make a list of what you actually want. Share one link. No more duplicate gifts.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: '#FFD600' }} />
            <div style={{ width: 32, height: 32, background: '#0D0D0D' }} />
            <div style={{ width: 32, height: 32, background: '#E63946' }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
