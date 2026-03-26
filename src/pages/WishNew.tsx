import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { parseYuanInput } from '../utils/money'
import { ImageUpload } from '../components/ImageUpload'
import { getStrings } from '../constants/strings'

export function WishNew() {
  const navigate = useNavigate()
  const { addWish, wishes, settings } = useAppData()
  const s = getStrings(settings.language)
  const [name, setName] = useState('')
  const [targetStr, setTargetStr] = useState('')
  const [icon, setIcon] = useState('')
  const [deadline, setDeadline] = useState('')
  const active = wishes.filter((w) => w.status === 'active').length

  const submit = () => {
    const fen = parseYuanInput(targetStr)
    if (!name.trim() || fen == null || fen <= 0) return
    if (active >= 5) return
    const w = addWish({
      name: name.trim(),
      targetAmount: fen,
      icon,
      deadline: deadline || undefined,
    })
    if (w) navigate(`/wishes/${w.id}`)
    else navigate('/wishes')
  }

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-[var(--color-primary)]">
        {s.common.back}
      </button>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)] [transform:rotate(-2deg)]">
        {s.wishes.createWish}
      </h1>

      <label className="mt-8 block">
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {s.wishes.name}<span className="text-[var(--color-hot)]">*</span>
        </span>
        <input
          className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-primary)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. AirPods Pro"
        />
      </label>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {s.wishes.target}<span className="text-[var(--color-hot)]">*</span>
        </span>
        <input
          inputMode="decimal"
          className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 font-[family-name:var(--font-mono)] outline-none focus:border-[var(--color-primary)]"
          value={targetStr}
          onChange={(e) => setTargetStr(e.target.value)}
          placeholder="0.00"
        />
      </label>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[var(--color-text)]">{s.wishes.imageOptional}</p>
        <div className="mt-2">
          <ImageUpload value={icon} onChange={setIcon} />
        </div>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-[var(--color-text)]">{s.wishes.deadlineOptional}</span>
        <input
          type="date"
          className="mt-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[var(--color-primary)]"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </label>

      {active >= 5 && <p className="mt-4 text-center text-sm text-[var(--color-hot)]">{s.wishes.max5}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={active >= 5}
        className="mt-10 w-full rounded-xl bg-[var(--color-primary)] py-4 font-bold text-white shadow-lg disabled:opacity-40"
      >
        {s.wishes.submit}
      </button>
    </div>
  )
}
