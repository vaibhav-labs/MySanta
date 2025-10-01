"use client"

import { ReactNode, useEffect } from "react"
import { cn } from "@/lib/utils"
import { XMarkIcon } from "@/components/ui/Icons"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className={cn(
        "relative bg-white border border-secondary shadow-lg w-full mx-4 max-h-[90vh] overflow-auto",
        sizes[size]
      )}>
        <div className="flex items-center justify-between p-4 border-b border-secondary">
          {title && (
            <h3 className="text-lg font-medium text-black">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}