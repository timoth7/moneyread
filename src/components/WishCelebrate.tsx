import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { Wish } from '../types'
import { WishImage } from './WishImage'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

interface Props {
  wish: Wish | null
  onClose: () => void
}

const reduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function WishCelebrate({ wish, onClose }: Props) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  useEffect(() => {
    if (!wish || reduced) return
    const end = Date.now() + 1200
    const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-hot)', 'var(--color-electric)', 'var(--color-solar)']
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [wish])

  return (
    <AnimatePresence>
      {wish && (
        <motion.div
          className="fixed inset-0 z-[400] flex cursor-pointer flex-col items-center justify-center bg-[var(--color-background)]/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <WishImage src={wish.icon} alt={wish.name} size={108} className="rounded-2xl border-2 border-white/50" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-primary)]">
              {s.wishes.grantedTitle}
            </h2>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">{wish.name}</p>
            <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
              {s.common.closeAnywhere}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
