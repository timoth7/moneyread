import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { ACHIEVEMENTS, getAchievementDescription, getAchievementName } from '../constants/achievements'
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
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.05 }}
      >
        {ACHIEVEMENTS.map((def) => {
          const a = map.get(def.id)
          const ok = !!a?.unlockedAt
          const hidden = def.hidden && !ok
          const name = hidden ? '???' : getAchievementName(settings.language, def.id)
          const desc = hidden ? s.achievements.hiddenDesc : getAchievementDescription(settings.language, def.id)
          return (
            <motion.div
              key={def.id}
              variants={itemVariants}
              className={`relative flex gap-3 rounded-2xl border-2 p-4 ${
                ok ? 'border-[var(--color-primary)] bg-[var(--color-background)] shadow-md' : 'border-[var(--color-border)] bg-[var(--color-surface)]'
              }`}
            >
              <div className="shrink-0 text-3xl leading-none">{hidden ? '❓' : def.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-display)] font-bold leading-snug text-[var(--color-text)]">{name}</p>
                <p
                  className={`mt-1 text-[12px] leading-snug ${
                    ok ? 'text-[var(--color-text-secondary)]' : hidden ? 'text-[#9CA3AF]' : 'text-[var(--color-text-secondary)] opacity-80'
                  }`}
                >
                  {desc}
                </p>
                {ok && a?.unlockedAt && (
                  <p className="mt-1.5 text-[11px] text-[var(--color-text-secondary)]">
                    {new Date(a.unlockedAt).toLocaleDateString(settings.language === 'zh' ? 'zh-CN' : 'en-US')}
                  </p>
                )}
                {hidden && (
                  <p className="mt-1 text-[11px] text-[#9CA3AF]">{s.achievements.hiddenHint}</p>
                )}
              </div>
              <div className="shrink-0 self-start pt-0.5 text-[#9CA3AF]">
                {ok ? (
                  <span className="text-lg text-[var(--color-primary)]" aria-hidden>
                    ✓
                  </span>
                ) : (
                  <Lock size={18} aria-hidden />
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
