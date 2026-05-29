"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Navigation } from "@/components/Navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { SearchIcon, CalendarIcon, RecentListsIcon, GiftIcon, ShareIcon } from "@/components/ui/Icons"
import { ProductImage } from "@/components/ui/ProductImage"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface SearchResult {
  type: "event" | "list" | "item"
  id: string
  title: string
  description?: string
  date?: string
  listId?: string
  eventId?: string
  price?: number
  currency?: string
  imageUrl?: string
  relevanceScore?: number
  context?: string
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  searchVariations?: string[]
  suggestions?: string[]
  summary?: {
    events: number
    lists: number
    items: number
    totalFound: number
    topScore: number
  }
}

export default function SearchPage() {
  const { data: session } = useSession()
  const [query, setQuery] = useState("")
  const [searchData, setSearchData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearchPerformed(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setSearchData(data)
      } else {
        toast.error("Search failed. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred while searching")
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "event":
        return CalendarIcon
      case "list":
        return RecentListsIcon
      case "item":
        return GiftIcon
      default:
        return SearchIcon
    }
  }

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "event":
        return `/events`
      case "list":
        return `/lists/${result.id}`
      case "item":
        return `/lists/${result.listId}`
      default:
        return "#"
    }
  }

  const shareResult = async (result: SearchResult) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.title,
          text: result.description || `Check out this ${result.type}`,
          url: window.location.origin + getResultLink(result),
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      const url = window.location.origin + getResultLink(result)
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600">Please sign in to search your content.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SearchIcon className="w-5 h-5" />
                <span>Search Events, Lists & Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for events, lists, or gift items..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex items-center space-x-2"
                  >
                    <SearchIcon className="w-4 h-4" />
                    <span>Search</span>
                  </Button>
                </div>
              </form>

              {/* Search Results */}
              {searchPerformed && (
                <div className="mt-8">
                  {/* Search Summary */}
                  {searchData && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-black mb-2">
                        Search Results {searchData.results.length > 0 && `(${searchData.results.length})`}
                      </h3>
                      {searchData.summary && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>{searchData.summary.events} events</span>
                          <span>{searchData.summary.lists} lists</span>
                          <span>{searchData.summary.items} items</span>
                          {searchData.summary.topScore > 0 && (
                            <span className="text-green-600">
                              Relevance: {Math.round(searchData.summary.topScore)}%
                            </span>
                          )}
                        </div>
                      )}

                      {/* Search Variations Used */}
                      {searchData.searchVariations && searchData.searchVariations.length > 1 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Also searching for:</p>
                          <div className="flex flex-wrap gap-2">
                            {searchData.searchVariations.slice(1, 6).map((variation, idx) => (
                              <span key={idx} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {variation}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(!searchData || searchData.results.length === 0) ? (
                    <div className="text-center py-8">
                      <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No results found for "{query}"</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Try different keywords or check your spelling
                      </p>

                      {/* Search Suggestions */}
                      {searchData?.suggestions && searchData.suggestions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {searchData.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchData.results.map((result, index) => {
                        const Icon = getResultIcon(result.type)
                        return (
                          <div
                            key={`${result.type}-${result.id}-${index}`}
                            className="border border-secondary rounded-lg p-4 hover:bg-hover transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="mt-1">
                                  <Icon className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Link
                                      href={getResultLink(result)}
                                      className="font-medium text-black hover:underline"
                                    >
                                      {result.title}
                                    </Link>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                                      {result.type}
                                    </span>
                                  </div>
                                  {result.description && (
                                    <p className="text-sm text-gray-600 mb-2">
                                      {result.description}
                                    </p>
                                  )}
                                  {result.context && (
                                    <p className="text-xs text-blue-600 mb-2 font-medium">
                                      {result.context}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {result.date && (
                                      <span>📅 {new Date(result.date).toLocaleDateString()}</span>
                                    )}
                                    {result.price && (
                                      <span>💰 {result.currency || "USD"} {result.price}</span>
                                    )}
                                    {result.relevanceScore && result.relevanceScore > 0 && (
                                      <span className="text-green-600">
                                        Match: {Math.round(result.relevanceScore)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => shareResult(result)}
                                  className="flex items-center space-x-1"
                                >
                                  <ShareIcon className="w-3 h-3" />
                                  <span>Share</span>
                                </Button>
                                <Link href={getResultLink(result)}>
                                  <Button size="sm">View</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Search Tips */}
              {!searchPerformed && (
                <div className="mt-8 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-black mb-2">Enhanced Search Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <strong>Smart matching:</strong> Finds similar words (e.g. "xmas" finds "Christmas")</li>
                      <li>• <strong>Context search:</strong> Searches descriptions, occasions, and platforms</li>
                      <li>• <strong>Fuzzy matching:</strong> Works with partial words and typos</li>
                      <li>• <strong>Relevance scoring:</strong> Best matches appear first</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-black mb-2">Popular Search Terms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['birthday', 'christmas', 'wedding', 'tech', 'books', 'clothing', 'jewelry', 'home', 'beauty', 'sport'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick(term)}
                          className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}