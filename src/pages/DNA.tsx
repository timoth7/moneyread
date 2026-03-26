import { motion } from 'framer-motion'
import { Check, Loader2, RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'
import { DNARadarChart } from '../components/DNARadarChart'
import { useAppData } from '../hooks/useAppData'
import { canGenerateDNA } from '../utils/dna-calculator'
import { BackButton } from '../components/ui/BackButton'
import { getStrings } from '../constants/strings'

export function DNAPage() {
  const { records, dna, refreshDNA, settings } = useAppData()
  const s = getStrings(settings.language)
  const locale = settings.language === 'zh' ? 'zh-CN' : 'en-US'

  const [busy, setBusy] = useState(false)
  const [showDone, setShowDone] = useState(false)

  const runRefresh = useCallback(() => {
    if (busy) return
    setBusy(true)
    setShowDone(false)
    refreshDNA()
    window.setTimeout(() => {
      setBusy(false)
      setShowDone(true)
      window.setTimeout(() => setShowDone(false), 1600)
    }, 700)
  }, [busy, refreshDNA])

  const runGenerate = useCallback(() => {
    if (busy) return
    setBusy(true)
    refreshDNA()
    window.setTimeout(() => setBusy(false), 650)
  }, [busy, refreshDNA])

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <BackButton fallback="/profile" />

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
        {s.dna.title}
      </h1>

      {!canGenerateDNA(records) ? (
        <p className="mt-6 rounded-2xl bg-[var(--color-surface)] p-6 text-center text-[var(--color-text-secondary)]">
          {s.dna.need20}
          <br />
          <span className="font-[family-name:var(--font-mono)]">
            {s.dna.current} {records.length} {s.dna.records}
          </span>
        </p>
      ) : !dna ? (
        <button
          type="button"
          disabled={busy}
          onClick={runGenerate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-4 font-bold text-white disabled:opacity-80"
        >
          {busy ? <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden /> : null}
          {busy ? s.dna.refreshing : s.dna.generate}
        </button>
      ) : (
        <>
          <motion.div
            key={dna.generatedAt}
            className="mt-6 rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-background)] p-6 shadow-lg"
            initial={{ opacity: 0.88, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <p className="text-center text-5xl">{dna.emoji}</p>
            <h2 className="mt-4 text-center font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-[var(--color-text)]">
              {dna.label}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{dna.description}</p>
          </motion.div>

          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <DNARadarChart dna={dna} />
          </div>

          <p className="mt-4 text-center text-xs text-[#9CA3AF]">
            {s.dna.updatedAt} {new Date(dna.generatedAt).toLocaleString(locale)} · {s.dna.refreshHint}
          </p>

          <motion.button
            type="button"
            disabled={busy}
            onClick={runRefresh}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-primary)] py-3 font-semibold text-[var(--color-primary)] transition-[box-shadow,ring] duration-300 disabled:cursor-wait disabled:opacity-90 ${
              showDone ? 'ring-4 ring-[var(--color-primary)]/25' : 'ring-0'
            }`}
          >
            {busy ? (
              <>
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                <span>{s.dna.refreshing}</span>
              </>
            ) : showDone ? (
              <>
                <Check className="h-5 w-5 shrink-0 text-[var(--color-electric)]" aria-hidden />
                <span className="text-[var(--color-text)]">{s.dna.refreshDone}</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 shrink-0" aria-hidden />
                <span>{s.dna.refresh}</span>
              </>
            )}
          </motion.button>
        </>
      )}
    </div>
  )
}
