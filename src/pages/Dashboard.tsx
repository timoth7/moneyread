import { Link } from 'react-router-dom'
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAppData } from '../hooks/useAppData'
import { getCategoryDef, getCategoryLabel } from '../constants/categories'
import { achievementMap, getAchievementName } from '../constants/achievements'
import { AnimatedAmount } from '../components/motion/AnimatedAmount'
import { QuickTemplates } from '../components/QuickTemplates'
import { dailyAvgExpense, monthBounds, prevMonthBounds, sumExpenseOnDate, sumInMonth, topExpenseCategories } from '../utils/stats'
import { toLocalISODate } from '../utils/dates'
import { formatYuan } from '../utils/money'
import { motion } from 'framer-motion'
import { WishImage } from '../components/WishImage'
import { getStrings } from '../constants/strings'

const COLORS = ['var(--color-primary)', 'var(--color-hot)', 'var(--color-electric)', 'var(--color-accent)', 'var(--color-solar)']

export function Dashboard() {
  const { records, wishes, achievements, settings } = useAppData()
  const s = getStrings(settings.language)
  const locale = settings.language === 'zh' ? 'zh-CN' : 'en-US'
  const now = new Date()
  const { start, end } = monthBounds()
  const prev = prevMonthBounds()

  const expense = sumInMonth(records, 'expense', start, end)
  const income = sumInMonth(records, 'income', start, end)
  const balance = income - expense

  const prevExpense = sumInMonth(records, 'expense', prev.start, prev.end)
  const deltaPct =
    prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 1000) / 10 : expense > 0 ? 100 : 0

  const dailyAvg = dailyAvgExpense(records, start, end)

  const top = topExpenseCategories(records, start, end, 5)
  const pieData = top.map((t) => {
    const def = getCategoryDef('expense', t.key)
    return { name: getCategoryLabel(settings.language, t.key) ?? def?.label ?? t.key, value: t.amount, emoji: def?.emoji ?? '🏷️' }
  })

  const recentAch = [...achievements]
    .filter((a) => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''))
    .slice(0, 3)

  const activeWishes = wishes.filter((w) => w.status === 'active').slice(0, 2)

  const dateLabel = now.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const hour = now.getHours()
  const greeting = hour >= 5 && hour < 12 ? s.dashboard.morning : hour >= 12 && hour < 18 ? s.dashboard.afternoon : s.dashboard.evening

  const todayIso = toLocalISODate(now)
  const todayExpense = sumExpenseOnDate(records, todayIso)
  const limitFen = settings.dailySpendingLimitFen
  const limitActive = limitFen != null && limitFen > 0
  const limitPct = limitActive ? Math.min(100, Math.round((todayExpense / limitFen) * 100)) : 0
  const overLimit = limitActive && todayExpense > limitFen!

  const listVariants = {
    animate: { transition: { staggerChildren: 0.06 } },
  }
  const itemVariants = {
    initial: { opacity: 0, y: 16, scale: 0.96 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="px-4 pb-6 pt-[max(12px,env(safe-area-inset-top))] md:px-8 md:pb-10 md:pt-8">
      <div className="mb-8 pt-4 md:pt-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-text)]">{dateLabel}</h2>
        <p className="mt-1 text-base text-[var(--color-text-secondary)]">{greeting}</p>
      </div>

      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
          {s.dashboard.thisMonth}
        </h1>
      </header>

      <QuickTemplates />

      <div className="mr-slash-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] p-6 text-white shadow-lg">
        <div className="mr-diagonal-texture pointer-events-none absolute inset-0" />
        <p className="text-sm opacity-90">{s.dashboard.thisMonthExpense}</p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-5xl font-bold tabular-nums">
          ¥<AnimatedAmount fen={expense} />
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">{s.dashboard.income}</p>
            <p className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[var(--color-accent)]">
              ¥{formatYuan(income)}
            </p>
          </div>
          <div>
            <p className="opacity-80">{s.dashboard.balance}</p>
            <p className="font-[family-name:var(--font-mono)] text-lg font-semibold">{formatYuan(balance)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <p className="text-xs text-[var(--color-text-secondary)]">{s.dashboard.dailyAverage}</p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-xl font-bold text-[var(--color-text)]">
            ¥{formatYuan(Math.round(dailyAvg))}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <p className="text-xs text-[var(--color-text-secondary)]">{s.dashboard.vsLastMonth}</p>
          <p
            className={`mt-1 font-[family-name:var(--font-mono)] text-xl font-bold ${
              deltaPct > 0 ? 'text-[var(--color-hot)]' : 'text-[var(--color-electric)]'
            }`}
          >
            {deltaPct > 0 ? '↑' : '↓'} {Math.abs(deltaPct)}%
          </p>
        </div>
      </div>

      {limitActive && (
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">{s.dashboard.dailyLimitProgress}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-background)]">
            <div
              className={`h-full rounded-full transition-colors ${overLimit ? 'bg-[var(--color-solar)]' : 'bg-[var(--color-primary)]'}`}
              style={{ width: `${limitPct}%` }}
            />
          </div>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text-secondary)]">
            ¥{formatYuan(todayExpense)} / ¥{formatYuan(limitFen!)}
          </p>
        </div>
      )}

      <section className="mt-8 md:grid md:grid-cols-5 md:gap-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">
          {s.dashboard.topCategories}
        </h2>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm md:col-span-5">
          {pieData.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#9CA3AF]">{s.dashboard.noExpenseData}</p>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`¥${formatYuan(Number(v ?? 0))}`, s.recordForm.amount]}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <motion.ul className="min-w-0 flex-1 space-y-2" variants={listVariants} initial="initial" animate="animate">
                {pieData.map((row) => (
                  <motion.li key={row.name} variants={itemVariants} className="flex items-center justify-between text-sm">
                    <span className="truncate text-[var(--color-text)]">
                      {row.emoji} {row.name}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[var(--color-hot)]">
                      ¥{formatYuan(row.value)}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 md:grid md:grid-cols-2 md:gap-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.dashboard.wishProgress}</h2>
          <Link to="/wishes" className="text-sm font-semibold text-[var(--color-primary)]">
            {s.dashboard.all}
          </Link>
        </div>
        <div className="space-y-3 md:col-span-2 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {activeWishes.length === 0 ? (
            <Link
              to="/wishes/new"
              className="block rounded-2xl border-2 border-dashed border-[var(--color-primary)]/40 bg-[var(--color-surface)] px-4 py-6 text-center text-sm font-medium text-[var(--color-primary)]"
            >
              {s.dashboard.createFirstWish}
            </Link>
          ) : (
            activeWishes.map((w) => {
              const pct = w.targetAmount > 0 ? Math.min(100, Math.round((w.savedAmount / w.targetAmount) * 100)) : 0
              return (
                <Link
                  key={w.id}
                  to={`/wishes/${w.id}`}
                  className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <WishImage src={w.icon} alt={w.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[var(--color-text)]">{w.name}</p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        ¥{formatYuan(w.savedAmount)} / ¥{formatYuan(w.targetAmount)} · {pct}%
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">{s.dashboard.recentAchievements}</h2>
          <Link to="/achievements" className="text-sm font-semibold text-[var(--color-primary)]">
            {s.achievements.title}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentAch.length === 0 ? (
            <p className="text-sm text-[#9CA3AF]">{s.dashboard.firstAchievementHint}</p>
          ) : (
            recentAch.map((a) => {
              const def = achievementMap.get(a.id)
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                >
                  <span>{def?.icon ?? '🏅'}</span>
                  <span className="font-medium text-[var(--color-text)]">{def ? getAchievementName(settings.language, def.id) : ''}</span>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
