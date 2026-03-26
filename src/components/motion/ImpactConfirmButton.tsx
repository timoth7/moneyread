import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
interface Props {
  type: 'expense' | 'income'
  disabled?: boolean
  label: string
  onConfirm: () => boolean
}

const reduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function ImpactConfirmButton({ type, disabled, label, onConfirm }: Props) {
  const [phase, setPhase] = useState<'idle' | 'anim' | 'done'>('idle')

  const handleClick = () => {
    if (disabled || phase !== 'idle') return
    if (reduced) {
      if (onConfirm()) setPhase('done')
      return
    }
    setPhase('anim')
    window.setTimeout(() => {
      const ok = onConfirm()
      if (ok) {
        setPhase('done')
        window.setTimeout(() => setPhase('idle'), 900)
      } else {
        setPhase('idle')
      }
    }, 320)
  }

  const color = type === 'expense' ? 'var(--color-hot)' : 'var(--color-electric)'

  return (
    <div className="relative flex justify-center">
      <AnimatePresence>
        {phase === 'anim' && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div
              className="h-14 w-14 rounded-full"
              style={{ backgroundColor: color, opacity: 0.35 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className="relative flex h-[52px] w-full max-w-sm items-center justify-center overflow-hidden rounded-xl font-semibold text-white shadow-lg disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)' }}
        animate={
          phase === 'anim'
            ? { scale: 0.96, borderRadius: 999 }
            : phase === 'done'
              ? { scale: [1, 1.05, 1] }
              : { scale: 1 }
        }
        transition={{ duration: 0.25 }}
      >
        <AnimatePresence mode="wait">
          {phase === 'anim' || phase === 'done' ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center justify-center"
            >
              <Check className="text-white" size={28} strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span key="txt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
