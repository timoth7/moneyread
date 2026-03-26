import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const variants = {
  initial: prefersReduced
    ? { opacity: 0 }
    : { x: '100%', rotate: -5, opacity: 0, scale: 0.9 },
  animate: prefersReduced
    ? { opacity: 1 }
    : {
        x: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 0.8 },
      },
  exit: prefersReduced
    ? { opacity: 0 }
    : {
        x: '-30%',
        rotate: 3,
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3, ease: 'easeInOut' as const },
      },
}

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="min-h-0 flex-1"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
