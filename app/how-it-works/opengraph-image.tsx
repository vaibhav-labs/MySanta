import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'How MySanta works'
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
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', background: '#0D0D0D', height: 56, paddingLeft: 64, paddingRight: 64, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 32, height: 32, background: '#FFD600', display: 'flex', position: 'relative', borderRadius: 6 }}>
              <div style={{ display: 'flex', position: 'absolute', top: 11, left: 4, width: 24, height: 5, background: '#0D0D0D' }} />
              <div style={{ display: 'flex', position: 'absolute', top: 16, left: 4, width: 24, height: 12, background: '#0D0D0D', borderRadius: '0 0 2px 2px' }} />
              <div style={{ display: 'flex', position: 'absolute', top: 6, left: 14, width: 4, height: 22, background: '#FFD600' }} />
            </div>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 900, color: '#FFFFFF' }}>MySanta</div>
          </div>
          <div style={{ display: 'flex', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 3 }}>
            mysanta.fun/how-it-works
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, padding: 64, flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 32 }}>
            How it works
          </div>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 900, color: '#0D0D0D', lineHeight: 0.95, letterSpacing: -3 }}>
            Three steps.
          </div>
          <div style={{ display: 'flex', fontSize: 130, fontWeight: 900, color: '#E63946', lineHeight: 0.95, letterSpacing: -3, marginTop: 8 }}>
            That's it.
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 56 }}>
            {[
              { n: '01', t: 'Make your list' },
              { n: '02', t: 'Send the link' },
              { n: '03', t: 'Get the gifts' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 20, background: '#F9F9F9', borderLeft: '3px solid #FFD600' }}>
                <div style={{ display: 'flex', fontSize: 36, fontWeight: 900, color: '#FFD600', letterSpacing: -1 }}>{s.n}</div>
                <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#0D0D0D', marginTop: 4 }}>{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
