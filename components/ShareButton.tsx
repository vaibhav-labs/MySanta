"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { ShareIcon, CopyIcon } from "@/components/ui/Icons"
import { toast } from "react-hot-toast"

interface ShareButtonProps {
  title: string
  text?: string
  url: string
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ShareButton({
  title,
  text,
  url,
  variant = "outline",
  size = "sm",
  className,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    try {
      // Ensure we have the full URL
      const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title,
          text: text || `Check out this ${title} on MySanta`,
          url: fullUrl,
        })
      } else {
        // Fallback: Copy to clipboard - only copy the URL, not the text
        await navigator.clipboard.writeText(fullUrl)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      // User cancelled sharing or clipboard failed
      if (error instanceof Error && error.name !== "AbortError") {
        // Try alternative clipboard method
        try {
          const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
          const textArea = document.createElement("textarea")
          textArea.value = fullUrl
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
          toast.success("Link copied to clipboard!")
        } catch {
          toast.error("Failed to share. Please copy the URL manually.")
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      loading={isSharing}
      className={`flex items-center space-x-1 ${className || ""}`}
    >
      <ShareIcon className="w-3 h-3" />
      <span>Share</span>
    </Button>
  )
}

// Copy URL only (for clean sharing)
export function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const [isCopying, setIsCopying] = useState(false)

  const handleCopyUrl = async () => {
    setIsCopying(true)

    try {
      const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
      await navigator.clipboard.writeText(fullUrl)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      // Fallback for older browsers
      try {
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
        const textArea = document.createElement("textarea")
        textArea.value = fullUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        toast.success("Link copied to clipboard!")
      } catch {
        toast.error("Failed to copy link")
      }
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopyUrl}
      loading={isCopying}
      className={`flex items-center space-x-1 ${className || ""}`}
    >
      <CopyIcon className="w-3 h-3" />
      <span>Copy Link</span>
    </Button>
  )
}

// Specialized share buttons for different content types
export function ShareListButton({ listId, listName }: { listId: string; listName: string }) {
  return (
    <div className="flex space-x-2">
      <ShareButton
        title={listName}
        text={`Check out my gift list "${listName}" on MySanta`}
        url={`/lists/${listId}`}
      />
      <CopyLinkButton url={`/lists/${listId}`} />
    </div>
  )
}

export function ShareEventButton({ eventId, eventName }: { eventId: string; eventName: string }) {
  return (
    <ShareButton
      title={eventName}
      text={`Join my event "${eventName}" on MySanta`}
      url={`/events`}
    />
  )
}

export function ShareItemButton({
  listId,
  itemName,
  listName,
}: {
  listId: string
  itemName: string
  listName: string
}) {
  return (
    <ShareButton
      title={itemName}
      text={`Check out "${itemName}" from my list "${listName}" on MySanta`}
      url={`/lists/${listId}`}
    />
  )
}