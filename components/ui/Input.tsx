"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-secondary bg-white px-3 py-2 text-sm text-primary placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-400 focus:ring-brand",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-brand">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export { Input }
