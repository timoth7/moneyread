import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryLabel } from '../constants/categories'
import type { RecordItem } from '../types'
import { parseYuanInput } from '../utils/money'
import { ImpactConfirmButton } from './motion/ImpactConfirmButton'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

interface RecordSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<RecordItem, 'id' | 'createdAt'>) => void
  /** Called after a successful new submit (not used for every close path). */
  onAfterSubmit?: (data: Omit<RecordItem, 'id' | 'createdAt'>) => void
  initial?: Partial<RecordItem> | null
  title?: string
}

function RecordSheetBody({
  initial,
  title,
  onClose,
  onSubmit,
  onAfterSubmit,
}: {
  initial?: Partial<RecordItem> | null
  title: string
  onClose: () => void
  onSubmit: (data: Omit<RecordItem, 'id' | 'createdAt'>) => void
  onAfterSubmit?: (data: Omit<RecordItem, 'id' | 'createdAt'>) => void
}) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  const [amountStr, setAmountStr] = useState(() =>
    initial?.amount != null ? (initial.amount / 100).toFixed(2) : '',
  )
  const [amountError, setAmountError] = useState<string | null>(null)
  const [amountShake, setAmountShake] = useState(false)
  const [type, setType] = useState<'expense' | 'income'>(() => initial?.type ?? 'expense')
  const [category, setCategory] = useState(() => initial?.category ?? EXPENSE_CATEGORIES[0].key)
  const [note, setNote] = useState(() => initial?.note ?? '')
  const [date, setDate] = useState(() => initial?.date ?? new Date().toISOString().slice(0, 10))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [])

  const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const categorySafe = cats.some((c) => c.key === category) ? category : cats[0].key

  const handleConfirm = () => {
    const fen = parseYuanInput(amountStr)
    if (fen == null || fen === 0) return false
    const payload: Omit<RecordItem, 'id' | 'createdAt'> = {
      amount: fen,
      type,
      category: categorySafe,
      note: note.slice(0, 50) || undefined,
      date,
    }
    onSubmit(payload)
    if (!initial?.id) onAfterSubmit?.(payload)
    return true
  }

  const showAmountError = (msg: string) => {
    setAmountError(msg)
    setAmountShake(true)
    window.setTimeout(() => setAmountShake(false), 260)
    window.setTimeout(() => setAmountError(null), 1100)
  }

  const normalizeAmountInput = (raw: string): string => {
    const stripped = raw.replace(/[^0-9.]/g, '')
    let out = ''
    let hasDot = false

    for (const ch of stripped) {
      if (ch === '.') {
        if (hasDot) {
          showAmountError(s.recordForm.oneDot)
          continue
        }
        hasDot = true
        out += ch
        continue
      }
      out += ch
    }

    const dotIdx = out.indexOf('.')
    if (dotIdx !== -1) {
      const intPart = out.slice(0, dotIdx)
      const rawDec = out.slice(dotIdx + 1)
      const decPart = rawDec.slice(0, 2)
      out = `${intPart}.${decPart}`
      if (rawDec.length > 2) {
        showAmountError(s.recordForm.twoDecimal)
      }
    }

    // Prevent leading zeros except "0.".
    if (out.startsWith('0') && !out.startsWith('0.') && out.length > 1) {
      out = out.replace(/^0+/, '')
      if (out === '') out = '0'
    }

    return out
  }

  return (
    <>
      <motion.button
        type="button"
        className="fixed inset-0 z-[140] bg-black/35 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-label={s.recordForm.close}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[150] mx-auto max-w-[430px] rounded-t-2xl bg-[var(--color-background)] shadow-[0_-8px_32px_rgba(0,0,0,0.12)] md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:w-[min(620px,calc(100vw-2rem))] md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-hidden md:rounded-2xl"
        initial={{ y: '100%', scale: 0.98 }}
        animate={{ y: 0 }}
        exit={{ y: '100%', scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--color-text)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
          >
            <X size={22} />
          </button>
        </div>
        <div className="max-h-[min(78vh,640px)] overflow-y-auto px-5 pb-8 pt-4 md:max-h-[calc(90vh-84px)] md:px-6">
          <label className="block text-center">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              {s.recordForm.amount}
            </span>
            <motion.div
              animate={amountShake ? { x: [0, -7, 7, -5, 5, -3, 3, 0] } : { x: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                className="w-full border-none bg-transparent text-center font-[family-name:var(--font-mono)] text-4xl font-bold text-[var(--color-text)] outline-none placeholder:text-[#D1D5DB]"
                placeholder="0.00"
                value={amountStr}
                onInput={(e) => {
                  const input = e.currentTarget
                  const raw = input.value
                  if (/[^0-9.]/.test(raw)) {
                    showAmountError(s.recordForm.numberOnly)
                  }
                  const normalized = normalizeAmountInput(raw)
                  setAmountStr(normalized)
                }}
              />
            </motion.div>
            <span className={`mt-1 block h-5 text-xs ${amountError ? 'text-[var(--color-hot)]' : 'text-transparent'}`}>
              {amountError ?? ''}
            </span>
          </label>

          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategory(EXPENSE_CATEGORIES[0].key)
              }}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                type === 'expense' ? 'bg-[var(--color-hot)] text-white shadow-md' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              {s.recordForm.expense}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory(INCOME_CATEGORIES[0].key)
              }}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                type === 'income' ? 'bg-[var(--color-electric)] text-[var(--color-text)] shadow-md' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              {s.recordForm.income}
            </button>
          </div>

          <p className="mb-3 mt-8 text-sm font-semibold text-[var(--color-text)]">{s.recordForm.category}</p>
          <div className="grid grid-cols-3 gap-3">
            {cats.map((c) => {
              const Icon = c.icon
              const sel = categorySafe === c.key
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-3 transition ${
                    sel ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-transparent bg-[var(--color-surface)]'
                  }`}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${c.color}26` }}
                  >
                    <Icon size={22} style={{ color: c.color }} strokeWidth={2} />
                  </span>
                  <span className="text-center text-xs font-medium text-[var(--color-text)]">{getCategoryLabel(settings.language, c.key)}</span>
                </button>
              )
            })}
          </div>

          <label className="mt-6 block">
            <span className="mb-1 block text-sm font-semibold text-[var(--color-text)]">{s.recordForm.noteOptional}</span>
            <input
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
              maxLength={50}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={s.recordForm.notePlaceholder}
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-semibold text-[var(--color-text)]">{s.recordForm.date}</span>
            <input
              type="date"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <div className="mt-8">
            <ImpactConfirmButton
              type={type}
              disabled={parseYuanInput(amountStr) == null || parseYuanInput(amountStr) === 0}
              label={s.recordForm.confirm}
              onConfirm={() => {
                const ok = handleConfirm()
                if (ok) onClose()
                return ok
              }}
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export function RecordSheet({
  open,
  onClose,
  onSubmit,
  onAfterSubmit,
  initial,
  title = undefined,
}: RecordSheetProps) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  const finalTitle = title ?? s.recordForm.addRecord
  const key = `${initial?.id ?? 'new'}`

  return (
    <AnimatePresence>
      {open && (
        <RecordSheetBody
          key={key}
          initial={initial}
          title={finalTitle}
          onClose={onClose}
          onSubmit={onSubmit}
          onAfterSubmit={onAfterSubmit}
        />
      )}
    </AnimatePresence>
  )
}
