"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { StarIcon } from "@/components/ui/Icons"

interface Feedback {
  id: string
  name?: string | null
  email?: string | null
  feedback: string
  rating?: number | null
  category: string
  createdAt: string
}

interface FeedbackStats {
  total: number
  averageRating: number | null
}

interface FeedbackResponse {
  feedback: Feedback[]
  stats: FeedbackStats
}

export function FeedbackManager() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [stats, setStats] = useState<FeedbackStats>({ total: 0, averageRating: null })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General Feedback" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "ui", label: "UI/Design" },
    { value: "performance", label: "Performance" },
  ]

  useEffect(() => {
    fetchFeedback()
  }, [selectedCategory])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === "all"
        ? "/api/feedback"
        : `/api/feedback?category=${selectedCategory}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch feedback")

      const data: FeedbackResponse = await response.json()
      setFeedback(data.feedback)
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'feature': return 'bg-blue-100 text-blue-800'
      case 'bug': return 'bg-red-100 text-red-800'
      case 'ui': return 'bg-purple-100 text-purple-800'
      case 'performance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading feedback...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Feedback</div>
          </div>
          {stats.averageRating && (
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-black">Filter:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-secondary bg-white px-3 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No feedback found for the selected category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                    {item.rating && renderStars(item.rating)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{item.feedback}</p>
                </div>

                {(item.name || item.email) && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {item.name && (
                        <span>
                          <span className="font-medium">Name:</span> {item.name}
                        </span>
                      )}
                      {item.email && (
                        <span>
                          <span className="font-medium">Email:</span> {item.email}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={fetchFeedback}>
          Refresh
        </Button>
      </div>
    </div>
  )
}