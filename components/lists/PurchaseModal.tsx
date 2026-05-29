"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { ProductImage } from "@/components/ui/ProductImage"
import { CopyIcon, ExternalLinkIcon, CheckIcon } from "@/components/ui/Icons"
import { formatPrice } from "@/lib/currencies"
import { toast } from "react-hot-toast"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    productName: string
    productUrl?: string | null
    imageUrl?: string | null
    price?: number | null
    currency?: string
    platform?: string | null
  }
  recipientAddress: any
  onPurchaseComplete: () => void
}

export function PurchaseModal({
  isOpen,
  onClose,
  item,
  recipientAddress,
  onPurchaseComplete,
}: PurchaseModalProps) {
  const [step, setStep] = useState<"address" | "confirm">("address")

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const formatAddress = () => {
    if (!recipientAddress) return "No address provided"

    const { line1, line2, city, state, postalCode, country } = recipientAddress
    const parts = [line1, line2, city, state, postalCode, country].filter(Boolean)
    return parts.join(", ")
  }

  const handleProceedToStore = () => {
    if (item.productUrl) window.open(item.productUrl, "_blank")
    setStep("confirm")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Purchase" size="lg">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <ProductImage
                src={item.imageUrl}
                alt={item.productName}
                size="medium"
                lazy={false}
                quality="high"
              />
              <div className="flex-1">
                <h3 className="font-medium text-black">{item.productName}</h3>
                {item.price && (
                  <p className="text-lg font-semibold text-black">
                    {formatPrice(item.price, item.currency as any)}
                  </p>
                )}
                <p className="text-sm text-gray-500">From {item.platform}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === "address" && (
          <div>
            <h3 className="font-medium text-black mb-4">Shipping Address</h3>
            <div className="bg-gray-50 border border-secondary p-4 rounded">
              <p className="text-sm text-black font-mono">
                {formatAddress()}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 flex items-center space-x-2"
                onClick={() => copyToClipboard(formatAddress())}
              >
                <CopyIcon className="w-4 h-4" />
                <span>Copy Address</span>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-black mb-2">Next Steps:</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Copy the shipping address above</li>
                <li>2. Click "Proceed to Store" to open the product page</li>
                <li>3. Add the item to your cart and proceed to checkout</li>
                <li>4. Use the copied address for shipping</li>
                <li>5. Complete your purchase on the store</li>
                <li>6. Return here and click "Confirm Purchase"</li>
              </ol>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleProceedToStore} className="flex items-center space-x-2">
                <ExternalLinkIcon className="w-4 h-4" />
                <span>Proceed to Store</span>
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-black mb-4">
                Have you completed your purchase?
              </h3>
              <p className="text-gray-600 mb-6">
                Confirming will notify the recipient that this gift has been purchased.
                Only confirm if you've successfully completed the purchase on the store.
              </p>

              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={() => setStep("address")}>
                  Go Back
                </Button>
                <Button onClick={onPurchaseComplete} className="flex items-center space-x-2">
                  <CheckIcon className="w-4 h-4" />
                  <span>Confirm Purchase</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}