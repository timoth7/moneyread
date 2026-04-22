import { Link } from 'react-router-dom'
import { DNAHelix } from './DNAHelix'

export interface HelixHeroProps {
  recordCount: number
  liveSequenceLabel: string
  recordsSuffix: string
  patternLabel: string
  patternTitle: string
  patternDescription: string
  footerPrefix: string
  footerHighlight: string
  dnaTo: string
  noDnaMessage: string
  helixColors: string[]
}

export function HelixHero({
  recordCount,
  liveSequenceLabel,
  recordsSuffix,
  patternLabel,
  patternTitle,
  patternDescription,
  footerPrefix,
  footerHighlight,
  dnaTo,
  noDnaMessage,
  helixColors,
}: HelixHeroProps) {
  return (
    <Link
      to={dnaTo}
      className="relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] outline-none ring-offset-2 ring-offset-[var(--color-background)] focus-visible:ring-2 focus-visible:ring-[var(--color-electric)]"
      style={{
        background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 58%), var(--color-surface)`,
      }}
      aria-label={patternTitle ? `${patternLabel}: ${patternTitle}` : noDnaMessage}
    >
      <div className="pointer-events-none absolute inset-0 mr-lab-scanlines opacity-60" />
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <div className="mr-lab-pulse h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          {liveSequenceLabel}
        </span>
      </div>
      <p className="absolute right-3 top-3 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-text-secondary)]">
        {recordCount} {recordsSuffix}
      </p>
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <DNAHelix size={220} colors={helixColors} />
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">{patternLabel}</p>
        {patternTitle ? (
          <>
            <p className="font-[family-name:var(--font-display)] mr-lab-glow-accent text-lg font-bold text-[var(--color-accent)]">{patternTitle}</p>
            <p className="mt-1 max-w-xs px-6 text-center text-[11px] text-[var(--color-text-secondary)]">{patternDescription}</p>
          </>
        ) : (
          <p className="mt-2 max-w-xs px-6 text-center text-[11px] text-[var(--color-text-secondary)]">{noDnaMessage}</p>
        )}
      </div>
      <div
        className={`pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1 text-[10px] ${
          footerPrefix ? 'justify-between' : 'justify-center'
        }`}
      >
        {footerPrefix ? (
          <span className="font-[family-name:var(--font-mono)] text-[var(--color-text-secondary)]">{footerPrefix}</span>
        ) : null}
        <span
          className={`font-[family-name:var(--font-mono)] text-[var(--color-accent)] ${footerPrefix ? 'text-right' : 'text-center'}`}
        >
          {footerHighlight}
        </span>
      </div>
    </Link>
  )
}
