"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ProductImage } from "@/components/ui/ProductImage"
import { CURRENCIES } from "@/lib/currencies"
import { toast } from "react-hot-toast"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  listId: string
  onItemAdded: (item: any) => void
}

export function AddItemModal({ isOpen, onClose, listId, onItemAdded }: AddItemModalProps) {
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [formData, setFormData] = useState({
    productUrl: "",
    productName: "",
    imageUrl: "",
    price: "",
    currency: "USD",
    variants: "",
    platform: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleScrapeUrl = async () => {
    if (!formData.productUrl) {
      setErrors(prev => ({ ...prev, productUrl: "URL is required" }))
      return
    }

    setScraping(true)
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.productUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to scrape URL")
        return
      }

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        productName: data.title || prev.productName,
        imageUrl: data.image || prev.imageUrl,
        price: data.price ? data.price.toString() : prev.price,
        currency: data.currency || prev.currency,
        platform: data.platform || prev.platform,
      }))
      toast.success("Product details loaded!")
    } catch (error) {
      toast.error("Failed to scrape URL")
    } finally {
      setScraping(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (!formData.productName || !formData.productUrl || !formData.platform) {
        const newErrors: Record<string, string> = {}
        if (!formData.productName) newErrors.productName = "Product name is required"
        if (!formData.productUrl) newErrors.productUrl = "Product URL is required"
        if (!formData.platform) newErrors.platform = "Platform is required"
        setErrors(newErrors)
        return
      }

      const response = await fetch(`/api/lists/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName,
          productUrl: formData.productUrl,
          imageUrl: formData.imageUrl || null,
          price: formData.price ? parseFloat(formData.price) : null,
          currency: formData.currency,
          variants: formData.variants || null,
          platform: formData.platform,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to add item")
        return
      }

      const newItem = await response.json()
      onItemAdded(newItem)
      toast.success("Item added successfully!")

      setFormData({
        productUrl: "",
        productName: "",
        imageUrl: "",
        price: "",
        currency: "USD",
        variants: "",
        platform: "",
      })
      onClose()
    } catch (error) {
      toast.error("Failed to add item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Item to List">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <Input
            label="Product URL"
            name="productUrl"
            value={formData.productUrl}
            onChange={handleInputChange}
            error={errors.productUrl}
            placeholder="https://..."
            className="flex-1"
          />
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleScrapeUrl}
              loading={scraping}
              disabled={scraping || !formData.productUrl}
            >
              {scraping ? "Loading..." : "Auto-fill"}
            </Button>
          </div>
        </div>

        <Input
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          error={errors.productName}
          required
        />

        <div className="space-y-2">
          <Input
            label="Image URL (Optional)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            error={errors.imageUrl}
          />
          {formData.imageUrl && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <ProductImage
                src={formData.imageUrl}
                alt={formData.productName || "Product preview"}
                size="medium"
                lazy={false}
                quality="medium"
              />
              <div className="text-sm text-gray-600">
                <span className="font-medium">Preview:</span> This is how your product image will appear
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Price (Optional)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="flex h-10 w-full border border-secondary bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Platform"
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            error={errors.platform}
            placeholder="Amazon, Etsy, etc."
            required
          />
        </div>

        <Input
          label="Variants (Optional)"
          name="variants"
          value={formData.variants}
          onChange={handleInputChange}
          error={errors.variants}
          placeholder="Size: M, Color: Blue"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Item
          </Button>
        </div>
      </form>
    </Modal>
  )
}