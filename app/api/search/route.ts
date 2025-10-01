import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const SEARCH_SYNONYMS = {
  'birthday': ['bday', 'born', 'birth', 'anniversary', 'celebration'],
  'christmas': ['xmas', 'holiday', 'festive', 'winter', 'santa', 'gift'],
  'wedding': ['marriage', 'bride', 'groom', 'ceremony', 'matrimony'],
  'baby': ['infant', 'newborn', 'child', 'kid', 'tot'],
  'graduation': ['grad', 'diploma', 'degree', 'school', 'university'],
  'anniversary': ['celebration', 'birthday', 'yearly', 'annual'],
  'gift': ['present', 'surprise', 'item', 'product'],
  'book': ['novel', 'read', 'literature', 'author', 'story'],
  'tech': ['technology', 'gadget', 'electronic', 'device', 'digital'],
  'clothing': ['clothes', 'apparel', 'wear', 'fashion', 'garment'],
  'jewelry': ['jewellery', 'accessory', 'ring', 'necklace', 'bracelet'],
  'toy': ['plaything', 'game', 'fun', 'play', 'children'],
  'home': ['house', 'decor', 'furniture', 'living', 'kitchen'],
  'beauty': ['cosmetic', 'makeup', 'skincare', 'personal', 'care'],
  'sport': ['fitness', 'exercise', 'athletic', 'outdoor', 'active'],
  'food': ['cooking', 'kitchen', 'recipe', 'eat', 'culinary'],
  'music': ['song', 'audio', 'sound', 'instrument', 'band'],
  'art': ['creative', 'craft', 'design', 'paint', 'draw']
}

const normalizeWord = (word: string): string => {
  return word.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/s$/, '')
    .replace(/ing$/, '')
    .replace(/ed$/, '')
    .trim()
}

