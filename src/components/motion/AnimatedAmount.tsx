import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatYuan } from '../../utils/money'

const reduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AnimatedAmount({ fen, className = '' }: { fen: number; className?: string }) {
  const [display, setDisplay] = useState(formatYuan(0))

  useEffect(() => {
    if (reduced) return
    const c = animate(0, fen, {
      duration: 0.65,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(formatYuan(Math.round(v))),
    })
    return () => c.stop()
  }, [fen])

  const text = reduced ? formatYuan(fen) : display
  return <span className={`font-[family-name:var(--font-mono)] tabular-nums ${className}`}>{text}</span>
}
