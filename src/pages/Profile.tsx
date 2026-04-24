import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppData } from '../hooks/useAppData'

import { themes, type ThemeKey } from '../constants/themes'
import { Check } from 'lucide-react'
import { getStrings } from '../constants/strings'
import { parseYuanInput } from '../utils/money'

export function Profile() {
  const { achievements, settings, setTheme, setLanguage, patchSettings, clearAllData } = useAppData()
  const [dailyLimitStr, setDailyLimitStr] = useState('')
  const unlocked = achievements.filter((a) => a.unlockedAt).length
  const s = getStrings(settings.language)

  useEffect(() => {
    const v = settings.dailySpendingLimitFen
    if (v == null || v <= 0) setDailyLimitStr('')
    else setDailyLimitStr(String(v / 100))
  }, [settings.dailySpendingLimitFen])

  const commitDailyLimit = () => {
    const t = dailyLimitStr.trim()
    if (!t) {
      patchSettings({ dailySpendingLimitFen: null })
      return
    }
    const fen = parseYuanInput(t)
    if (fen == null || fen <= 0) patchSettings({ dailySpendingLimitFen: null })
    else patchSettings({ dailySpendingLimitFen: fen })
  }

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
        {s.profile.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.profile.subtitle}</p>

      <div className="mt-8 space-y-3">
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
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ['signature', s.profile.themeSignature],
              ['light', s.profile.themeLight],
              ['dark', s.profile.themeDark],
              ['lab', s.profile.themeLab],
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
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.profile.dailyLimit}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{s.profile.dailyLimitHint}</p>
        <input
          inputMode="decimal"
          className="mt-3 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 font-[family-name:var(--font-mono)] outline-none focus:border-[var(--color-primary)]"
          placeholder={s.profile.dailyLimitPlaceholder}
          value={dailyLimitStr}
          onChange={(e) => setDailyLimitStr(e.target.value)}
          onBlur={commitDailyLimit}
        />
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
