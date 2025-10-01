import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { profileSchema } from "@/lib/validations"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Profile update request body:", body)

    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      console.error("Profile validation failed:", validation.error.errors)
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, anniversary, gender, address } = validation.data

    // Prepare update data
    const updateData: any = {}

    if (name && name.trim() !== "") {
      updateData.name = name.trim()
    }

    if (anniversary && anniversary !== "" && anniversary !== null) {
      updateData.anniversary = new Date(anniversary)
    }

    if (gender) {
      updateData.gender = gender
    }

    if (address) {
      updateData.address = JSON.stringify(address)
    }

    const updatedUser = await db.user.update(session.user.id, updateData)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}