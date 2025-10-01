"use client"

import { useState, useRef, useEffect } from "react"
import { GiftIcon } from "@/components/ui/Icons"

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackClassName?: string
  size?: "small" | "medium" | "large"
  lazy?: boolean
  quality?: "low" | "medium" | "high"
}

export function ProductImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  size = "large",
  lazy = true,
  quality = "medium"
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(!!src)
  const [inView, setInView] = useState(!lazy)
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, inView])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    if (retryCount < 2) {
      // Retry loading the image up to 2 times
      setRetryCount(prev => prev + 1)
      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.src = src + `?retry=${retryCount + 1}`
        }
      }, 1000 * (retryCount + 1))
    } else {
      setImageError(true)
      setIsLoading(false)
    }
  }

  // Generate optimized image URL based on quality
  const getOptimizedSrc = (originalSrc: string) => {
    if (!originalSrc) return originalSrc

    // For external images, we can't optimize much, but we can add query parameters
    // to hint at preferred quality for services that support it
    const url = new URL(originalSrc, window.location.origin)

    switch (quality) {
      case "low":
        url.searchParams.set('q', '50')
        url.searchParams.set('w', '200')
        break
      case "medium":
        url.searchParams.set('q', '75')
        url.searchParams.set('w', '400')
        break
      case "high":
        url.searchParams.set('q', '90')
        url.searchParams.set('w', '800')
        break
    }

    return url.toString()
  }

  // Size-based classes
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "aspect-square"
  }

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-12 h-12"
  }

  const textSizes = {
    small: "text-xs",
    medium: "text-xs",
    large: "text-xs"
  }

  const aspectClass = size === "large" ? "aspect-square" : sizeClasses[size]

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div
        ref={containerRef}
        className={`${aspectClass} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded ${fallbackClassName} ${className}`}
      >
        <div className="text-center">
          <GiftIcon className={`${iconSizes[size]} text-gray-400 mx-auto ${size === "large" ? "mb-2" : ""}`} />
          {size === "large" && <span className={`${textSizes[size]} text-gray-500 font-medium`}>Product Image</span>}
          {retryCount > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              Failed to load ({retryCount} retries)
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`${aspectClass} bg-gray-100 relative overflow-hidden rounded ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">
            <GiftIcon className={`${iconSizes[size]} text-gray-300`} />
          </div>
        </div>
      )}
      {retryCount > 0 && (
        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
          Retry {retryCount}
        </div>
      )}
      {inView && (
        <img
          ref={imgRef}
          src={getOptimizedSrc(src)}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-200"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: isLoading ? 0 : 1 }}
          loading={lazy ? "lazy" : "eager"}
        />
      )}
    </div>
  )
}