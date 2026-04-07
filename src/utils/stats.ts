import type { RecordItem } from '../types'
import { parseISODate } from './dates'

export function monthBounds(d = new Date()) {
  const y = d.getFullYear()
  const m = d.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999)
  return { start, end, y, m }
}

export function prevMonthBounds(d = new Date()) {
  const y = d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear()
  const m = d.getMonth() === 0 ? 11 : d.getMonth() - 1
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

export function sumExpenseOnDate(records: RecordItem[], isoDate: string): number {
  let s = 0
  for (const r of records) {
    if (r.type === 'expense' && r.date === isoDate) s += r.amount
  }
  return s
}

export function sumInMonth(
  records: RecordItem[],
  type: 'expense' | 'income',
  start: Date,
  end: Date,
): number {
  let s = 0
  for (const r of records) {
    if (r.type !== type) continue
    const d = parseISODate(r.date)
    if (d >= start && d <= end) s += r.amount
  }
  return s
}

export function dailyAvgExpense(records: RecordItem[], start: Date, end: Date): number {
  const days = end.getDate()
  const exp = sumInMonth(records, 'expense', start, end)
  return exp / Math.max(1, days)
}

export function topExpenseCategories(
  records: RecordItem[],
  start: Date,
  end: Date,
  n: number,
): { key: string; amount: number }[] {
  const map = new Map<string, number>()
  for (const r of records) {
    if (r.type !== 'expense') continue
    const d = parseISODate(r.date)
    if (d < start || d > end) continue
    map.set(r.category, (map.get(r.category) ?? 0) + r.amount)
  }
  return [...map.entries()]
    .map(([key, amount]) => ({ key, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n)
}
