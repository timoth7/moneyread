import { DNARadarChart } from '../components/DNARadarChart'
import { useAppData } from '../hooks/useAppData'
import { canGenerateDNA } from '../utils/dna-calculator'
import { BackButton } from '../components/ui/BackButton'
import { getStrings } from '../constants/strings'

export function DNAPage() {
  const { records, dna, refreshDNA, settings } = useAppData()
  const s = getStrings(settings.language)
  const locale = settings.language === 'zh' ? 'zh-CN' : 'en-US'

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <BackButton fallback="/profile" />

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)] [transform:rotate(-3deg)]">
        {s.dna.title}
      </h1>

      {!canGenerateDNA(records) ? (
        <p className="mt-6 rounded-2xl bg-[var(--color-surface)] p-6 text-center text-[var(--color-text-secondary)]">
          {s.dna.need20}
          <br />
          <span className="font-[family-name:var(--font-mono)]">{s.dna.current} {records.length} {s.dna.records}</span>
        </p>
      ) : !dna ? (
        <button
          type="button"
          onClick={() => refreshDNA()}
          className="mt-6 w-full rounded-xl bg-[var(--color-primary)] py-4 font-bold text-white"
        >
          {s.dna.generate}
        </button>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-background)] p-6 shadow-lg">
            <p className="text-center text-5xl">{dna.emoji}</p>
            <h2 className="mt-4 text-center font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-[var(--color-text)] [transform:rotate(-2deg)]">
              {dna.label}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{dna.description}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <DNARadarChart dna={dna} />
          </div>

          <p className="mt-4 text-center text-xs text-[#9CA3AF]">
            {s.dna.updatedAt} {new Date(dna.generatedAt).toLocaleString(locale)} · {s.dna.refreshHint}
          </p>

          <button
            type="button"
            onClick={() => refreshDNA()}
            className="mt-6 w-full rounded-xl border-2 border-[var(--color-primary)] py-3 font-semibold text-[var(--color-primary)]"
          >
            {s.dna.refresh}
          </button>
        </>
      )}
    </div>
  )
}
