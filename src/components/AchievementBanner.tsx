import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { AchievementUnlockEvent } from '../types'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

interface Props {
  event: AchievementUnlockEvent | null
  onDismiss: () => void
}

const reduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AchievementBanner({ event, onDismiss }: Props) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  useEffect(() => {
    if (!event) return
    const t = window.setTimeout(() => onDismiss(), 2200)
    return () => clearTimeout(t)
  }, [event, onDismiss])

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="pointer-events-none fixed left-0 right-0 top-0 z-[300] mx-auto flex max-w-[1280px] justify-center px-4 pt-[env(safe-area-inset-top)] md:pl-72"
          initial={reduced ? { opacity: 0 } : { y: -100, x: 20, rotate: -5, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div
            className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl px-4 py-3 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 120%)',
            }}
          >
            <motion.span
              className="relative text-3xl"
              initial={{ rotate: 0, scale: 0.5 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-solar)]/40" />
              {event.icon}
            </motion.span>
            <div className="min-w-0 flex-1 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-90">{s.achievements.unlockedBanner}</p>
              <p className="truncate font-[family-name:var(--font-display)] text-lg font-bold">{event.name}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
