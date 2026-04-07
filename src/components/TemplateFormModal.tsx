import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryLabel } from '../constants/categories'
import type { QuickTemplate, RecordItem } from '../types'
import { parseYuanInput } from '../utils/money'
import { getStrings } from '../constants/strings'
import type { Locale } from '../constants/strings'

const MAX_TEMPLATES = 8

interface Props {
  open: boolean
  language: Locale
  editing: QuickTemplate | null
  prefilled?: Omit<RecordItem, 'id' | 'createdAt'> | null
  templateCount: number
  onClose: () => void
  onSave: (t: Omit<QuickTemplate, 'id'>) => void
  onDelete?: (id: string) => void
}

export function TemplateFormModal({
  open,
  language,
  editing,
  prefilled,
  templateCount,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const s = getStrings(language)
  const t = s.templates
  const [name, setName] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].key)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!open) return
    if (editing) {
      setName(editing.name)
      setAmountStr((editing.amount / 100).toFixed(2))
      setType(editing.type)
      setCategory(editing.category)
      setNote(editing.note ?? '')
      return
    }
    if (prefilled) {
      setName(prefilled.note?.slice(0, 20) || getCategoryLabel(language, prefilled.category))
      setAmountStr((prefilled.amount / 100).toFixed(2))
      setType(prefilled.type)
      setCategory(prefilled.category)
      setNote(prefilled.note ?? '')
      return
    }
    setName('')
    setAmountStr('')
    setType('expense')
    setCategory(EXPENSE_CATEGORIES[0].key)
    setNote('')
  }, [open, editing, prefilled, language])

  const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const categorySafe = cats.some((c) => c.key === category) ? category : cats[0].key

  const handleSave = () => {
    const fen = parseYuanInput(amountStr)
    if (!name.trim() || fen == null || fen <= 0) return
    if (!editing && templateCount >= MAX_TEMPLATES) return
    onSave({
      name: name.trim(),
      amount: fen,
      type,
      category: categorySafe,
      note: note.slice(0, 50) || undefined,
    })
    onClose()
  }

  const atMax = !editing && templateCount >= MAX_TEMPLATES

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">
              {editing ? t.editTitle : t.newTitle}
            </h2>
            {atMax && <p className="mt-2 text-sm text-[var(--color-hot)]">{s.dashboard.templatesMax}</p>}

            <label className="mt-4 block">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{t.name}</span>
              <input
                className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="mt-3 block">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{s.recordForm.amount}</span>
              <input
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-3 py-2.5 font-[family-name:var(--font-mono)] outline-none focus:border-[var(--color-primary)]"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
              />
            </label>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                  type === 'expense' ? 'bg-[var(--color-hot)]/15 text-[var(--color-hot)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                {s.recordForm.expense}
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                  type === 'income' ? 'bg-[var(--color-electric)]/15 text-[var(--color-electric)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                }`}
              >
                {s.recordForm.income}
              </button>
            </div>

            <p className="mt-3 text-xs font-semibold text-[var(--color-text-secondary)]">{s.recordForm.category}</p>
            <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
              {cats.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    categorySafe === c.key ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-background)] text-[var(--color-text)]'
                  }`}
                >
                  {c.emoji} {getCategoryLabel(language, c.key)}
                </button>
              ))}
            </div>

            <label className="mt-3 block">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{s.recordForm.noteOptional}</span>
              <input
                className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-3 py-2.5 outline-none focus:border-[var(--color-primary)]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={50}
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-2">
              {editing && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(t.deleteConfirm)) {
                      onDelete(editing.id)
                      onClose()
                    }
                  }}
                  className="rounded-xl border border-[var(--color-hot)] px-4 py-2.5 text-sm font-semibold text-[var(--color-hot)]"
                >
                  {t.delete}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                {s.common.cancel}
              </button>
              <button
                type="button"
                disabled={atMax}
                onClick={handleSave}
                className="flex-1 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
              >
                {t.save}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
