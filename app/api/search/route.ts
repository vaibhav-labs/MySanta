import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

const SEARCH_SYNONYMS: Record<string, string[]> = {
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
    
    // Get all user's events
    const allEvents = await db.event.findMany(session.user.id)
    
    // Filter events that match any variation
    const events = allEvents.filter((event: any) => {
      const eventText = `${event.name || ''} ${event.occasion || ''} ${event.description || ''}`.toLowerCase()
      return searchVariations.some(variation => eventText.includes(variation))
    }).slice(0, 15).map((event: any) => ({
      id: event.id,
      name: event.name,
      occasion: event.occasion,
      description: event.description,
      eventDate: event.event_date,
    }))

    // Get all user's lists
    const allLists = await db.list.findMany(session.user.id)
    
    // Filter lists that match any variation
    const lists = allLists.filter((list: any) => {
      const listName = (list.name || '').toLowerCase()
      return searchVariations.some(variation => listName.includes(variation))
    }).slice(0, 15).map((list: any) => ({
      id: list.id,
      name: list.name,
      createdAt: list.created_at,
      _count: {
        items: 0 // Will be populated below
      }
    }))

    // Get items for each matching list
    const listsWithCounts = await Promise.all(
      lists.map(async (list: any) => {
        const items = await db.listItem.findMany(list.id)
        return {
          ...list,
          _count: {
            items: items.length
          }
        }
      })
    )

    // Get all list items
    const allItems: any[] = []
    for (const list of allLists) {
      const items = await db.listItem.findMany(list.id)
      items.forEach((item: any) => {
        allItems.push({
          ...item,
          listId: list.id,
          listName: list.name
        })
      })
    }

    // Filter items that match any variation
    const items = allItems.filter((item: any) => {
      const itemText = `${item.product_name || ''} ${item.variants || ''} ${item.platform || ''}`.toLowerCase()
      return searchVariations.some(variation => itemText.includes(variation))
    }).slice(0, 20).map((item: any) => ({
      id: item.id,
      productName: item.product_name,
      productUrl: item.product_url,
      imageUrl: item.image_url,
      price: item.price,
      currency: item.currency,
      platform: item.platform,
      status: item.status,
      list: {
        id: item.listId,
        name: item.listName
      }
    }))

    // Calculate relevance scores
    const scoreResult = (text: string) => {
      const lowerText = text.toLowerCase()
      const queryLower = query.toLowerCase()
      
      if (lowerText.includes(queryLower)) return 10
      
      const queryWords = queryLower.split(/\s+/)
      let score = 0
      queryWords.forEach(word => {
        if (lowerText.includes(word)) score += 3
      })
      
      searchVariations.forEach(variation => {
        if (lowerText.includes(variation)) score += 1
      })
      
      return score
    }

    const scoredResults = [
      ...events.map((e: any) => ({
        type: 'event',
        data: e,
        score: scoreResult(`${e.name} ${e.occasion} ${e.description}`)
      })),
      ...listsWithCounts.map((l: any) => ({
        type: 'list',
        data: l,
        score: scoreResult(l.name)
      })),
      ...items.map((i: any) => ({
        type: 'item',
        data: i,
        score: scoreResult(`${i.productName} ${i.platform}`)
      }))
    ].sort((a, b) => b.score - a.score)

    return NextResponse.json({
      results: {
        events: scoredResults.filter(r => r.type === 'event').map(r => r.data),
        lists: scoredResults.filter(r => r.type === 'list').map(r => r.data),
        items: scoredResults.filter(r => r.type === 'item').map(r => r.data),
      },
      query,
      variations: searchVariations
    })

  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}