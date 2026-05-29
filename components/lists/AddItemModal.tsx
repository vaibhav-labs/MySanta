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

type ItemType = "PRODUCT" | "OFFLINE" | "EXPERIENCE"

const TABS: { key: ItemType; label: string; sub: string }[] = [
  { key: "PRODUCT",    label: "Online",     sub: "From any website" },
  { key: "OFFLINE",    label: "Offline",    sub: "Not sold online" },
  { key: "EXPERIENCE", label: "Experience", sub: "Tickets, classes, trips" },
]

const EMPTY = {
  productUrl: "",
  productName: "",
  imageUrl: "",
  price: "",
  currency: "USD",
  variants: "",
  platform: "",
  notes: "",
  location: "",
  experienceDate: "",
}

export function AddItemModal({ isOpen, onClose, listId, onItemAdded }: AddItemModalProps) {
  const [itemType, setItemType] = useState<ItemType>("PRODUCT")
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [formData, setFormData] = useState({ ...EMPTY })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
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
        toast.error(error.error || "Couldn't auto-fill from that URL")
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
      toast.success("Details pulled in.")
    } catch {
      toast.error("Couldn't auto-fill from that URL")
    } finally {
      setScraping(false)
    }
  }

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.productName) errs.productName = "Name is required"
    if (itemType === "PRODUCT") {
      if (!formData.productUrl) errs.productUrl = "URL is required for online items"
      if (!formData.platform) errs.platform = "Where is it from?"
    }
    if (itemType === "OFFLINE") {
      if (!formData.platform) errs.platform = "Store / brand is required"
    }
    if (itemType === "EXPERIENCE") {
      if (!formData.platform) errs.platform = "Provider / host is required"
    }
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) { setLoading(false); return }

    try {
      const payload: any = {
        productName: formData.productName,
        productUrl: formData.productUrl || null,
        imageUrl: formData.imageUrl || null,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        variants: formData.variants || null,
        platform: formData.platform || null,
        itemType,
        notes: formData.notes || null,
        location: formData.location || null,
        experienceDate: formData.experienceDate || null,
      }

      const response = await fetch(`/api/lists/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Couldn't add the item")
        return
      }

      const newItem = await response.json()
      onItemAdded(newItem)
      toast.success("Added.")
      setFormData({ ...EMPTY })
      onClose()
    } catch {
      toast.error("Couldn't add the item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to this list">
      {/* Type tabs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {TABS.map(t => {
          const active = itemType === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => { setItemType(t.key); setErrors({}) }}
              className="text-left p-3 border transition-all"
              style={active
                ? { background: '#0D0D0D', color: '#FFD600', borderColor: '#0D0D0D' }
                : { background: '#FFFFFF', color: '#6B7280', borderColor: '#E8E8E8' }
              }
            >
              <p className="text-xs font-bold uppercase tracking-widest">{t.label}</p>
              <p className="text-[10px] mt-1" style={{ color: active ? 'rgba(255,255,255,0.55)' : '#9CA3AF' }}>{t.sub}</p>
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {itemType === "PRODUCT" && (
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
        )}

        <Input
          label={
            itemType === "EXPERIENCE" ? "Experience name" :
            itemType === "OFFLINE" ? "Item name" :
            "Product name"
          }
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          error={errors.productName}
          required
          placeholder={
            itemType === "EXPERIENCE" ? "e.g. Pottery class for two" :
            itemType === "OFFLINE" ? "e.g. Handmade leather wallet" :
            "Product name"
          }
        />

        <div className="space-y-2">
          <Input
            label="Image URL (optional)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            error={errors.imageUrl}
          />
          {formData.imageUrl && (
            <div className="flex items-center space-x-3 p-3 bg-surface">
              <ProductImage
                src={formData.imageUrl}
                alt={formData.productName || "Preview"}
                size="medium"
                lazy={false}
                quality="medium"
              />
              <div className="text-xs text-gray-500">Preview</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Price (optional)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="flex h-10 w-full border border-secondary bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
          </div>
          <Input
            label={
              itemType === "EXPERIENCE" ? "Provider / host" :
              itemType === "OFFLINE" ? "Store / brand" :
              "Platform"
            }
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            error={errors.platform}
            placeholder={
              itemType === "EXPERIENCE" ? "e.g. BookMyShow, Airbnb" :
              itemType === "OFFLINE" ? "e.g. Local market, Crafted by..." :
              "Amazon, Etsy, etc."
            }
            required={itemType === "PRODUCT"}
          />
        </div>

        {itemType === "EXPERIENCE" && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date (optional)"
              name="experienceDate"
              type="date"
              value={formData.experienceDate}
              onChange={handleInputChange}
            />
            <Input
              label="Location (optional)"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Bandra, Mumbai"
            />
          </div>
        )}

        {itemType === "OFFLINE" && (
          <Input
            label="Where to find it (optional)"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g. Bandra weekend market, Stall #14"
          />
        )}

        {itemType === "PRODUCT" && (
          <Input
            label="Variants (optional)"
            name="variants"
            value={formData.variants}
            onChange={handleInputChange}
            error={errors.variants}
            placeholder="Size: M, Colour: Blue"
          />
        )}

        {(itemType === "OFFLINE" || itemType === "EXPERIENCE") && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="flex w-full border border-secondary bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={
                itemType === "EXPERIENCE"
                  ? "Anything that helps — preferred time slot, who to call, special requests."
                  : "Anything that helps the buyer find or pick it — colour, size, where exactly to look."
              }
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add to list
          </Button>
        </div>
      </form>
    </Modal>
  )
}
