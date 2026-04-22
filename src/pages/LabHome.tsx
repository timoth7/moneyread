import { Link } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'
import { getCategoryDef, getCategoryLabel } from '../constants/categories'
import { QuickTemplates } from '../components/QuickTemplates'
import {
  dailyAvgExpense,
  monthBounds,
  prevMonthBounds,
  sumExpenseOnDate,
  sumInMonth,
  topExpenseCategories,
} from '../utils/stats'
import { toLocalISODate } from '../utils/dates'
import { formatYuan } from '../utils/money'
import { canGenerateDNA } from '../utils/dna-calculator'
import { computeRecordingStreak } from '../utils/achievement-rules'
import { MonthlyExpenseCard } from '../components/home/MonthlyExpenseCard'
import { StreakCapsule } from '../components/home/StreakCapsule'
import { TraitsCard } from '../components/home/TraitsCard'
import { HelixHero } from '../components/home/HelixHero'
import { BasePairsCard } from '../components/home/BasePairsCard'
import { IncubatorCard } from '../components/home/IncubatorCard'
import { SpecimensCard } from '../components/home/SpecimensCard'
import { themes, type ThemeKey } from '../constants/themes'
import type { Wish } from '../types'

function clampTrait(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function todayDepositTotal(wish: Wish, todayIso: string): number {
  return wish.deposits.filter((d) => d.date === todayIso).reduce((s, d) => s + d.amount, 0)
}

function themeTokens(theme: string) {
  const key = (theme in themes ? theme : 'signature') as ThemeKey
  return themes[key]
}

export function LabHome() {
  const { records, wishes, achievements, dna, settings } = useAppData()
  const s = getStrings(settings.language)
  const lh = s.labHome
  const locale = settings.language === 'zh' ? 'zh-CN' : 'en-US'
  const now = new Date()
  const { start, end } = monthBounds()
  const prev = prevMonthBounds()

  const th = themeTokens(settings.theme)
  const helixColors = [th['--color-accent'], th['--color-primary'], th['--color-electric'], th['--color-hot']]
  const accentPalette = [
    th['--color-accent'],
    th['--color-electric'],
    th['--color-hot'],
    th['--color-solar'],
    th['--color-primary-light'],
  ]

  const expense = sumInMonth(records, 'expense', start, end)
  const income = sumInMonth(records, 'income', start, end)
  const balance = income - expense

  const prevExpense = sumInMonth(records, 'expense', prev.start, prev.end)
  const deltaPct =
    prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 1000) / 10 : expense > 0 ? 100 : 0

  const dailyAvg = dailyAvgExpense(records, start, end)
  const top = topExpenseCategories(records, start, end, 5)
  const totalTop = top.reduce((a, t) => a + t.amount, 0) || 1

  const baseRows = top.map((t, i) => {
    const def = getCategoryDef('expense', t.key)
    const color = def?.color ?? accentPalette[i % accentPalette.length]!
    const pct = Math.round((t.amount / totalTop) * 100)
    return {
      key: t.key,
      label: getCategoryLabel(settings.language, t.key) ?? def?.label ?? t.key,
      color,
      pct,
    }
  })

  const activeWish = wishes.find((w) => w.status === 'active')
  const secondWish = wishes.filter((w) => w.status === 'active')[1]
  const todayIso = toLocalISODate(now)
  const todayDep = activeWish ? todayDepositTotal(activeWish, todayIso) : 0

  const streak = computeRecordingStreak(records)
  const nextStreakHint = lh.nextStreak.replace('{n}', String(streak + 1))

  const traits =
    dna != null
      ? [
          {
            key: 'saver',
            label: lh.traitSaver,
            value: clampTrait(100 - dna.dimensions.volatility),
            color: th['--color-accent'],
          },
          {
            key: 'explorer',
            label: lh.traitExplorer,
            value: clampTrait(100 - dna.dimensions.concentration),
            color: th['--color-electric'],
          },
          {
            key: 'impulsive',
            label: lh.traitImpulsive,
            value: clampTrait(dna.dimensions.frequency),
            color: th['--color-hot'],
          },
          {
            key: 'planner',
            label: lh.traitPlanner,
            value: clampTrait(100 - dna.dimensions.timePattern),
            color: th['--color-primary-light'],
          },
        ]
      : [
          { key: 'saver', label: lh.traitSaver, value: 0, color: th['--color-accent'] },
          { key: 'explorer', label: lh.traitExplorer, value: 0, color: th['--color-electric'] },
          { key: 'impulsive', label: lh.traitImpulsive, value: 0, color: th['--color-hot'] },
          { key: 'planner', label: lh.traitPlanner, value: 0, color: th['--color-primary-light'] },
        ]

  const specimenEyebrow = `${lh.specimen} · ${now
    .toLocaleDateString(locale, { month: 'long', year: 'numeric' })
    .toUpperCase()}`

  const needForDna = Math.max(0, 20 - records.length)
  const footerPrefix = ''
  const footerHighlight = !canGenerateDNA(records)
    ? lh.evolveInRecords.replace('{n}', String(needForDna))
    : lh.evolveMonthly

  const limitFen = settings.dailySpendingLimitFen
  const limitActive = limitFen != null && limitFen > 0
  const todayExpense = sumExpenseOnDate(records, todayIso)
  const limitPct = limitActive ? Math.min(100, Math.round((todayExpense / limitFen!) * 100)) : 0
  const overLimit = limitActive && todayExpense > limitFen!

  const basesLabel = lh.basesLine.replace('{n}', String(baseRows.length))

  const wishPct =
    activeWish && activeWish.targetAmount > 0
      ? Math.min(100, Math.round((activeWish.savedAmount / activeWish.targetAmount) * 100))
      : 0

  return (
    <div className="relative px-4 pb-8 pt-[max(12px,env(safe-area-inset-top))] md:px-6 md:pb-10 md:pt-6">
      <div className="pointer-events-none absolute inset-0 mr-lab-dot-grid opacity-50" aria-hidden />

      <div className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">{specimenEyebrow}</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-[26px] font-bold leading-tight text-[var(--color-text)] md:text-[30px]">
            {lh.yourPrefix}{' '}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-electric)] bg-clip-text italic text-transparent">
              {lh.spendingDna}
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded border border-[color-mix(in_srgb,var(--color-accent)_40%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--color-accent)]">
            ◉ {lh.active}
          </div>
          <div className="rounded border border-[var(--color-border)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">
            {lh.seq} #{String(records.length).padStart(4, '0')}
          </div>
        </div>
      </div>

      <QuickTemplates />

      <div className="relative grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
        <div className="space-y-3 lg:col-span-4">
          <MonthlyExpenseCard
            expenseFen={expense}
            incomeFen={income}
            balanceFen={balance}
            eyebrow={lh.monthlyExpense}
            incLabel={lh.inc}
            balLabel={lh.bal}
          />
          <StreakCapsule streakDays={streak} streakLabel={lh.streak} dayUnit={lh.dayUnit} nextHint={nextStreakHint} />
          <TraitsCard title={lh.traits} traits={traits} />
        </div>

        <div className="lg:col-span-4">
          <HelixHero
            recordCount={records.length}
            liveSequenceLabel={lh.liveSequence}
            recordsSuffix={lh.recordCount}
            patternLabel={lh.pattern}
            patternTitle={dna?.label ?? ''}
            patternDescription={dna?.description ?? ''}
            footerPrefix={footerPrefix}
            footerHighlight={footerHighlight}
            dnaTo="/profile/dna"
            noDnaMessage={lh.noDnaYet}
            helixColors={helixColors}
          />
        </div>

        <div className="space-y-3 lg:col-span-4">
          <BasePairsCard
            title={lh.basePairs}
            countLabel={basesLabel}
            rows={baseRows}
            emptyText={s.dashboard.noExpenseData}
          />
          <IncubatorCard
            title={lh.incubatorWish}
            wishName={activeWish?.name ?? ''}
            savedFen={activeWish?.savedAmount ?? 0}
            targetFen={activeWish?.targetAmount ?? 0}
            pct={wishPct}
            fermentingLabel={lh.fermenting}
            todayDepositFen={todayDep}
            todayLabel={lh.todayDeposit}
            depositCta={lh.depositCta}
            wishId={activeWish?.id ?? ''}
            emptyTitle={s.wishes.subtitle}
            emptyCta={s.wishes.create}
            emptyTo="/wishes/new"
          />
          {secondWish && (
            <Link
              to={`/wishes/${secondWish.id}`}
              className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-center text-xs font-semibold text-[var(--color-electric)]"
            >
              {lh.moreWishes}: {secondWish.name}
            </Link>
          )}
          <SpecimensCard
            title={lh.specimens}
            achievements={achievements}
            locale={settings.language}
            emptyHint={s.dashboard.firstAchievementHint}
          />
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{s.dashboard.dailyAverage}</p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums text-[var(--color-text)]">
            ¥{formatYuan(Math.round(dailyAvg))}
          </p>
        </section>
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{s.dashboard.vsLastMonth}</p>
          <p
            className={`mt-1 font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums ${
              deltaPct > 0 ? 'text-[var(--color-hot)]' : 'text-[var(--color-electric)]'
            }`}
          >
            {deltaPct > 0 ? '↑' : '↓'} {Math.abs(deltaPct)}%
          </p>
        </section>
        {limitActive && (
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{s.dashboard.dailyLimitProgress}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-text)_10%,var(--color-background))]">
              <div
                className={`h-full rounded-full transition-colors ${overLimit ? 'bg-[var(--color-solar)]' : 'bg-[var(--color-electric)]'}`}
                style={{ width: `${limitPct}%` }}
              />
            </div>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-xs tabular-nums text-[var(--color-text-secondary)]">
              ¥{formatYuan(todayExpense)} / ¥{formatYuan(limitFen!)}
            </p>
          </section>
        )}
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
        <Link to="/wishes" className="text-xs font-semibold text-[var(--color-electric)]">
          {s.dashboard.wishProgress} →
        </Link>
        <Link to="/achievements" className="text-xs font-semibold text-[var(--color-primary)]">
          {s.achievements.title} →
        </Link>
        <Link
          to="/home-classic"
          className="text-xs text-[var(--color-text-secondary)] underline-offset-2 hover:text-[var(--color-text)]"
        >
          {lh.classicDashboard}
        </Link>
      </div>
    </div>
  )
}
