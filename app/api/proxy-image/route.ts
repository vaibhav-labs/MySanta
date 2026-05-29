import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Allowed image content types
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get("url")

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 })
  }

  // Only proxy http/https URLs
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return new NextResponse("Invalid URL", { status: 400 })
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        // Spoof a browser User-Agent — some CDNs reject non-browser requests
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        // No Referer — this is the key difference from a browser request
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status })
    }

    const contentType = response.headers.get("content-type") || ""

    // Validate it's actually an image
    const isImage = ALLOWED_CONTENT_TYPES.some(type =>
      contentType.toLowerCase().startsWith(type)
    )

    if (!isImage) {
      return new NextResponse("Not an image", { status: 400 })
    }

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 24 hours in the browser, 7 days on CDN edge
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Image proxy error:", error)
    return new NextResponse("Failed to fetch image", { status: 500 })
  }
}
