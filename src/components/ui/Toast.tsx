import { AnimatePresence, motion } from 'framer-motion'

export function Toast({
  message,
  open,
}: {
  message: string
  open: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none fixed bottom-28 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-[var(--color-text)]/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
