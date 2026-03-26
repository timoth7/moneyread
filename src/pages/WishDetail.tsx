import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { formatYuan, parseYuanInput } from '../utils/money'
import { WishImage } from '../components/WishImage'
import { ImageUpload } from '../components/ImageUpload'
import { BackButton } from '../components/ui/BackButton'
import { getStrings } from '../constants/strings'

export function WishDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { wishes, depositToWish, updateWish, deleteWish, settings } = useAppData()
  const s = getStrings(settings.language)
  const [amountStr, setAmountStr] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const wish = wishes.find((w) => w.id === id)

  const hitMilestones = useMemo(() => {
    if (!wish || wish.targetAmount <= 0) return [] as number[]
    const pct = (wish.savedAmount / wish.targetAmount) * 100
    return [25, 50, 75, 100].filter((m) => pct >= m)
  }, [wish])

  if (!wish) {
    return (
      <div className="p-6 text-center text-[var(--color-text-secondary)]">
        {s.wishes.notFound}
        <button type="button" className="mt-4 block w-full text-[var(--color-primary)]" onClick={() => navigate('/wishes')}>
          {s.wishes.backToList}
        </button>
      </div>
    )
  }

  const pct = wish.targetAmount > 0 ? Math.min(100, Math.round((wish.savedAmount / wish.targetAmount) * 100)) : 0

  const deposit = () => {
    const fen = parseYuanInput(amountStr)
    if (fen == null || fen <= 0) return
    depositToWish(wish.id, fen)
    setAmountStr('')
  }

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <BackButton fallback="/wishes" />

      <div className="text-center">
        <div className="flex justify-center">
          <WishImage src={wish.icon} alt={wish.name} size={96} />
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-text)]">{wish.name}</h1>
        {wish.deadline && (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.wishes.deadline} {wish.deadline}</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
        <p className="text-sm font-semibold text-[var(--color-text)]">{s.wishes.image}</p>
        <div className="mt-2">
          <ImageUpload
            value={wish.icon}
            onChange={(nextIcon) => {
              updateWish(wish.id, { icon: nextIcon })
            }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="h-4 overflow-hidden rounded-full bg-[var(--color-background)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-2xl font-bold text-[var(--color-text)]">
          ¥{formatYuan(wish.savedAmount)} / ¥{formatYuan(wish.targetAmount)}
        </p>
        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          {pct}% · {s.wishes.milestonesReached} {hitMilestones.length > 0 ? hitMilestones.map((m) => `${m}%`).join('、') : '—'}
        </p>
      </div>

      {wish.status === 'active' && (
        <>
          <div className="mt-8">
            <p className="text-sm font-semibold text-[var(--color-text)]">{s.wishes.addDeposit}</p>
            <div className="mt-2 flex gap-2">
              <input
                inputMode="decimal"
                className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] px-4 py-3 font-[family-name:var(--font-mono)]"
                placeholder={s.wishes.amount}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
              />
              <button
                type="button"
                onClick={deposit}
                className="shrink-0 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-bold text-white"
              >
                {s.wishes.deposit}
              </button>
            </div>
          </div>

          {wish.deadline && (
            <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
              {s.wishes.planHint}
            </p>
          )}
        </>
      )}

      {wish.status === 'completed' && (
        <p className="mt-8 text-center text-lg font-bold text-[var(--color-primary)]">{s.wishes.completed}</p>
      )}

      <div className="mt-8">
        <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{s.wishes.depositRecords}</p>
        <ul className="mt-2 space-y-2">
          {wish.deposits.length === 0 ? (
            <li className="text-sm text-[#9CA3AF]">{s.wishes.noRecords}</li>
          ) : (
            [...wish.deposits]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((d) => (
                <li key={d.id} className="flex justify-between rounded-lg bg-[var(--color-background)] px-3 py-2 text-sm">
                  <span>{d.date}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[var(--color-primary)]">+¥{formatYuan(d.amount)}</span>
                </li>
              ))
          )}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        className="mt-8 w-full rounded-xl border border-[var(--color-hot)] py-3 font-semibold text-[var(--color-hot)] hover:bg-[#FFF0F3]"
      >
        {s.common.delete}
      </button>

      {confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--color-background)] p-6 shadow-xl">
            <p className="text-center font-semibold text-[var(--color-text)]">{s.wishes.deleteConfirm}</p>
            <p className="mt-1 text-center text-xs text-[#9CA3AF]">{s.wishes.bothDeleteHint}</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-[var(--color-border)] py-3 font-semibold text-[var(--color-text-secondary)]"
              >
                {s.common.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteWish(wish.id)
                  navigate('/wishes')
                }}
                className="flex-1 rounded-xl bg-[var(--color-hot)] py-3 font-semibold text-white"
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
