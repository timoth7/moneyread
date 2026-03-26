import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { ACHIEVEMENTS, getAchievementName } from '../constants/achievements'
import { useAppData } from '../hooks/useAppData'
import { BackButton } from '../components/ui/BackButton'
import { getStrings } from '../constants/strings'

const itemVariants = {
  initial: { opacity: 0, y: 12, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

export function AchievementsPage() {
  const { achievements, settings } = useAppData()
  const s = getStrings(settings.language)
  const map = new Map(achievements.map((a) => [a.id, a]))
  const unlocked = achievements.filter((a) => a.unlockedAt).length

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <BackButton fallback="/" />
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
        {s.achievements.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {unlocked}/{ACHIEVEMENTS.length} {s.achievements.unlocked}
      </p>

      <motion.div
        className="mt-6 grid grid-cols-2 gap-3"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.05 }}
      >
        {ACHIEVEMENTS.map((def) => {
          const a = map.get(def.id)
          const ok = !!a?.unlockedAt
          const hidden = def.hidden && !ok
          return (
            <motion.div
              key={def.id}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-2xl border-2 p-4 ${
                ok ? 'border-[var(--color-primary)] bg-[var(--color-background)] shadow-md' : 'border-[var(--color-border)] bg-[var(--color-surface)] opacity-90'
              }`}
            >
              {!ok && (
                <div className="absolute right-2 top-2 text-[#9CA3AF]">
                  <Lock size={18} />
                </div>
              )}
              <div className="text-3xl">{hidden ? '❓' : def.icon}</div>
              <p className="mt-2 font-[family-name:var(--font-display)] font-bold text-[var(--color-text)]">
                {hidden ? s.achievements.hidden : getAchievementName(settings.language, def.id)}
              </p>
              {ok && a?.unlockedAt && (
                <p className="mt-1 text-[10px] text-[var(--color-text-secondary)]">
                  {new Date(a.unlockedAt).toLocaleDateString(settings.language === 'zh' ? 'zh-CN' : 'en-US')}
                </p>
              )}
              {hidden && <p className="mt-1 text-xs text-[#9CA3AF]">{s.achievements.hiddenHint}</p>}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
