import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { transaction } from "@/lib/supabase"
import { eventSchema } from "@/lib/validations"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await db.event.findMany(session.user.id)
    
    // Fetch lists and items for each event
    const eventsWithDetails = await Promise.all(
      events.map(async (event: any) => {
        const lists = await db.list.findMany(session.user.id)
        const eventLists = lists.filter((list: any) => list.event_id === event.id)
        
        const listsWithItems = await Promise.all(
          eventLists.map(async (list: any) => {
            const items = await db.listItem.findMany(list.id)
            return {
              ...list,
              items: items.map((item: any) => ({
                id: item.id,
                status: item.status,
              })),
            }
          })
        )
        
        return {
          ...event,
          lists: listsWithItems,
        }
      })
    )

    return NextResponse.json(eventsWithDetails)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, occasion, eventDate, description } = validation.data

    // Create event and auto-create associated list in a transaction
    const result = await transaction(async (client) => {
      // Create the event
      const eventResult = await client.query(
        `INSERT INTO events (user_id, name, occasion, event_date, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [session.user.id, name, occasion, new Date(eventDate), description]
      )
      const event = eventResult.rows[0]

      // Auto-create a list for this event
      const listResult = await client.query(
        `INSERT INTO lists (name, user_id, event_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [`${name} Gift List`, session.user.id, event.id]
      )
      const list = listResult.rows[0]

      return { event, list }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}