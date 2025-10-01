"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { SparklesIcon, CalendarIcon } from "@/components/ui/Icons"
import { toast } from "react-hot-toast"

const occasionOptions = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Baby Shower",
  "Graduation",
  "Christmas",
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  "Housewarming",
  "Retirement",
  "Other"
]

export function CreateEventForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    occasion: "",
    eventDate: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Event name is required"
    if (!formData.occasion) newErrors.occasion = "Occasion is required"
    if (!formData.eventDate) newErrors.eventDate = "Event date is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to create event")
        return
      }

      const result = await response.json()
      toast.success(`🎉 ${formData.name} created! A gift list was automatically made too!`)

      // Redirect to the auto-created list
      router.push(`/lists/${result.list.id}`)
    } catch (error) {
      toast.error("Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SparklesIcon className="w-5 h-5" />
          <span>Create New Event</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          A gift list will be automatically created for this event
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Event Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="My 30th Birthday"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">
              Occasion
            </label>
            <select
              name="occasion"
              value={formData.occasion}
              onChange={handleInputChange}
              className={`flex h-10 w-full border border-secondary bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.occasion ? "border-red-500 focus:ring-red-500" : ""
              }`}
              required
            >
              <option value="">Select an occasion</option>
              {occasionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.occasion && (
              <p className="text-sm text-red-600">{errors.occasion}</p>
            )}
          </div>

          <Input
            label="Event Date"
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleInputChange}
            error={errors.eventDate}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="flex w-full border border-secondary bg-white px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us more about this special occasion..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h4 className="font-medium text-black mb-2">What happens next:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ Your event will be created</li>
              <li>✅ A gift list will be automatically made</li>
              <li>✅ You can start adding items to your list</li>
              <li>✅ Share your list with friends and family</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/events")}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Create Event & List</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}