const generateSearchVariations = (query: string): string[] => {
  const words = query.toLowerCase().split(/\s+/)
  const variations = new Set([query.toLowerCase()])

  words.forEach(word => {
    const normalized = normalizeWord(word)
    if (normalized !== word) {
      variations.add(normalized)
    }
  })

  words.forEach(word => {
    const normalized = normalizeWord(word)
    if (SEARCH_SYNONYMS[normalized]) {
      SEARCH_SYNONYMS[normalized].forEach(synonym => {
        variations.add(synonym)
        const otherWords = words.filter(w => normalizeWord(w) !== normalized)
        if (otherWords.length > 0) {
          variations.add(`${synonym} ${otherWords.join(' ')}`)
          variations.add(`${otherWords.join(' ')} ${synonym}`)
        }
      })
    }
  })

  return Array.from(variations)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        message: "Query must be at least 2 characters long"
      })
    }

    const searchVariations = generateSearchVariations(query.trim())

    const createSearchConditions = (searchVariations: string[]) => {
      return searchVariations.flatMap(variation => [
        { name: { contains: variation } },
        { occasion: { contains: variation } },
        { description: { contains: variation } }
      ])
    }

    // Search events
    const events = await prisma.event.findMany({
      where: {
        userId: session.user.id,
        OR: createSearchConditions(searchVariations),
      },
      select: {
        id: true,
        name: true,
        occasion: true,
        description: true,
        eventDate: true,
      },
      take: 15,
    })

    // Search lists
    const lists = await prisma.list.findMany({
      where: {
        userId: session.user.id,
        OR: searchVariations.map(variation => ({
          name: { contains: variation }
        })),
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        event: {
          select: {
            name: true,
            eventDate: true,
            occasion: true,
            description: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      take: 15,
    })

    // Search list items
    const items = await prisma.listItem.findMany({
      where: {
        list: {
          userId: session.user.id,
        },
        OR: searchVariations.flatMap(variation => [
          { productName: { contains: variation } },
          { platform: { contains: variation } },
          { variants: { contains: variation } },
        ]),
      },
      select: {
        id: true,
        productName: true,
        price: true,
        currency: true,
        imageUrl: true,
        platform: true,
        variants: true,
        quantity: true,
        listId: true,
        list: {
          select: {
            name: true,
            event: {
              select: {
                name: true,
                occasion: true,
                description: true,
              },
            },
          },
        },
      },
      take: 20,
    })

    const calculateRelevanceScore = (text: string, originalQuery: string, variations: string[]): number => {
      let score = 0
      const lowerText = text.toLowerCase()
      const lowerQuery = originalQuery.toLowerCase()

      if (lowerText.includes(lowerQuery)) {
        score += 100
      }

      variations.forEach(variation => {
        if (lowerText.includes(variation.toLowerCase())) {
          score += 50
        }
      })

      const words = lowerQuery.split(/\s+/)
      words.forEach(word => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i')
        if (wordRegex.test(text)) {
          score += 25
        }
      })

      if (lowerText.startsWith(lowerQuery)) {
        score += 30
      }

      return score
    }

    const results = [
      ...events.map(event => ({
        type: "event" as const,
        id: event.id,
        title: event.name,
        description: `${event.occasion}${event.description ? ` - ${event.description}` : ""}`,
        date: event.eventDate.toISOString(),
        relevanceScore: Math.max(
          calculateRelevanceScore(event.name, query, searchVariations),
          calculateRelevanceScore(event.occasion, query, searchVariations),
          event.description ? calculateRelevanceScore(event.description, query, searchVariations) : 0
        ),
        context: `Event on ${event.eventDate.toLocaleDateString()}`,
      })),
      ...lists.map(list => ({
        type: "list" as const,
        id: list.id,
        title: list.name,
        description: list.event
          ? `Event: ${list.event.name} (${list.event.occasion}) • ${list._count.items} items`
          : `${list._count.items} items`,
        date: list.createdAt.toISOString(),
        relevanceScore: Math.max(
          calculateRelevanceScore(list.name, query, searchVariations),
          list.event ? calculateRelevanceScore(list.event.name, query, searchVariations) : 0,
          list.event?.occasion ? calculateRelevanceScore(list.event.occasion, query, searchVariations) : 0
        ),
        context: list.event ? `For ${list.event.occasion}` : "Personal list",
      })),
      ...items.map(item => ({
        type: "item" as const,
        id: item.id,
        title: item.productName,
        description: `${item.list.name}${item.list.event ? ` (${item.list.event.occasion})` : ""} • ${item.platform}${item.variants ? ` • ${item.variants}` : ""}${item.quantity && item.quantity > 1 ? ` • Qty: ${item.quantity}` : ""}`,
        listId: item.listId,
        price: item.price,
        currency: item.currency,
        imageUrl: item.imageUrl,
        relevanceScore: Math.max(
          calculateRelevanceScore(item.productName, query, searchVariations),
          calculateRelevanceScore(item.platform, query, searchVariations),
          item.variants ? calculateRelevanceScore(item.variants, query, searchVariations) : 0,
          item.list.event?.occasion ? calculateRelevanceScore(item.list.event.occasion, query, searchVariations) : 0
        ),
        context: item.list.event?.occasion ? `For ${item.list.event.occasion}` : "Personal wishlist",
      })),
    ]

    const sortedResults = results.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return a.title.localeCompare(b.title)
    })

    const generateSuggestions = (originalQuery: string): string[] => {
      const queryWords = originalQuery.toLowerCase().split(/\s+/)
      const suggestions = new Set<string>()

      queryWords.forEach(word => {
        const normalized = normalizeWord(word)
        if (SEARCH_SYNONYMS[normalized]) {
          SEARCH_SYNONYMS[normalized].forEach(synonym => {
            suggestions.add(synonym)
          })
        }
      })

      const popularTerms = ['birthday', 'christmas', 'wedding', 'tech', 'books', 'clothing', 'jewelry']
      popularTerms.forEach(term => {
        if (term.includes(normalizeWord(originalQuery)) || normalizeWord(originalQuery).includes(term)) {
          suggestions.add(term)
        }
      })

      return Array.from(suggestions).slice(0, 5)
    }

    const finalResults = sortedResults.slice(0, 25)

    return NextResponse.json({
      results: finalResults,
      total: sortedResults.length,
      query: query,
      searchVariations: searchVariations.slice(0, 10),
      suggestions: generateSuggestions(query),
      summary: {
        events: events.length,
        lists: lists.length,
        items: items.length,
        totalFound: sortedResults.length,
        topScore: finalResults.length > 0 ? finalResults[0].relevanceScore : 0
      }
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}