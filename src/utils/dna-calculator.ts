import { EXPENSE_CATEGORIES } from '../constants/categories'
import type { RecordItem, SpendingDNA } from '../types'
import { parseISODate } from './dates'
import type { Locale } from '../constants/strings'
import { getCategoryLabel } from '../constants/categories'

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const v = values.reduce((s, x) => s + (x - mean) ** 2, 0) / values.length
  return Math.sqrt(v)
}

export function canGenerateDNA(records: RecordItem[]): boolean {
  return records.length >= 20
}

export function calculateSpendingDNA(records: RecordItem[], now = new Date(), locale: Locale = 'en'): SpendingDNA | null {
  const expenses = records.filter((r) => r.type === 'expense')
  if (expenses.length < 20) return null

  const byDay = new Map<string, number>()
  const byCat = new Map<string, number>()
  let nightScore = 0
  let count = 0

  for (const r of expenses) {
    byDay.set(r.date, (byDay.get(r.date) ?? 0) + r.amount)
    byCat.set(r.category, (byCat.get(r.category) ?? 0) + r.amount)
    const t = new Date(r.createdAt)
    const h = t.getHours()
    count++
    if (h < 6 || h >= 18) nightScore++
  }

  const total = expenses.reduce((s, r) => s + r.amount, 0)
  const daysWithExpense = byDay.size
  const rangeDays = Math.max(
    1,
    Math.ceil(
      (now.getTime() - parseISODate([...byDay.keys()].sort()[0]).getTime()) / 86400000,
    ),
  )
  const avgPerDayCount = expenses.length / rangeDays
  const frequency = clamp((avgPerDayCount / 5) * 100)

  let top1 = 0
  for (const v of byCat.values()) top1 = Math.max(top1, v)
  const concentration = clamp((top1 / total) * 100)

  const timePattern = clamp((nightScore / Math.max(1, count)) * 100)

  const dailyAmounts = [...byDay.values()]
  const vol = stdDev(dailyAmounts)
  const volatility = clamp(Math.min(100, (vol / Math.max(1, total / daysWithExpense)) * 50))

  const topCat = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'other_exp'
  const catEmoji =
    EXPENSE_CATEGORIES.find((c) => c.key === topCat)?.emoji ?? '🏷️'

  const timeWord = timePattern > 55 ? (locale === 'zh' ? '夜猫型' : 'Night Owl') : (locale === 'zh' ? '早鸟型' : 'Early Bird')
  const volWord = volatility > 55 ? (locale === 'zh' ? '大起大落' : 'Rollercoaster') : (locale === 'zh' ? '稳如泰山' : 'Steady Rock')
  const concWord = concentration > 55 ? (locale === 'zh' ? '专情玩家' : 'Loyal Spender') : (locale === 'zh' ? '雨露均沾' : 'Spread-out')
  const freqWord = frequency > 55 ? (locale === 'zh' ? '随手买买买' : 'Impulse Buyer') : (locale === 'zh' ? '极简主义者' : 'Minimalist')

  /** 用间隔符分开四段，避免中英文挤成一行难以阅读 */
  const label = `${timeWord} · ${volWord} · ${concWord} · ${freqWord}`
  const emoji = catEmoji

  const topLabel = getCategoryLabel(locale, topCat)
  const description =
    locale === 'zh'
      ? `你在「${topLabel}」上花得最多（${catEmoji}）。你的作息偏${timeWord}，消费波动${volWord}，整体风格是${concWord}。`
      : `You spend most on ${topLabel} (${catEmoji}). Your time pattern leans ${timeWord.toLowerCase()}, volatility is ${volWord === 'Rollercoaster' ? 'high' : 'stable'}, and your style is ${concWord.toLowerCase()}.`

  return {
    generatedAt: now.toISOString(),
    label,
    emoji,
    dimensions: {
      frequency,
      concentration,
      timePattern,
      volatility,
    },
    description,
  }
}

export function shouldRefreshDNA(dna: SpendingDNA | null, now = new Date()): boolean {
  if (!dna) return true
  const gen = new Date(dna.generatedAt)
  if (now.getDate() === 1 && (now.getMonth() !== gen.getMonth() || now.getFullYear() !== gen.getFullYear())) {
    return true
  }
  return false
}
