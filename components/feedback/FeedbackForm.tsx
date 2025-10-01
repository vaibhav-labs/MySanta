"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { CheckIcon, StarIcon } from "@/components/ui/Icons"
import { toast } from "react-hot-toast"

export function FeedbackForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    rating: 0,
    category: "general",
  })

  const categories = [
    { value: "general", label: "General Feedback" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "ui", label: "UI/Design" },
    { value: "performance", label: "Performance" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.feedback.trim()) {
      toast.error("Please provide your feedback")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to submit feedback")
        return
      }

      setSubmitted(true)
      toast.success("Thank you for your feedback!")
    } catch (error) {
      toast.error("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">
            Feedback Submitted!
          </h3>
          <p className="text-gray-600 mb-6">
            Thank you for taking the time to share your thoughts. Your feedback helps us make MySanta better for everyone.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              setFormData({
                name: "",
                email: "",
                feedback: "",
                rating: 0,
                category: "general",
              })
            }}
          >
            Submit More Feedback
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name (Optional)"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
            />
            <Input
              label="Email (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="flex h-10 w-full border border-secondary bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Rate your experience (Optional)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-1 focus:outline-none"
                >
                  <StarIcon
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Your Feedback *
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              required
              rows={6}
              className="flex w-full border border-secondary bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-vertical"
              placeholder="Tell us what you think about MySanta. What features would you like to see? Any bugs or issues? How can we improve?"
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}