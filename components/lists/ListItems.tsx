"use client"

import { useState } from "react"
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

  const isGuest = !currentUserId

  /** Redirect unauthenticated guests to sign-in, then back to this list. */
  const requireSignIn = () => {
    router.push(`/sign-in?callbackUrl=/lists/${list.id}`)
  }

  const handleHoldItem = async (itemId: string) => {
    if (isGuest) { requireSignIn(); return }
    try {
      const response = await fetch(`/api/items/${itemId}/hold`, { method: "POST" })
      if (!response.ok) { toast.error((await response.json()).error || "Failed to hold item"); return }
      const updatedItem = await response.json()
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item))
      toast.success("Item held — it's yours to buy!")
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

                  {item.status === "ON_HOLD" && item.heldByUser && (
                    <div className="flex items-center space-x-1.5 mb-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                      <p className="text-xs text-amber-700 font-medium">
                        Being considered by {item.heldByUser.name || "someone"}
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

                    {!list.isOwner && !isGuest && item.status === "ON_HOLD" && (
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleReleaseHold(item.id)}>
                          Release Hold
                        </Button>
                        <Button size="sm" className="w-full flex items-center space-x-2" onClick={() => handlePurchase(item)}>
                          <ShoppingCartIcon className="w-4 h-4" />
                          <span>Go to Store</span>
                        </Button>
                      </div>
                    )}

                    {/* Owner actions */}
                    {list.isOwner && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center space-x-1">
                          <EditIcon className="w-4 h-4" />
                          <span>Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center space-x-1">
                          <DeleteIcon className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
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
