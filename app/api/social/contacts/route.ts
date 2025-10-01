import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface GoogleContact {
  resourceName: string
  etag: string
  names?: Array<{
    displayName: string
    givenName?: string
    familyName?: string
  }>
  emailAddresses?: Array<{
    value: string
    type?: string
  }>
  photos?: Array<{
    url: string
  }>
}

interface GoogleContactsResponse {
  connections: GoogleContact[]
  nextPageToken?: string
  totalItems: number
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch contacts from Google People API
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos&pageSize=100",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      console.error("Google API error:", response.status, response.statusText)
      return NextResponse.json(
        { error: "Failed to fetch contacts from Google" },
        { status: response.status }
      )
    }

    const data: GoogleContactsResponse = await response.json()

    // Transform Google contacts to our format
    const contacts = data.connections
      ?.filter(contact =>
        contact.emailAddresses &&
        contact.emailAddresses.length > 0 &&
        contact.names &&
        contact.names.length > 0
      )
      .map(contact => ({
        id: contact.resourceName,
        name: contact.names?.[0]?.displayName ||
              `${contact.names?.[0]?.givenName || ''} ${contact.names?.[0]?.familyName || ''}`.trim(),
        email: contact.emailAddresses?.[0]?.value,
        photo: contact.photos?.[0]?.url
      }))
      .filter(contact => contact.email && contact.name) || []

    // Remove duplicates by email
    const uniqueContacts = contacts.filter((contact, index, self) =>
      index === self.findIndex(c => c.email === contact.email)
    )

    return NextResponse.json({
      contacts: uniqueContacts,
      total: uniqueContacts.length
    })

  } catch (error) {
    console.error("Contacts fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}