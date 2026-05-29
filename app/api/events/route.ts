import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import { eventSchema } from "@/lib/validations"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await db.event.findMany(session.user.id)

    const eventsWithDetails = await Promise.all(
      events.map(async (event: any) => {
        const lists = await db.list.findMany(session.user.id)
        const eventLists = lists.filter((list: any) => list.eventId === event.id)

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

    // Use a Prisma transaction: create event + auto-create its gift list atomically
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          userId: session.user.id,
          name,
          occasion,
          eventDate: new Date(eventDate),
          description,
        },
      })

      const list = await tx.list.create({
        data: {
          name: `${name} Gift List`,
          userId: session.user.id,
          eventId: event.id,
        },
      })

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
