import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { listSchema } from "@/lib/validations"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lists = await db.list.findMany(session.user.id)
    
    // Fetch events and items for each list
    const listsWithDetails = await Promise.all(
      lists.map(async (list: any) => {
        const event = list.event_id ? await db.event.findById(list.event_id) : null
        const items = await db.listItem.findMany(list.id)
        
        return {
          ...list,
          event,
          items: items.map((item: any) => ({
            id: item.id,
            productName: item.product_name,
            status: item.status,
          })),
        }
      })
    )

    return NextResponse.json(listsWithDetails)
  } catch (error) {
    console.error("Error fetching lists:", error)
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
    const validation = listSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, eventId } = validation.data

    const list = await db.list.create({
      name,
      userId: session.user.id,
      eventId: eventId || null,
    })
    
    const event = list.event_id ? await db.event.findById(list.event_id) : null
    const items = await db.listItem.findMany(list.id)
    
    const listWithDetails = {
      ...list,
      event,
      items,
    }

    return NextResponse.json(listWithDetails, { status: 201 })
  } catch (error) {
    console.error("Error creating list:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}