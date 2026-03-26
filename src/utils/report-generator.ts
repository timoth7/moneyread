import { getCategoryDef, getCategoryLabel } from '../constants/categories'
import type { RecordItem, SpendingDNA, Wish } from '../types'
import { addDays, endOfWeekSunday, parseISODate, startOfMonth, startOfWeekMonday, toISODate } from './dates'
import { formatYuan } from './money'
import type { Locale } from '../constants/strings'

export type ReportKind = 'week' | 'month'

export interface ReportData {
  kind: ReportKind
  periodLabel: string
  totalExpense: number
  dailyAvg: number
  topCategories: { key: string; label: string; emoji: string; amount: number; pct: number }[]
  maxExpense: { amount: number; category: string; note?: string } | null
  summaryLine: string
  wishSnapshot: { name: string; icon: string; pct: number }[]
  trend?: { date: string; amount: number }[]
  vsPrevPct?: number
  dna?: SpendingDNA | null
  achievementsThisPeriod?: string[]
}

function sumExpenseInRange(records: RecordItem[], start: Date, end: Date): number {
  let s = 0
  for (const r of records) {
    if (r.type !== 'expense') continue
    const d = parseISODate(r.date)
    if (d >= start && d <= end) s += r.amount
  }
  return s
}

function topCategories(
  records: RecordItem[],
  start: Date,
  end: Date,
  n: number,
  locale: Locale,
): { key: string; label: string; emoji: string; amount: number; pct: number }[] {
  const map = new Map<string, number>()
  let total = 0
  for (const r of records) {
    if (r.type !== 'expense') continue
    const d = parseISODate(r.date)
    if (d < start || d > end) continue
    total += r.amount
    map.set(r.category, (map.get(r.category) ?? 0) + r.amount)
  }
  const list = [...map.entries()]
    .map(([key, amount]) => {
      const def = getCategoryDef('expense', key)
      return {
        key,
        label: getCategoryLabel(locale, key),
        emoji: def?.emoji ?? '🏷️',
        amount,
        pct: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
      }
    })
    .sort((a, b) => b.amount - a.amount)
  return list.slice(0, n)
}

function maxSingleExpense(
  records: RecordItem[],
  start: Date,
  end: Date,
): { amount: number; category: string; note?: string } | null {
  let best: RecordItem | null = null
  for (const r of records) {
    if (r.type !== 'expense') continue
    const d = parseISODate(r.date)
    if (d < start || d > end) continue
    if (!best || r.amount > best.amount) best = r
  }
  if (!best) return null
  const def = getCategoryDef('expense', best.category)
  return {
    amount: best.amount,
    category: def?.label ?? best.category,
    note: best.note,
  }
}

export function generateReport(
  kind: ReportKind,
  records: RecordItem[],
  wishes: Wish[],
  dna: SpendingDNA | null,
  achievementNames: string[],
  anchor: Date = new Date(),
  locale: Locale = 'en',
): ReportData {
  const expenses = records.filter((r) => r.type === 'expense')
  let start: Date
  let end: Date
  let periodLabel: string

  if (kind === 'week') {
    start = startOfWeekMonday(anchor)
    end = endOfWeekSunday(anchor)
    periodLabel = locale === 'zh'
      ? `${toISODate(start).slice(5)} ~ ${toISODate(end).slice(5)} 周报`
      : `${toISODate(start).slice(5)} ~ ${toISODate(end).slice(5)} Weekly Report`
  } else {
    start = startOfMonth(anchor)
    end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999)
    periodLabel =
      locale === 'zh'
        ? `${anchor.getFullYear()}年${anchor.getMonth() + 1}月 月报`
        : anchor.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) + ' Monthly Report'
  }

  const totalExpense = sumExpenseInRange(records, start, end)
  const days =
    kind === 'week'
      ? 7
      : end.getDate()
  const dailyAvg = totalExpense / Math.max(1, days)

  const top = topCategories(records, start, end, kind === 'week' ? 3 : 5, locale)
  const maxExp = maxSingleExpense(records, start, end)

  let prevStart: Date
  let prevEnd: Date
  if (kind === 'week') {
    prevStart = addDays(start, -7)
    prevEnd = addDays(end, -7)
  } else {
    prevStart = new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1)
    prevEnd = new Date(anchor.getFullYear(), anchor.getMonth(), 0, 23, 59, 59, 999)
  }
  const prevTotal = sumExpenseInRange(records, prevStart, prevEnd)
  const vsPrevPct =
    prevTotal > 0 ? Math.round(((totalExpense - prevTotal) / prevTotal) * 1000) / 10 : undefined

  const champ = top[0]
  let summaryLine = ''
  if (champ) {
    const champLabel = getCategoryLabel(locale, champ.key)
    summaryLine =
      locale === 'zh'
        ? `本期消费冠军：${champ.emoji} ${champLabel}（¥${formatYuan(champ.amount)}）。`
        : `Top category: ${champ.emoji} ${champLabel} (¥${formatYuan(champ.amount)}).`
  }
  if (maxExp) {
    summaryLine += locale === 'zh'
      ? ` 最大单笔：¥${formatYuan(maxExp.amount)}（${maxExp.category}）。`
      : ` Biggest expense: ¥${formatYuan(maxExp.amount)} on ${maxExp.category}.`
  }
  if (vsPrevPct !== undefined) {
    summaryLine += locale === 'zh'
      ? ` 日均约 ¥${formatYuan(Math.round(dailyAvg))}，较上期${vsPrevPct >= 0 ? '增加' : '减少'} ${Math.abs(vsPrevPct)}%。`
      : ` Daily avg ¥${formatYuan(Math.round(dailyAvg))}, ${vsPrevPct >= 0 ? 'up' : 'down'} ${Math.abs(vsPrevPct)}% vs previous period.`
  }

  const wishSnapshot = wishes
    .filter((w) => w.status === 'active')
    .slice(0, 3)
    .map((w) => ({
      name: w.name,
      icon: w.icon,
      pct: w.targetAmount > 0 ? Math.min(100, Math.round((w.savedAmount / w.targetAmount) * 100)) : 0,
    }))

  const trend: { date: string; amount: number }[] | undefined =
    kind === 'month'
      ? (() => {
          const byDay = new Map<string, number>()
          for (const r of expenses) {
            const d = parseISODate(r.date)
            if (d < start || d > end) continue
            const k = r.date
            byDay.set(k, (byDay.get(k) ?? 0) + r.amount)
          }
          return [...byDay.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, amount]) => ({ date: date.slice(5), amount }))
        })()
      : undefined

  return {
    kind,
    periodLabel,
    totalExpense,
    dailyAvg,
    topCategories: top,
    maxExpense: maxExp,
    summaryLine,
    wishSnapshot,
    trend,
    vsPrevPct,
    dna: kind === 'month' ? dna : undefined,
    achievementsThisPeriod: kind === 'month' ? achievementNames : undefined,
  }
}
