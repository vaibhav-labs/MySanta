"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { toast } from "react-hot-toast"

export function CreateListButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("List name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to create list")
        return
      }

      const list = await response.json()
      toast.success("List created successfully!")
      setIsOpen(false)
      setName("")
      router.push(`/lists/${list.id}`)
    } catch (error) {
      toast.error("Failed to create list")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Create List
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New List"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="List Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError("")
            }}
            error={error}
            placeholder="My Birthday List"
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create List
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}