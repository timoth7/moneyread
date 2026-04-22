import { Link } from 'react-router-dom'
import { formatYuan } from '../../utils/money'

export interface IncubatorCardProps {
  title: string
  wishName: string
  savedFen: number
  targetFen: number
  pct: number
  fermentingLabel: string
  todayDepositFen: number
  todayLabel: string
  depositCta: string
  wishId: string
  emptyTitle: string
  emptyCta: string
  emptyTo: string
}

export function IncubatorCard({
  title,
  wishName,
  savedFen,
  targetFen,
  pct,
  fermentingLabel,
  todayDepositFen,
  todayLabel,
  depositCta,
  wishId,
  emptyTitle,
  emptyCta,
  emptyTo,
}: IncubatorCardProps) {
  if (!wishId) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" aria-label={title}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">{title}</h2>
        <Link
          to={emptyTo}
          className="mt-3 block rounded-xl border border-dashed border-[color-mix(in_srgb,var(--color-accent)_40%,var(--color-border))] py-4 text-center text-sm font-semibold text-[var(--color-accent)]"
        >
          {emptyCta}
        </Link>
        <p className="mt-2 text-center text-[11px] text-[var(--color-text-secondary)]">{emptyTitle}</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4" aria-label={`${title}: ${wishName}`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">{title}</h2>
        <p className="font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--color-accent)]">{pct}%</p>
      </div>
      <div className="flex gap-3">
        <div
          className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--color-accent)_35%,var(--color-border))]"
          style={{
            background: `linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-accent) 8%, transparent))`,
          }}
          aria-hidden
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-accent)] to-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] transition-[height] duration-500 ease-out"
            style={{ height: `${pct}%` }}
          >
            <div className="mr-lab-pulse absolute left-0 right-0 top-0 h-0.5 bg-[color-mix(in_srgb,var(--color-background)_65%,white)]" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--color-text)]">{wishName}</p>
          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-[var(--color-text-secondary)]">
            ¥{formatYuan(savedFen)} / ¥{formatYuan(targetFen)}
          </p>
          <p className="mt-1 text-[10px] text-[var(--color-text-secondary)]">
            {fermentingLabel}
            {todayDepositFen > 0 ? ` · +¥${formatYuan(todayDepositFen)} ${todayLabel}` : ''}
          </p>
          <Link
            to={`/wishes/${wishId}`}
            className="mt-1.5 inline-block rounded border border-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--color-surface))] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--color-accent)]"
          >
            {depositCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
