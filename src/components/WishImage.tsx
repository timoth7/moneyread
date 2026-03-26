interface WishImageProps {
  src: string
  alt: string
  size?: number
  className?: string
}

function isImageUrl(value: string): boolean {
  return value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://')
}

export function WishImage({ src, alt, size = 48, className = '' }: WishImageProps) {
  const baseClass = `overflow-hidden rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] ${className}`
  if (src && isImageUrl(src)) {
    return (
      <div className={baseClass} style={{ width: size, height: size }}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className={baseClass} style={{ width: size, height: size }} aria-label="Default wish image">
      <img src="/favicon.svg" alt="moneyread logo" className="h-full w-full object-cover" />
    </div>
  )
}
