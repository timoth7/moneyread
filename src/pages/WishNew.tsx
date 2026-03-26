import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { parseYuanInput } from '../utils/money'
import { tryCombineYMDParts } from '../utils/dates'
import { ImageUpload } from '../components/ImageUpload'
import { getStrings } from '../constants/strings'

export function WishNew() {
  const navigate = useNavigate()
  const { addWish, wishes, settings } = useAppData()
  const s = getStrings(settings.language)
  const [name, setName] = useState('')
  const [targetStr, setTargetStr] = useState('')
  const [icon, setIcon] = useState('')
  const [deadlineY, setDeadlineY] = useState('')
  const [deadlineM, setDeadlineM] = useState('')
  const [deadlineD, setDeadlineD] = useState('')
  const [deadlineSubmitError, setDeadlineSubmitError] = useState(false)
  const active = wishes.filter((w) => w.status === 'active').length

  const deadlineIso = useMemo(
    () => tryCombineYMDParts(deadlineY, deadlineM, deadlineD),
    [deadlineY, deadlineM, deadlineD],
  )
  const deadlinePartial =
    deadlineY.trim() !== '' || deadlineM.trim() !== '' || deadlineD.trim() !== ''
  const showDeadlineInvalid =
    deadlinePartial &&
    deadlineIso === null &&
    deadlineY.length === 4 &&
    deadlineM.trim() !== '' &&
    deadlineD.trim() !== ''

  const submit = () => {
    const fen = parseYuanInput(targetStr)
    if (!name.trim() || fen == null || fen <= 0) return
    if (active >= 5) return
    if (deadlinePartial && !deadlineIso) {
      setDeadlineSubmitError(true)
      return
    }
    setDeadlineSubmitError(false)
    const w = addWish({
      name: name.trim(),
      targetAmount: fen,
      icon,
      deadline: deadlineIso ?? undefined,
    })
    if (w) navigate(`/wishes/${w.id}`)
    else navigate('/wishes')
  }

  const baseDeadlineInput =
    'w-full rounded-xl border border-[var(--color-border)] px-3 py-3 text-center font-[family-name:var(--font-mono)] outline-none focus:border-[var(--color-primary)]'

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-[var(--color-primary)]">
        {s.common.back}
      </button>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
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

      <div className="mt-6">
        <span className="text-sm font-semibold text-[var(--color-text)]">{s.wishes.deadlineOptional}</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <label className="block min-w-0">
            <span className="mb-1 block text-center text-xs text-[var(--color-text-secondary)]">{s.wishes.deadlineYear}</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder={s.wishes.deadlinePlaceholderY}
              className={baseDeadlineInput}
              value={deadlineY}
              onChange={(e) => {
                setDeadlineY(e.target.value.replace(/\D/g, '').slice(0, 4))
                setDeadlineSubmitError(false)
              }}
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-1 block text-center text-xs text-[var(--color-text-secondary)]">{s.wishes.deadlineMonth}</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              maxLength={2}
              placeholder={s.wishes.deadlinePlaceholderM}
              className={baseDeadlineInput}
              value={deadlineM}
              onChange={(e) => {
                setDeadlineM(e.target.value.replace(/\D/g, '').slice(0, 2))
                setDeadlineSubmitError(false)
              }}
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-1 block text-center text-xs text-[var(--color-text-secondary)]">{s.wishes.deadlineDay}</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              maxLength={2}
              placeholder={s.wishes.deadlinePlaceholderD}
              className={baseDeadlineInput}
              value={deadlineD}
              onChange={(e) => {
                setDeadlineD(e.target.value.replace(/\D/g, '').slice(0, 2))
                setDeadlineSubmitError(false)
              }}
            />
          </label>
        </div>
        {(showDeadlineInvalid || deadlineSubmitError) && (
          <p className="mt-2 text-sm text-[var(--color-hot)]" role="alert">
            {s.wishes.deadlineInvalid}
          </p>
        )}
      </div>

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
