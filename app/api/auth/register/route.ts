import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { signUpSchema } from "@/lib/validations"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, hashedPassword, dob, anniversary, gender } = body

    const existingUser = await db.user.findByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    const user = await db.user.create({
      name,
      email,
      hashedPassword,
      dob: new Date(dob),
      anniversary: anniversary ? new Date(anniversary) : undefined,
      gender: gender || "other",
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}