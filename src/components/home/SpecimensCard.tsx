import { ACHIEVEMENTS, getAchievementName, type AchievementDef } from '../../constants/achievements'
import type { Achievement } from '../../types'
import { Badge, type BadgeRarity } from './Badge'
import type { Locale } from '../../constants/strings'

function rarityFor(def: AchievementDef): BadgeRarity {
  switch (def.category) {
    case 'wish':
      return 'rare'
    case 'pattern':
      return 'epic'
    case 'hidden':
      return 'legendary'
    default:
      return 'common'
  }
}

export interface SpecimensCardProps {
  title: string
  achievements: Achievement[]
  locale: Locale
  emptyHint: string
}

export function SpecimensCard({ title, achievements, locale, emptyHint }: SpecimensCardProps) {
  const unlocked = new Set(achievements.filter((a) => a.unlockedAt).map((a) => a.id))
  const row = ACHIEVEMENTS.filter((d) => !d.hidden).slice(0, 5)
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length
  const overflow = Math.max(0, unlockedCount - 5)

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3" aria-label={title}>
      <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">{title}</h2>
      {unlockedCount === 0 ? (
        <p className="py-2 text-xs text-[var(--color-text-secondary)]">{emptyHint}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {row.map((def) => {
            const ok = unlocked.has(def.id)
            return (
              <Badge
                key={def.id}
                icon={def.icon}
                rarity={rarityFor(def)}
                unlocked={ok}
                label={getAchievementName(locale, def.id)}
              />
            )
          })}
          {overflow > 0 && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">
              +{overflow}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
