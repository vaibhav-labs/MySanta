import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#FFD600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        {/* Gift box SVG — gift base */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          {/* Ribbon horizontal bar */}
          <div style={{ width: 18, height: 4, background: '#0D0D0D', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 2, height: 4, background: '#FFD600' }} />
          </div>
          {/* Gift box body */}
          <div style={{ width: 18, height: 10, background: '#0D0D0D', borderRadius: '0 0 2px 2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 2, height: 10, background: '#FFD600' }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
