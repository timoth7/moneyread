export interface StreakCapsuleProps {
  streakDays: number
  streakLabel: string
  dayUnit: string
  nextHint: string
}

export function StreakCapsule({ streakDays, streakLabel, dayUnit, nextHint }: StreakCapsuleProps) {
  return (
    <section
      className="flex items-center gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--color-hot)_35%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-hot)_8%,var(--color-surface))] p-4"
      aria-label={`${streakLabel}: ${streakDays} ${dayUnit}`}
    >
      <div className="text-2xl mr-lab-float" aria-hidden>
        🔥
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">{streakLabel}</p>
        <p className="font-[family-name:var(--font-mono)] text-xl font-bold text-[var(--color-hot)]">
          {streakDays} {dayUnit}
        </p>
      </div>
      <p className="shrink-0 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">{nextHint}</p>
    </section>
  )
}
