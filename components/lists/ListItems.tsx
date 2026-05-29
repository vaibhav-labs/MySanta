"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { AddItemModal } from "@/components/lists/AddItemModal"
import { PurchaseModal } from "@/components/lists/PurchaseModal"
import { ProductImage } from "@/components/ui/ProductImage"
import { PlusIcon, ExternalLinkIcon, HeartIcon, EditIcon, DeleteIcon, CheckIcon, ShoppingCartIcon, BlockIcon } from "@/components/ui/Icons"
import { formatPrice } from "@/lib/currencies"
import { toast } from "react-hot-toast"

interface ListItem {
  id: string
  productName: string
  productUrl: string
  imageUrl?: string | null
  price?: number | null
  currency?: string
  variants?: string | null
  platform: string
  quantity?: number
  status: string
  heldByUser?: { id: string; name: string | null } | null
  collaboratorIds?: string | null
  blockCount?: number
  isBlockedByUser?: boolean
}

interface ListItemsProps {
  list: {
    id: string
    isOwner: boolean
    user: { id: string; name: string | null; email: string; address: string | null } | null
    items: ListItem[]
  }
  currentUserId: string | null
}

export function ListItems({ list, currentUserId }: ListItemsProps) {
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)
  const [items, setItems] = useState(list.items)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ productName: "", productUrl: "", price: "", variants: "", quantity: "1" })

  const isGuest = !currentUserId

  /** Redirect unauthenticated guests to sign-in, then back to this list. */
  const requireSignIn = () => {
    router.push(`/sign-in?callbackUrl=/lists/${list.id}`)
  }

  const handleHoldItem = async (itemId: string, collaborative = false) => {
    if (isGuest) { requireSignIn(); return }
    try {
      const response = await fetch(`/api/items/${itemId}/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collaborative })
      })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to hold item"); return }
      const updatedItem = await response.json()
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      toast.success(collaborative ? "Joined collaboration!" : "Item held — it's yours to buy!")
    } catch { toast.error("Failed to hold item") }
  }

  const handleReleaseHold = async (itemId: string) => {
    if (isGuest) { requireSignIn(); return }
    try {
      const response = await fetch(`/api/items/${itemId}/hold`, { method: "DELETE" })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to release hold"); return }
      const updatedItem = await response.json()
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      toast.success("Hold released")
    } catch { toast.error("Failed to release hold") }
  }

  const handlePurchase = (item: ListItem) => {
    if (isGuest) { requireSignIn(); return }
    setSelectedItem(item)
    setShowPurchaseModal(true)
  }

  const handlePurchaseComplete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/purchase`, { method: "POST" })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to mark as purchased"); return }
      const updatedItem = await response.json()
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      setShowPurchaseModal(false)
      setSelectedItem(null)
      toast.success("Marked as purchased!")
    } catch { toast.error("Failed to mark as purchased") }
  }

  const handleAddItem = (newItem: ListItem) => {
    setItems(prev => [newItem, ...prev])
  }

  const handleBlockItem = async (itemId: string) => {
    if (isGuest) { requireSignIn(); return }
    try {
      const response = await fetch(`/api/items/${itemId}/block`, { method: "POST" })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to mark item"); return }
      const result = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, blockCount: result.blockCount, isBlockedByUser: true } : item
      ))
      toast.success("Item marked")
    } catch { toast.error("Failed to mark item") }
  }

  const handleUnblockItem = async (itemId: string) => {
    if (isGuest) { requireSignIn(); return }
    try {
      const response = await fetch(`/api/items/${itemId}/block`, { method: "DELETE" })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to unmark item"); return }
      const result = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, blockCount: result.blockCount, isBlockedByUser: false } : item
      ))
      toast.success("Item unmarked")
    } catch { toast.error("Failed to unmark item") }
  }

  const handleCopyItem = async (itemId: string, targetListId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId: targetListId }),
      })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to copy item"); return }
      toast.success("Item saved to your list!")
    } catch { toast.error("Failed to copy item") }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/items/${itemId}`, { method: "DELETE" })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to delete item"); return }
      setItems(prev => prev.filter(item => item.id !== itemId))
      toast.success("Item deleted successfully")
    } catch { toast.error("Failed to delete item") }
  }

  const handleStartEdit = (item: ListItem) => {
    setEditingItemId(item.id)
    setEditForm({
      productName: item.productName,
      productUrl: item.productUrl,
      price: item.price?.toString() || "",
      variants: item.variants || "",
      quantity: item.quantity?.toString() || "1"
    })
  }

  const handleCancelEdit = () => {
    setEditingItemId(null)
    setEditForm({ productName: "", productUrl: "", price: "", variants: "", quantity: "1" })
  }

  const handleSaveEdit = async (itemId: string) => {
    const updates: any = {
      productName: editForm.productName,
      productUrl: editForm.productUrl,
      variants: editForm.variants || null,
      quantity: parseInt(editForm.quantity) || 1
    }

    if (editForm.price) {
      updates.price = parseFloat(editForm.price)
    }

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to update item"); return }
      const updatedItem = await response.json()
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      setEditingItemId(null)
      toast.success("Item updated successfully")
    } catch { toast.error("Failed to update item") }
  }

  return (
    <div>
      {/* Guest sign-in nudge */}
      {isGuest && (
        <div className="mb-6 flex items-center justify-between bg-brand-light border border-brand/20 rounded-xl px-5 py-4">
          <div>
            <p className="text-sm font-medium text-brand-dark">Want to buy something from this list?</p>
            <p className="text-xs text-brand/80 mt-0.5">Sign in to hold items and mark them as purchased.</p>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={requireSignIn}
            className="flex-shrink-0 ml-4"
          >
            Sign in
          </Button>
        </div>
      )}

      {/* Add item button (owner only) */}
      {list.isOwner && (
        <div className="mb-6">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-light mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-brand">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <p className="text-gray-500 mb-4 font-medium">
            {list.isOwner ? "No items yet — add your first wish!" : "This list is empty for now."}
          </p>
          {list.isOwner && (
            <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Add Your First Item</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-card-hover transition-shadow">
              <CardContent className="p-0">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.productName}
                  className="rounded-t-2xl"
                  lazy={true}
                  quality="medium"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-primary mb-1.5 line-clamp-2">{item.productName}</h3>

                  {item.price && (
                    <p className="text-lg font-bold text-primary mb-1">
                      {formatPrice(item.price, (item.currency || "USD") as any)}
                    </p>
                  )}

                  {item.variants && (
                    <p className="text-xs text-gray-500 mb-1">{item.variants}</p>
                  )}

                  {item.quantity && item.quantity > 1 && (
                    <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                  )}

                  <p className="text-xs text-gray-400 mb-2">From {item.platform}</p>

                  {item.blockCount && item.blockCount > 0 && (
                    <p className="text-xs text-amber-600 mb-2">
                      {item.blockCount} {item.blockCount === 1 ? "person is" : "people are"} interested
                    </p>
                  )}

                  {item.status === "ON_HOLD" && (
                    <div className="flex items-center space-x-1.5 mb-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                      <p className="text-xs text-amber-700 font-medium">
                        {(() => {
                          const collaborators = item.collaboratorIds ? JSON.parse(item.collaboratorIds) : []
                          const collaboratorCount = collaborators.length
                          if (collaboratorCount > 1) {
                            return `Being considered by ${collaboratorCount} people`
                          }
                          return "Being considered by someone"
                        })()
                        }
                      </p>
                    </div>
                  )}

                  {item.status === "PURCHASED" && (
                    <div className="flex items-center space-x-1.5 mb-2">
                      <CheckIcon className="w-3.5 h-3.5 text-green-600" />
                      <p className="text-xs text-green-700 font-medium">Purchased</p>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2 mt-3">
                    <a href={item.productUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full flex items-center space-x-2">
                        <ExternalLinkIcon className="w-4 h-4" />
                        <span>View Product</span>
                      </Button>
                    </a>

                    {/* Guest: show disabled-looking actions that prompt sign-in */}
                    {isGuest && item.status === "WISHED" && (
                      <Button
                        size="sm"
                        variant="danger"
                        className="w-full flex items-center space-x-2"
                        onClick={requireSignIn}
                      >
                        <HeartIcon className="w-4 h-4" />
                        <span>Sign in to hold this gift</span>
                      </Button>
                    )}

                    {/* Logged-in non-owner actions */}
                    {!list.isOwner && !isGuest && item.status === "WISHED" && (
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full flex items-center space-x-2"
                          onClick={() => handleHoldItem(item.id)}
                        >
                          <HeartIcon className="w-4 h-4" />
                          <span>Hold this Gift</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center space-x-2"
                          onClick={() => item.isBlockedByUser ? handleUnblockItem(item.id) : handleBlockItem(item.id)}
                        >
                          <BlockIcon className="w-4 h-4" />
                          <span>{item.isBlockedByUser ? "Unmark" : "Mark as interested"}</span>
                        </Button>
                      </div>
                    )}

                    {/* Collaborative holding for already held items */}
                    {!list.isOwner && !isGuest && item.status === "ON_HOLD" && (
                      (() => {
                        const collaborators = item.collaboratorIds ? JSON.parse(item.collaboratorIds) : []
                        const isCollaborating = collaborators.includes(currentUserId!)
                        const isPrimaryHolder = item.heldByUser?.id === currentUserId

                        if (isPrimaryHolder || isCollaborating) {
                          return (
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full" onClick={() => handleReleaseHold(item.id)}>
                                {isCollaborating && !isPrimaryHolder ? "Leave Collaboration" : "Release Hold"}
                              </Button>
                              <Button size="sm" className="w-full flex items-center space-x-2" onClick={() => handlePurchase(item)}>
                                <ShoppingCartIcon className="w-4 h-4" />
                                <span>Go to Store</span>
                              </Button>
                            </div>
                          )
                        } else {
                          return (
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex items-center space-x-2"
                                onClick={() => handleHoldItem(item.id, true)}
                              >
                                <HeartIcon className="w-4 h-4" />
                                <span>Join Collaboration</span>
                              </Button>
                              <p className="text-xs text-gray-500 text-center">
                                Split the cost with others
                              </p>
                            </div>
                          )
                        }
                      })()
                    )}


                    {/* Save to my list — visible to all logged-in non-owners */}
                    {!list.isOwner && !isGuest && (
                      <SaveToListPicker
                        itemId={item.id}
                        onCopy={handleCopyItem}
                      />
                    )}

                    {/* Owner actions */}
                    {list.isOwner && (
                      editingItemId === item.id ? (
                        <div className="space-y-2">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm.productName}
                              onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                              placeholder="Product name"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                            <input
                              type="url"
                              value={editForm.productUrl}
                              onChange={(e) => setEditForm({ ...editForm, productUrl: e.target.value })}
                              placeholder="Product URL"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                            <div className="flex space-x-1">
                              <input
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                placeholder="Price"
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <input
                                type="number"
                                value={editForm.quantity}
                                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                placeholder="Qty"
                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                            </div>
                            <input
                              type="text"
                              value={editForm.variants}
                              onChange={(e) => setEditForm({ ...editForm, variants: e.target.value })}
                              placeholder="Variants (optional)"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleSaveEdit(item.id)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-1"
                            onClick={() => handleStartEdit(item)}
                          >
                            <EditIcon className="w-4 h-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center justify-center space-x-1"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <DeleteIcon className="w-4 h-4" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          listId={list.id}
          onItemAdded={handleAddItem}
        />
      )}

      {showPurchaseModal && selectedItem && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => { setShowPurchaseModal(false); setSelectedItem(null) }}
          item={selectedItem}
          recipientAddress={list.user?.address || null}
          onPurchaseComplete={() => handlePurchaseComplete(selectedItem.id)}
        />
      )}
    </div>
  )
}

/* ── Inline list-picker for "Save to my list" ── */
function SaveToListPicker({
  itemId,
  onCopy,
}: {
  itemId: string
  onCopy: (itemId: string, listId: string) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [lists, setLists] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleOpen = async () => {
    if (open) { setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch("/api/lists")
      if (res.ok) {
        const data = await res.json()
        setLists(data.map((l: any) => ({ id: l.id, name: l.name })))
      }
    } catch {}
    setLoading(false)
    setOpen(true)
  }

  const handleSelect = async (listId: string) => {
    setCopying(true)
    await onCopy(itemId, listId)
    setCopying(false)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        disabled={copying}
        className="w-full flex items-center justify-center space-x-1.5 border border-secondary text-xs font-semibold py-2 px-3 hover:border-ink hover:bg-surface transition-all disabled:opacity-50"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>{copying ? "Saving..." : "Save to my list"}</span>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-secondary shadow-card-hover z-20 rounded-sm overflow-hidden">
          {loading ? (
            <p className="text-xs text-gray-400 px-3 py-2.5">Loading your lists…</p>
          ) : lists.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2.5">No lists yet — create one first.</p>
          ) : (
            lists.map(l => (
              <button
                key={l.id}
                onClick={() => handleSelect(l.id)}
                className="w-full text-left px-3 py-2.5 text-xs font-medium text-ink hover:bg-surface transition-colors border-b border-secondary last:border-b-0 truncate"
              >
                {l.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
