import { motion, AnimatePresence } from 'framer-motion'
import { getStrings } from '../constants/strings'
import type { Locale } from '../constants/strings'
import { saveOnboardingComplete } from '../utils/storage'

interface Props {
  open: boolean
  step: number
  language: Locale
  onStepChange: (step: number) => void
  onClose: () => void
}

export function Onboarding({ open, step, language, onStepChange, onClose }: Props) {
  const s = getStrings(language)
  const o = s.onboarding
  const total = 4

  const dismiss = () => {
    saveOnboardingComplete()
    onClose()
  }

  const steps = [
    { title: o.step1Title, body: o.step1Body },
    { title: o.step2Title, body: o.step2Body },
    { title: o.step3Title, body: o.step3Body },
    { title: o.step4Title, body: o.step4Body },
  ]
  const idx = Math.min(Math.max(step - 1, 0), total - 1)
  const { title, body } = steps[idx]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[450] flex items-end justify-center bg-black/70 p-4 pb-[max(24px,calc(16px+env(safe-area-inset-bottom)))] backdrop-blur-md sm:items-center sm:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl ring-1 ring-black/10 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              {step}/{total}
            </p>
            <h2 id="onboarding-title" className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text)]">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{body}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={dismiss}
                className="cursor-pointer rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-background)]"
              >
                {o.skip}
              </button>
              {step < total ? (
                <button
                  type="button"
                  onClick={() => onStepChange(step + 1)}
                  className="min-w-[120px] flex-1 cursor-pointer rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                >
                  {o.next}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={dismiss}
                  className="min-w-[120px] flex-1 cursor-pointer rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                >
                  {o.getStarted}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
