import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { scrapeSchema } from "@/lib/validations"
import * as cheerio from "cheerio"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = scrapeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      )
    }

    const { url } = validation.data

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      let title = ""
      let image = ""
      let price = null
      let currency = "USD" // Default currency
      let platform = ""

      title = $('meta[property="og:title"]').attr('content') ||
              $('title').text() ||
              $('h1').first().text() ||
              ""

      image = $('meta[property="og:image"]').attr('content') ||
              $('img').first().attr('src') ||
              ""

      const priceSelectors = [
        '.price',
        '[class*="price"]',
        '[id*="price"]',
        '.cost',
        '[class*="cost"]',
        '[data-price]',
        '.money',
        '[class*="money"]',
      ]

      // Currency detection patterns
      const currencyPatterns = [
        { symbol: "$", code: "USD", pattern: /\$[\d,]+\.?\d*/ },
        { symbol: "€", code: "EUR", pattern: /€[\d,]+\.?\d*/ },
        { symbol: "£", code: "GBP", pattern: /£[\d,]+\.?\d*/ },
        { symbol: "¥", code: "JPY", pattern: /¥[\d,]+\.?\d*/ },
        { symbol: "₹", code: "INR", pattern: /₹[\d,]+\.?\d*/ },
        { symbol: "₩", code: "KRW", pattern: /₩[\d,]+\.?\d*/ },
        { symbol: "A$", code: "AUD", pattern: /A\$[\d,]+\.?\d*/ },
        { symbol: "C$", code: "CAD", pattern: /C\$[\d,]+\.?\d*/ },
        { symbol: "CHF", code: "CHF", pattern: /CHF[\d,]+\.?\d*/ },
      ]

      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text()
        if (priceText) {
          // Try to match currency patterns first
          let foundCurrency = false
          for (const currencyPattern of currencyPatterns) {
            if (currencyPattern.pattern.test(priceText)) {
              currency = currencyPattern.code
              foundCurrency = true
              break
            }
          }

          // Extract price number
          const priceMatch = priceText.match(/[\d,]+\.?\d*/g)
          if (priceMatch) {
            price = parseFloat(priceMatch[0].replace(/,/g, ''))

            // If no currency pattern was found, try to detect currency by domain
            if (!foundCurrency) {
              try {
                const urlObj = new URL(url)
                const domain = urlObj.hostname.toLowerCase()

                // Domain-based currency detection
                if (domain.includes('.co.uk') || domain.includes('.uk')) {
                  currency = "GBP"
                } else if (domain.includes('.eu') || domain.includes('.de') || domain.includes('.fr') || domain.includes('.it') || domain.includes('.es')) {
                  currency = "EUR"
                } else if (domain.includes('.jp')) {
                  currency = "JPY"
                } else if (domain.includes('.in')) {
                  currency = "INR"
                } else if (domain.includes('.kr')) {
                  currency = "KRW"
                } else if (domain.includes('.au')) {
                  currency = "AUD"
                } else if (domain.includes('.ca')) {
                  currency = "CAD"
                } else if (domain.includes('.ch')) {
                  currency = "CHF"
                } else if (domain.includes('.cn')) {
                  currency = "CNY"
                }
              } catch {
                // Keep default USD
              }
            }
            break
          }
        }
      }

      try {
        const urlObj = new URL(url)
        platform = urlObj.hostname.replace('www.', '').split('.')[0]
        platform = platform.charAt(0).toUpperCase() + platform.slice(1)
      } catch {
        platform = "Unknown"
      }

      if (image && image.startsWith('/')) {
        const baseUrl = new URL(url).origin
        image = baseUrl + image
      }

      return NextResponse.json({
        title: title.trim(),
        image: image || null,
        price: price || null,
        currency,
        platform,
      })
    } catch (scrapeError) {
      console.error("Scraping error:", scrapeError)
      return NextResponse.json(
        { error: "Failed to scrape URL. Please enter details manually." },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error in scrape API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}