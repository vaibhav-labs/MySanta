import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { eventSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        lists: {
          include: {
            items: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        eventDate: "asc",
      },
    })

    return NextResponse.json(events)
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
    const result = await prisma.$transaction(async (tx) => {
      // Create the event
      const event = await tx.event.create({
        data: {
          name,
          occasion,
          eventDate: new Date(eventDate),
          description,
          userId: session.user.id,
        },
      })

      // Auto-create a list for this event
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