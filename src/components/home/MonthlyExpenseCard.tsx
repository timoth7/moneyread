import { formatYuan } from '../../utils/money'

export interface MonthlyExpenseCardProps {
  expenseFen: number
  incomeFen: number
  balanceFen: number
  eyebrow: string
  incLabel: string
  balLabel: string
}

export function MonthlyExpenseCard({ expenseFen, incomeFen, balanceFen, eyebrow, incLabel, balLabel }: MonthlyExpenseCardProps) {
  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] p-4 backdrop-blur-md"
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 22%, var(--color-surface)), color-mix(in srgb, var(--color-electric) 12%, var(--color-surface)))`,
      }}
      aria-labelledby="lab-monthly-expense-title"
    >
      <h2 id="lab-monthly-expense-title" className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
        {eyebrow}
      </h2>
      <p
        className="mt-2 whitespace-nowrap font-[family-name:var(--font-mono)] font-bold leading-none tabular-nums text-[var(--color-text)]"
        style={{ fontSize: 'clamp(22px, 3.2vw, 34px)' }}
      >
        <span className="mr-0.5 text-[var(--color-text-secondary)]">¥</span>
        {formatYuan(expenseFen)}
      </p>
      <div className="mt-3 flex gap-3 text-[11px]">
        <div>
          <span className="text-[var(--color-text-secondary)]">{incLabel} </span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums text-[var(--color-accent)]">¥{formatYuan(incomeFen)}</span>
        </div>
        <div>
          <span className="text-[var(--color-text-secondary)]">{balLabel} </span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums text-[var(--color-text)]">¥{formatYuan(balanceFen)}</span>
        </div>
      </div>
    </section>
  )
}
