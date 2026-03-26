import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getCategoryDef, getCategoryLabel } from '../constants/categories'
import { useAppData } from '../hooks/useAppData'
import type { RecordItem } from '../types'
import { formatYuan } from '../utils/money'
import { endOfWeekSunday, startOfWeekMonday, toISODate } from '../utils/dates'
import { RecordSheet } from '../components/RecordSheet'
import { CategoryFilter } from '../components/CategoryFilter'
import { getStrings } from '../constants/strings'

type Filter = 'all' | 'today' | 'week' | 'month'

function filterRange(f: Filter): { start: string; end: string } | null {
  const now = new Date()
  const today = toISODate(now)
  if (f === 'today') return { start: today, end: today }
  if (f === 'week') {
    const s = startOfWeekMonday(now)
    const e = endOfWeekSunday(now)
    return { start: toISODate(s), end: toISODate(e) }
  }
  if (f === 'month') {
    const s = new Date(now.getFullYear(), now.getMonth(), 1)
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { start: toISODate(s), end: toISODate(e) }
  }
  return null
}

export function Records() {
  const { records, deleteRecord, updateRecord, settings } = useAppData()
  const s = getStrings(settings.language)
  const locale = settings.language === 'zh' ? 'zh-CN' : 'en-US'
  const [filter, setFilter] = useState<Filter>('month')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<RecordItem | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const range = filterRange(filter)
    let list = [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (range) {
      list = list.filter((r) => r.date >= range.start && r.date <= range.end)
    }
    if (categoryFilter !== 'all') {
      list = list.filter((r) => r.type === 'expense' && r.category === categoryFilter)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((r) => (r.note ?? '').toLowerCase().includes(q))
    }
    return list
  }, [records, filter, categoryFilter, search])

  const grouped = useMemo(() => {
    const map = new Map<string, RecordItem[]>()
    for (const r of filtered) {
      const arr = map.get(r.date) ?? []
      arr.push(r)
      map.set(r.date, arr)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  const dayTotal = (items: RecordItem[]) => {
    let exp = 0
    let inc = 0
    for (const r of items) {
      if (r.type === 'expense') exp += r.amount
      else inc += r.amount
    }
    return { exp, inc }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 14, x: 8, scale: 0.96 },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="px-4 pb-6 pt-[max(12px,env(safe-area-inset-top))] md:px-8 md:pb-10 md:pt-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)] md:text-4xl">
        {s.records.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ['all', s.records.all],
            ['today', s.records.today],
            ['week', s.records.week],
            ['month', s.records.month],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === k ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        className="mt-4 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
        placeholder={s.records.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} className="mt-3" />

      <div className="mt-6 space-y-6 md:space-y-8">
        {grouped.length === 0 ? (
          <p className="py-12 text-center text-[#9CA3AF]">
            {categoryFilter === 'all' ? s.records.noRecords : s.records.noMatch}
          </p>
        ) : (
          grouped.map(([date, items], gi) => {
            const { exp, inc } = dayTotal(items)
            return (
              <div key={date}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--color-text)]">{date}</span>
                  <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-secondary)]">
                    {exp > 0 && <span className="text-[var(--color-hot)]">{s.records.expense} ¥{formatYuan(exp)}</span>}
                    {exp > 0 && inc > 0 && ' · '}
                    {inc > 0 && <span className="text-[var(--color-electric)]">{s.records.income} ¥{formatYuan(inc)}</span>}
                  </span>
                </div>
                <motion.ul
                  className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0"
                  initial="initial"
                  animate="animate"
                  transition={{ staggerChildren: 0.06, delayChildren: Math.min(gi, 3) * 0.04 }}
                >
                  {items.map((r, idx) => {
                    const def = getCategoryDef(r.type, r.category)
                    const Icon = def?.icon
                    return (
                      <motion.li
                        key={r.id}
                        variants={itemVariants}
                        custom={idx}
                        className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 shadow-sm"
                      >
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg"
                          style={{ backgroundColor: `${def?.color ?? '#999'}22` }}
                        >
                          {Icon ? <Icon size={20} color={def?.color} strokeWidth={2} /> : def?.emoji}
                        </span>
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => setEditing(r)}
                        >
                          <p className="truncate font-semibold text-[var(--color-text)]">{getCategoryLabel(settings.language, r.category)}</p>
                          {r.note && <p className="truncate text-xs text-[var(--color-text-secondary)]">{r.note}</p>}
                          <p className="text-[10px] text-[#9CA3AF]">
                            {new Date(r.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </button>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`font-[family-name:var(--font-mono)] text-base font-bold ${
                              r.type === 'expense' ? 'text-[var(--color-hot)]' : 'text-[var(--color-electric)]'
                            }`}
                          >
                            {r.type === 'expense' ? '-' : '+'}¥{formatYuan(r.amount)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                              onClick={() => setEditing(r)}
                              aria-label="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-[var(--color-hot)] hover:bg-[#FFF0F3]"
                              onClick={() => setConfirmId(r.id)}
                              aria-label="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    )
                  })}
                </motion.ul>
              </div>
            )
          })
        )}
      </div>

      <RecordSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={s.records.editRecord}
        initial={editing}
        onSubmit={(data) => {
          if (editing) {
            updateRecord(editing.id, data)
          }
        }}
      />

      {confirmId && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--color-background)] p-6 shadow-xl">
            <p className="text-center font-semibold text-[var(--color-text)]">{s.records.deleteRecordConfirm}</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-[var(--color-border)] py-3 font-semibold text-[var(--color-text-secondary)]"
                onClick={() => setConfirmId(null)}
              >
                {s.common.cancel}
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[var(--color-hot)] py-3 font-semibold text-white"
                onClick={() => {
                  deleteRecord(confirmId)
                  setConfirmId(null)
                }}
              >
                {s.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
