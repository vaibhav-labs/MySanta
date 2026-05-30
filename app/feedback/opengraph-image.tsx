import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Give feedback on MySanta'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FFD600',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, background: '#0D0D0D', display: 'flex', position: 'relative', borderRadius: 10 }}>
              <div style={{ display: 'flex', position: 'absolute', top: 20, left: 6, width: 44, height: 8, background: '#FFD600' }} />
              <div style={{ display: 'flex', position: 'absolute', top: 28, left: 6, width: 44, height: 22, background: '#FFD600', borderRadius: '0 0 3px 3px' }} />
              <div style={{ display: 'flex', position: 'absolute', top: 10, left: 25, width: 6, height: 40, background: '#0D0D0D' }} />
            </div>
            <div style={{ display: 'flex', fontSize: 36, fontWeight: 900, color: '#0D0D0D' }}>MySanta</div>
          </div>
          <div style={{ display: 'flex', fontSize: 14, fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 3 }}>
            Beta feedback
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 80 }}>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 900, color: '#0D0D0D', lineHeight: 0.95, letterSpacing: -3 }}>
            Tell us what's
          </div>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 900, color: '#E63946', lineHeight: 0.95, letterSpacing: -3, marginTop: 8 }}>
            broken.
          </div>
          <div style={{ display: 'flex', marginTop: 36, fontSize: 28, color: 'rgba(0,0,0,0.7)', maxWidth: 900, lineHeight: 1.3 }}>
            Or what's working, or what you wish existed. Any of it helps.
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', letterSpacing: 3 }}>
            mysanta.fun/feedback
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: '#0D0D0D' }} />
            <div style={{ width: 32, height: 32, background: '#E63946' }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
