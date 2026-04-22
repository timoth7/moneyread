export interface BasePairRow {
  key: string
  label: string
  color: string
  pct: number
}

export interface BasePairsCardProps {
  title: string
  countLabel: string
  rows: BasePairRow[]
  emptyText: string
}

export function BasePairsCard({ title, countLabel, rows, emptyText }: BasePairsCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" aria-label={title}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">{title}</h2>
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">{countLabel}</p>
      </div>
      {rows.length === 0 ? (
        <p className="py-4 text-center text-xs text-[var(--color-text-secondary)]">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((b) => (
            <li key={b.key} className="flex items-center gap-2">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: b.color,
                  boxShadow: `0 0 8px ${b.color}`,
                }}
              />
              <div className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--color-text)]">{b.label}</div>
              <div className="w-9 shrink-0 text-right font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-[var(--color-text-secondary)]">
                {b.pct}%
              </div>
              <div className="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-text)_10%,var(--color-background))]">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, b.pct * 2.5)}%`, background: b.color }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
