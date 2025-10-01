import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { listSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lists = await prisma.list.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: true,
        items: {
          select: {
            id: true,
            productName: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(lists)
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

    const list = await prisma.list.create({
      data: {
        name,
        userId: session.user.id,
        eventId: eventId || null,
      },
      include: {
        event: true,
        items: true,
      },
    })

    return NextResponse.json(list, { status: 201 })
  } catch (error) {
    console.error("Error creating list:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}