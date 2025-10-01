"use client"

import { useState } from "react"
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
  heldByUser?: {
    id: string
    name: string | null
  } | null
  blockCount?: number
  isBlockedByUser?: boolean
}

interface ListItemsProps {
  list: {
    id: string
    isOwner: boolean
    user: {
      id: string
      name: string | null
      address: any
    }
    items: ListItem[]
  }
}

export function ListItems({ list }: ListItemsProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)
  const [items, setItems] = useState(list.items)

  const handleHoldItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/hold`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to hold item")
        return
      }

      const updatedItem = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId ? updatedItem : item
      ))
      toast.success("Item held successfully!")
    } catch (error) {
      toast.error("Failed to hold item")
    }
  }

  const handleReleaseHold = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/hold`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to release hold")
        return
      }

      const updatedItem = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId ? updatedItem : item
      ))
      toast.success("Hold released!")
    } catch (error) {
      toast.error("Failed to release hold")
    }
  }

  const handlePurchase = (item: ListItem) => {
    setSelectedItem(item)
    setShowPurchaseModal(true)
  }

  const handlePurchaseComplete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/purchase`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to mark as purchased")
        return
      }

      const updatedItem = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId ? updatedItem : item
      ))
      setShowPurchaseModal(false)
      setSelectedItem(null)
      toast.success("Item marked as purchased!")
    } catch (error) {
      toast.error("Failed to mark as purchased")
    }
  }

  const handleAddItem = (newItem: ListItem) => {
    setItems(prev => [newItem, ...prev])
  }

  const handleBlockItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/block`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to block item")
        return
      }

      const result = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, blockCount: result.blockCount, isBlockedByUser: true }
          : item
      ))
      toast.success("Item blocked successfully!")
    } catch (error) {
      toast.error("Failed to block item")
    }
  }

  const handleUnblockItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}/block`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to unblock item")
        return
      }

      const result = await response.json()
      setItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, blockCount: result.blockCount, isBlockedByUser: false }
          : item
      ))
      toast.success("Item unblocked!")
    } catch (error) {
      toast.error("Failed to unblock item")
    }
  }

  return (
    <div>
      {list.isOwner && (
        <div className="mb-6">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {list.isOwner ? "No items in this list yet." : "This list is currently empty."}
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
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.productName}
                  className="rounded-t-lg"
                  lazy={true}
                  quality="medium"
                />

                <div className="p-4">
                  <h3 className="font-medium text-black mb-2 line-clamp-2">
                    {item.productName}
                  </h3>

                  {item.price && (
                    <p className="text-lg font-semibold text-black mb-2">
                      {formatPrice(item.price, (item.currency || "USD") as any)}
                    </p>
                  )}

                  {item.variants && (
                    <p className="text-sm text-gray-600 mb-2">{item.variants}</p>
                  )}

                  {item.quantity && item.quantity > 1 && (
                    <p className="text-sm text-gray-600 mb-2">
                      Quantity: {item.quantity}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mb-2">
                    From {item.platform}
                  </p>

                  {item.blockCount && item.blockCount > 0 && (
                    <p className="text-sm text-orange-600 mb-2">
                      {item.blockCount} {item.blockCount === 1 ? 'person has' : 'people have'} marked this
                    </p>
                  )}

                  {item.status === "ON_HOLD" && item.heldByUser && (
                    <p className="text-sm text-gray-600 mb-3">
                      Held by {item.heldByUser.name || "Someone"}
                    </p>
                  )}

                  {item.status === "PURCHASED" && (
                    <p className="flex items-center space-x-1 text-sm text-green-600 mb-3 font-medium">
                      <CheckIcon className="w-4 h-4" />
                      <span>Purchased</span>
                    </p>
                  )}

                  <div className="flex flex-col space-y-2">
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center"
                    >
                      <Button variant="outline" size="sm" className="w-full flex items-center space-x-2">
                        <ExternalLinkIcon className="w-4 h-4" />
                        <span>View Product</span>
                      </Button>
                    </a>

                    {!list.isOwner && item.status === "WISHED" && (
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full flex items-center space-x-2"
                          onClick={() => handleHoldItem(item.id)}
                        >
                          <HeartIcon className="w-4 h-4" />
                          <span>Hold this Gift</span>
                        </Button>

                        {item.isBlockedByUser ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center space-x-2"
                            onClick={() => handleUnblockItem(item.id)}
                          >
                            <BlockIcon className="w-4 h-4" />
                            <span>Unmark Item</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center space-x-2"
                            onClick={() => handleBlockItem(item.id)}
                          >
                            <BlockIcon className="w-4 h-4" />
                            <span>Mark Item</span>
                          </Button>
                        )}
                      </div>
                    )}

                    {!list.isOwner && item.status === "ON_HOLD" && item.heldByUser && (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleReleaseHold(item.id)}
                        >
                          Release Hold
                        </Button>
                        <Button
                          size="sm"
                          className="w-full flex items-center space-x-2"
                          onClick={() => handlePurchase(item)}
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          <span>Go to Store</span>
                        </Button>
                      </div>
                    )}

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
          onClose={() => {
            setShowPurchaseModal(false)
            setSelectedItem(null)
          }}
          item={selectedItem}
          recipientAddress={list.user.address}
          onPurchaseComplete={() => handlePurchaseComplete(selectedItem.id)}
        />
      )}
    </div>
  )
}