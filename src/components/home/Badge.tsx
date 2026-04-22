export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

const RARITY_COL: Record<BadgeRarity, string> = {
  common: 'var(--color-text-secondary)',
  rare: 'var(--color-electric)',
  epic: 'var(--color-primary-light)',
  legendary: 'var(--color-solar)',
}

export interface BadgeProps {
  icon: string
  rarity: BadgeRarity
  unlocked?: boolean
  label?: string
}

export function Badge({ icon, rarity, unlocked = true, label }: BadgeProps) {
  const col = RARITY_COL[rarity]
  return (
    <div
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      style={{
        background: unlocked
          ? `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${col} 28%, transparent), color-mix(in srgb, ${col} 6%, transparent))`
          : 'color-mix(in srgb, var(--color-text) 6%, var(--color-surface))',
        boxShadow: unlocked ? `0 0 0 1.5px ${col}, 0 0 12px color-mix(in srgb, ${col} 40%, transparent)` : 'inset 0 0 0 1.5px var(--color-border)',
      }}
      title={label}
    >
      <span
        className="text-lg leading-none"
        style={{
          filter: unlocked ? 'none' : 'grayscale(1) brightness(0.55)',
        }}
      >
        {icon}
      </span>
    </div>
  )
}
