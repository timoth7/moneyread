import { Link } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { canGenerateDNA } from '../utils/dna-calculator'
import { themes, type ThemeKey } from '../constants/themes'
import { Check } from 'lucide-react'
import { getStrings } from '../constants/strings'

export function Profile() {
  const { records, achievements, dna, settings, setTheme, setLanguage, clearAllData } = useAppData()
  const unlocked = achievements.filter((a) => a.unlockedAt).length
  const s = getStrings(settings.language)

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
        {s.profile.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.profile.subtitle}</p>

      <div className="mt-8 space-y-3">
        <Link
          to="/profile/dna"
          className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm"
        >
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.dna.title}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {canGenerateDNA(records) ? (dna?.label ?? '...') : `${s.dna.need20}（${s.dna.current} ${records.length}${s.dna.records}）`}
            </p>
          </div>
          <span className="text-2xl">{dna?.emoji ?? '🧬'}</span>
        </Link>

        <Link
          to="/profile/report"
          className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm"
        >
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.report.title}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{s.profile.reportHint}</p>
          </div>
          <span className="text-2xl">📊</span>
        </Link>

        <Link
          to="/achievements"
          className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm"
        >
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.achievements.title}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{s.achievements.unlocked} {unlocked}</p>
          </div>
          <span className="text-2xl">🏆</span>
        </Link>
      </div>

      <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.profile.theme}</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {(
            [
              ['signature', s.profile.themeSignature],
              ['light', s.profile.themeLight],
              ['dark', s.profile.themeDark],
            ] as const
          ).map(([key, label]) => {
            const t = themes[key]
            const active = settings.theme === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key as ThemeKey)}
                className={`relative rounded-xl border p-3 text-left transition-[border-color,box-shadow,background-color] duration-500 ease-out ${
                  active ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30' : 'border-[var(--color-border)]'
                }`}
              >
                {active && (
                  <span className="absolute right-2 top-2 rounded-full bg-[var(--color-primary)] p-1 text-white">
                    <Check size={12} />
                  </span>
                )}
                <div className="mb-2 flex gap-2">
                  <span
                    className="h-6 w-6 rounded-full border"
                    style={{ background: t['--color-primary'], borderColor: t['--color-border'] }}
                  />
                  <span
                    className="h-6 w-6 rounded-full border"
                    style={{ background: t['--color-accent'], borderColor: t['--color-border'] }}
                  />
                </div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.profile.language}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{s.profile.languageHint}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(
            [
              ['en', s.profile.english],
              ['zh', s.profile.chinese],
            ] as const
          ).map(([key, label]) => {
            const active = settings.language === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setLanguage(key)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.profile.devTools}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{s.profile.devToolsHint}</p>
        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-[var(--color-hot)] py-3 text-sm font-semibold text-[var(--color-hot)] hover:bg-[var(--color-hot)]/10"
          onClick={() => {
            if (window.confirm(s.profile.clearDataConfirm)) {
              clearAllData()
            }
          }}
        >
          {s.profile.clearData}
        </button>
      </section>

      <footer className="mt-12 text-center text-xs text-[#9CA3AF]">
        <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-wider text-[var(--color-primary)]">
          moneyread
        </p>
        <p className="mt-1">{s.profile.localOnly}</p>
      </footer>
    </div>
  )
}
