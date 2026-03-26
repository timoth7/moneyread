import { EXPENSE_CATEGORIES, getCategoryLabel } from '../constants/categories'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

interface Props {
  value: string
  onChange: (key: string) => void
  className?: string
}

export function CategoryFilter({ value, onChange, className = '' }: Props) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  return (
    <div className={`-mx-1 overflow-x-auto px-1 ${className}`}>
      <div className="flex min-w-max gap-2 pb-1">
        <button
          type="button"
          onClick={() => onChange('all')}
          className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
            value === 'all'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)]'
          }`}
        >
          {s.records.all}
        </button>
        {EXPENSE_CATEGORIES.map((c) => {
          const Icon = c.icon
          const active = value === c.key
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onChange(c.key)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)]'
              }`}
            >
              <Icon size={14} />
              <span>{getCategoryLabel(settings.language, c.key)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
