import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, hashedPassword, dob, anniversary, gender } = body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        dob: new Date(dob),
        anniversary: anniversary ? new Date(anniversary) : null,
        gender: gender || "other",
      },
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