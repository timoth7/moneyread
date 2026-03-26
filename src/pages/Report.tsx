import html2canvas from 'html2canvas'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo, useRef, useState } from 'react'
import { achievementMap, getAchievementName } from '../constants/achievements'
import { useAppData } from '../hooks/useAppData'
import { generateReport, type ReportKind } from '../utils/report-generator'
import { formatYuan } from '../utils/money'
import { WishImage } from '../components/WishImage'
import { BackButton } from '../components/ui/BackButton'
import { getStrings } from '../constants/strings'

export function ReportPage() {
  const { records, wishes, dna, achievements, settings } = useAppData()
  const s = getStrings(settings.language)
  const [kind, setKind] = useState<ReportKind>('week')
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const achNames = useMemo(() => {
    return achievements
      .filter((a) => a.unlockedAt)
      .map((a) => {
        const def = achievementMap.get(a.id)
        return def ? getAchievementName(settings.language, def.id) : a.id
      })
      .slice(0, 8)
  }, [achievements, settings.language])

  const data = useMemo(
    () => generateReport(kind, records, wishes, dna, achNames, new Date(), settings.language),
    [kind, records, wishes, dna, achNames, settings.language],
  )

  const exportPng = async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `moneyread-${kind}-${Date.now()}.png`
      a.click()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="px-4 pb-10 pt-[max(12px,env(safe-area-inset-top))]">
      <BackButton fallback="/profile" />

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)] [transform:rotate(-2deg)]">
        {s.report.title}
      </h1>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setKind('week')}
          className={`flex-1 rounded-xl py-3 text-sm font-bold ${
            kind === 'week' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
          }`}
        >
          {s.report.weekly}
        </button>
        <button
          type="button"
          onClick={() => setKind('month')}
          className={`flex-1 rounded-xl py-3 text-sm font-bold ${
            kind === 'month' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
          }`}
        >
          {s.report.monthly}
        </button>
      </div>

      <div className="mt-6 flex justify-center overflow-x-auto">
        <div
          ref={cardRef}
          className="relative w-[375px] shrink-0 overflow-hidden rounded-2xl bg-[var(--color-background)] shadow-xl"
          style={{ minHeight: 667 }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 1px, transparent 12px)',
            }}
          />
          <div className="relative p-6">
            <div
              className="inline-block rounded-lg px-3 py-1 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              MoneyRead
            </div>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-text)] [transform:rotate(-2deg)]">
              {data.periodLabel}
            </h2>

            <div className="mt-6 rounded-xl bg-[var(--color-surface)] p-4">
              <p className="text-xs text-[var(--color-text-secondary)]">{s.report.totalSpending}</p>
              <p className="font-[family-name:var(--font-mono)] text-3xl font-bold text-[var(--color-hot)]">
                ¥{formatYuan(data.totalExpense)}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {s.report.dailyAvg} ¥{formatYuan(Math.round(data.dailyAvg))}
                {data.vsPrevPct != null && ` · ${s.report.vsPrevious} ${data.vsPrevPct >= 0 ? '+' : ''}${data.vsPrevPct}%`}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-[var(--color-text)]">{s.report.topCategories}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {data.topCategories.map((c) => (
                  <li key={c.key} className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>
                      {c.emoji} {c.label}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[var(--color-text)]">
                      ¥{formatYuan(c.amount)} ({c.pct}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {data.maxExpense && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {s.report.biggest} ¥{formatYuan(data.maxExpense.amount)} ({data.maxExpense.category})
              </p>
            )}

            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">{data.summaryLine}</p>

            {data.wishSnapshot.length > 0 && (
              <div className="mt-4 rounded-xl border border-[var(--color-border)] p-3">
                <p className="text-xs font-bold text-[var(--color-text-secondary)]">{s.report.wishSnapshot}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {data.wishSnapshot.map((w) => (
                    <li key={w.name} className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <WishImage src={w.icon} alt={w.name} size={20} className="rounded-md" />
                        {w.name}
                      </span>
                      <span>{w.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {kind === 'month' && data.trend && data.trend.length > 0 && (
              <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trend}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => [`¥${formatYuan(Number(v ?? 0))}`, '']} />
                    <Line type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {kind === 'month' && data.dna && (
              <div className="mt-4 rounded-xl bg-[var(--color-primary)]/10 p-3">
                <p className="text-xs font-bold text-[var(--color-primary)]">{s.report.monthDNA}</p>
                <p className="mt-1 font-bold text-[var(--color-text)]">
                  {data.dna.emoji} {data.dna.label}
                </p>
              </div>
            )}

            {kind === 'month' && data.achievementsThisPeriod && data.achievementsThisPeriod.length > 0 && (
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                {s.report.achievements} {data.achievementsThisPeriod.join(settings.language === 'zh' ? '、' : ', ')}
              </p>
            )}

            <p className="mt-8 text-center text-[10px] text-[#9CA3AF]">{s.report.footer}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={exporting}
        onClick={() => void exportPng()}
        className="mt-6 w-full rounded-xl bg-[var(--color-text)] py-4 font-bold text-white disabled:opacity-50"
      >
        {exporting ? s.report.exporting : s.report.savePng}
      </button>
    </div>
  )
}
