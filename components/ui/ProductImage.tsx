"use client"

import { useState, useRef, useEffect } from "react"

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  size?: "small" | "medium" | "large"
  lazy?: boolean
  quality?: "low" | "medium" | "high" // kept for API compat, unused
}

/** Route external product images through the server proxy to bypass hotlink protection. */
function toProxiedSrc(src: string): string {
  if (!src) return src
  // Already a relative/local URL — use as-is
  if (!src.startsWith("http://") && !src.startsWith("https://")) return src
  return `/api/proxy-image?url=${encodeURIComponent(src)}`
}

function GiftPlaceholder({ size }: { size: "small" | "medium" | "large" }) {
  const iconSize = size === "small" ? 16 : size === "medium" ? 24 : 40
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-brand-light gap-2">
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className="text-brand opacity-60">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
        <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
        <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
      </svg>
      {size === "large" && (
        <span className="text-xs text-brand/60 font-medium">No image</span>
      )}
    </div>
  )
}

export function ProductImage({
  src,
  alt,
  className = "",
  size = "large",
  lazy = true,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(!lazy)
  const containerRef = useRef<HTMLDivElement>(null)

  const proxiedSrc = src ? toProxiedSrc(src) : null

  useEffect(() => {
    // Reset state when src changes
    setFailed(false)
    setLoaded(false)
  }, [src])

  useEffect(() => {
    if (!lazy || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.1, rootMargin: "100px" }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [lazy, inView])

  const sizeClass =
    size === "small" ? "w-12 h-12" :
    size === "medium" ? "w-16 h-16" :
    "aspect-square w-full"

  return (
    <div
      ref={containerRef}
      className={`${sizeClass} relative overflow-hidden bg-brand-light ${className}`}
    >
      {(!proxiedSrc || failed) ? (
        <GiftPlaceholder size={size} />
      ) : (
        <>
          {/* Skeleton while loading */}
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-brand-light" />
          )}
          {inView && (
            <img
              src={proxiedSrc}
              alt={alt}
              loading={lazy ? "lazy" : "eager"}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: loaded ? 1 : 0 }}
            />
          )}
        </>
      )}
    </div>
  )
}
