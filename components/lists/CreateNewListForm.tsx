"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { toast } from "react-hot-toast"

// Predefined list categories
const LIST_CATEGORIES = [
  { value: "", label: "Select a category..." },
  { value: "Birthday", label: "🎂 Birthday" },
  { value: "Christmas", label: "🎄 Christmas" },
  { value: "Wedding", label: "💍 Wedding" },
  { value: "Baby Shower", label: "👶 Baby Shower" },
  { value: "Graduation", label: "🎓 Graduation" },
  { value: "Anniversary", label: "💕 Anniversary" },
  { value: "Housewarming", label: "🏠 Housewarming" },
  { value: "Toys", label: "🧸 Toys" },
  { value: "Books", label: "📚 Books" },
  { value: "Electronics", label: "📱 Electronics" },
  { value: "Gadgets", label: "⚡ Gadgets" },
  { value: "Clothing", label: "👕 Clothing" },
  { value: "Home & Garden", label: "🏡 Home & Garden" },
  { value: "Sports", label: "⚽ Sports" },
  { value: "Travel", label: "✈️ Travel" },
  { value: "Beauty", label: "💄 Beauty" },
  { value: "Health", label: "🏃 Health & Fitness" },
  { value: "Custom", label: "✏️ Custom Name" },
]

export function CreateNewListForm() {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("")
  const [customName, setCustomName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Determine the final list name
    let listName = ""
    if (category === "Custom") {
      if (!customName.trim()) {
        setError("Custom list name is required")
        return
      }
      listName = customName.trim()
    } else if (category) {
      listName = category
    } else {
      setError("Please select a category")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to create list")
        return
      }

      const list = await response.json()
      toast.success("List created successfully! 🎉")
      router.push(`/lists/${list.id}`)
    } catch (error) {
      toast.error("Failed to create list")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What's your new list for?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="List Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              if (error) setError("")
            }}
            options={LIST_CATEGORIES}
            error={error}
            required
          />

          {category === "Custom" && (
            <Input
              label="Custom List Name"
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value)
                if (error) setError("")
              }}
              placeholder="My Special List"
              required
            />
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <p>Choose a category or create your own custom list name!</p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
              <strong>Popular categories:</strong> Birthday, Christmas, Toys, Books, Electronics, Gadgets
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create List
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}