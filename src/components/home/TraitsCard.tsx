export interface TraitRow {
  key: string
  label: string
  value: number
  color: string
}

export interface TraitsCardProps {
  title: string
  traits: TraitRow[]
}

export function TraitsCard({ title, traits }: TraitsCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" aria-label={title}>
      <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">{title}</h2>
      <ul className="space-y-1.5 text-[11px]">
        {traits.map((t) => (
          <li key={t.key} className="flex items-center gap-2">
            <div className="w-16 shrink-0 text-[var(--color-text-secondary)]">{t.label}</div>
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-text)_10%,var(--color-background))]">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, t.value))}%`, background: t.color }} />
            </div>
            <div className="w-8 shrink-0 text-right font-[family-name:var(--font-mono)] tabular-nums text-[var(--color-text-secondary)]">{t.value}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
