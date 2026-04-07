import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { getStrings } from '../constants/strings'
import { formatYuan } from '../utils/money'

interface Props {
  spentFen: number
  limitFen: number
  language: 'en' | 'zh'
  onDismiss: () => void
}

export function DailyLimitBanner({ spentFen, limitFen, language, onDismiss }: Props) {
  const s = getStrings(language)
  const body = s.dailyLimit.bannerBody
    .replace('{spent}', formatYuan(spentFen))
    .replace('{limit}', formatYuan(limitFen))

  /* 只在本条横幅挂载时启动一次计时；勿把 spent/limit 放进依赖，否则连续记账更新金额会反复重置 4s 定时器 */
  useEffect(() => {
    const t = window.setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <AnimatePresence>
      <motion.button
        type="button"
        className="pointer-events-auto fixed left-0 right-0 top-0 z-[320] mx-auto flex max-w-[1280px] justify-center px-4 pt-[env(safe-area-inset-top)] md:pl-72"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={onDismiss}
      >
        <div
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-[var(--color-solar)]/80 px-4 py-3 text-left shadow-xl"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-solar) 22%, var(--color-surface)) 0%, var(--color-surface) 100%)',
          }}
        >
          <span className="text-2xl" aria-hidden>
            ⚠️
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text)]">{s.dailyLimit.bannerTitle}</p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--color-text)]">{body}</p>
          </div>
        </div>
      </motion.button>
    </AnimatePresence>
  )
}
