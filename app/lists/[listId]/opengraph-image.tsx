import { ImageResponse } from 'next/og'
import { db } from '@/lib/db'

export const alt = 'A shared wishlist on MySanta'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function ListOG({ params }: { params: { listId: string } }) {
  // Best-effort fetch — if anything fails, render a generic card
  let listName = 'Shared wishlist'
  let ownerName = ''
  let itemCount: number | null = null
  let eventName: string | null = null

  try {
    const list = await db.list.findById(params.listId)
    if (list) {
      listName = list.name
      const [owner, items, event] = await Promise.all([
        db.user.findById(list.userId),
        db.listItem.findMany(params.listId),
        list.eventId ? db.event.findById(list.eventId) : Promise.resolve(null),
      ])
      if (owner?.name) {
        ownerName = owner.name.split(' ')[0]
      }
      itemCount = items.length
      if (event) eventName = event.name
    }
  } catch {
    // fall through to defaults
  }

  // Pick a colour accent based on listName hash so different lists feel different
  const accents = ['#FFD600', '#E63946', '#FFF8CC', '#0D0D0D']
  const accent = accents[Array.from(listName).reduce((a, c) => a + c.charCodeAt(0), 0) % accents.length]
  const onAccentDark = accent === '#FFD600' || accent === '#FFF8CC'
  const accentText = onAccentDark ? '#0D0D0D' : '#FFFFFF'

  // Truncate long list names so they fit
  const display = listName.length > 36 ? listName.slice(0, 34) + '…' : listName

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
        {/* Top ticker bar */}
        <div
          style={{
            display: 'flex',
            background: '#0D0D0D',
            height: 56,
            paddingLeft: 64,
            paddingRight: 64,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mini gift box logo */}
            <div
              style={{
                width: 32,
                height: 32,
                background: '#FFD600',
                display: 'flex',
                position: 'relative',
                borderRadius: 6,
              }}
            >
              <div style={{ display: 'flex', position: 'absolute', top: 11, left: 4, width: 24, height: 5, background: '#0D0D0D' }} />
              <div style={{ display: 'flex', position: 'absolute', top: 16, left: 4, width: 24, height: 12, background: '#0D0D0D', borderRadius: '0 0 2px 2px' }} />
              <div style={{ display: 'flex', position: 'absolute', top: 6, left: 14, width: 4, height: 22, background: '#FFD600' }} />
            </div>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: -0.5 }}>
              MySanta
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: 3,
            }}
          >
            Shared wishlist
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, padding: 64, flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                fontWeight: 700,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: 4,
                marginBottom: 28,
              }}
            >
              {ownerName ? `${ownerName}'s list` : 'A wishlist'}
              {eventName ? `  ·  ${eventName.length > 24 ? eventName.slice(0, 22) + '…' : eventName}` : ''}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 100,
                fontWeight: 900,
                color: '#0D0D0D',
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              {display}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  background: accent,
                  color: accentText,
                  padding: '14px 24px',
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                }}
              >
                {itemCount !== null ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} on the list` : 'Open to view'}
              </div>
              <div style={{ display: 'flex', marginTop: 20, fontSize: 22, color: '#6B7280' }}>
                Pick something. Mark it. Nobody else buys the same thing.
              </div>
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
        </div>
      </div>
    ),
    { ...size }
  )
}
