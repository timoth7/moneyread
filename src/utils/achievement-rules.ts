import { EXPENSE_CATEGORIES } from '../constants/categories'
import type { Achievement, RecordItem, Wish } from '../types'
import { ACHIEVEMENTS } from '../constants/achievements'
import { addDays, daysInMonth, parseISODate, toISODate } from './dates'

function recordingDates(records: RecordItem[]): Set<string> {
  const s = new Set<string>()
  for (const r of records) {
    s.add(r.date)
  }
  return s
}

export function computeRecordingStreak(records: RecordItem[]): number {
  const set = recordingDates(records)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cur = new Date(today)
  if (!set.has(toISODate(cur))) {
    cur.setDate(cur.getDate() - 1)
  }
  if (!set.has(toISODate(cur))) return 0
  let streak = 0
  while (set.has(toISODate(cur))) {
    streak++
    cur.setDate(cur.getDate() - 1)
  }
  return streak
}

function monthExpenseIncome(
  records: RecordItem[],
  year: number,
  monthIndex: number,
): { expense: number; income: number } {
  let expense = 0
  let income = 0
  for (const r of records) {
    const d = parseISODate(r.date)
    if (d.getFullYear() !== year || d.getMonth() !== monthIndex) continue
    if (r.type === 'expense') expense += r.amount
    else income += r.amount
  }
  return { expense, income }
}

function hasZeroSpendDay(records: RecordItem[]): boolean {
  const expenseDays = new Set<string>()
  for (const r of records) {
    if (r.type === 'expense') expenseDays.add(r.date)
  }
  if (expenseDays.size === 0) return false
  const dates = [...expenseDays].sort()
  const first = parseISODate(dates[0])
  const last = parseISODate(dates[dates.length - 1])
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    const key = toISODate(new Date(d))
    if (!expenseDays.has(key)) return true
  }
  return false
}

function lastCompletedWeekendExpense(records: RecordItem[]): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const cur = new Date(d)
  while (cur.getDay() !== 6) {
    cur.setDate(cur.getDate() - 1)
  }
  if (toISODate(cur) >= toISODate(d)) {
    cur.setDate(cur.getDate() - 7)
  }
  const satStr = toISODate(cur)
  const sunStr = toISODate(addDays(cur, 1))
  let sum = 0
  for (const r of records) {
    if (r.type !== 'expense') continue
    if (r.date === satStr || r.date === sunStr) sum += r.amount
  }
  return sum
}

export interface CheckContext {
  records: RecordItem[]
  wishes: Wish[]
  existing: Map<string, Achievement>
}

export function checkAchievements(ctx: CheckContext): string[] {
  const { records, wishes, existing } = ctx
  const unlocked: string[] = []
  const alreadyUnlocked = (id: string) => !!existing.get(id)?.unlockedAt

  const totalRecords = records.length
  const streak = computeRecordingStreak(records)
  const expenseCatsUsed = new Set(
    records.filter((r) => r.type === 'expense').map((r) => r.category),
  )
  const allPresetExpense = EXPENSE_CATEGORIES.every((c) => expenseCatsUsed.has(c.key))

  const milkTeaCount = records.filter(
    (r) => r.type === 'expense' && r.category === 'milkTea',
  ).length

  const midnightExpense = records.some((r) => {
    if (r.type !== 'expense') return false
    const t = new Date(r.createdAt)
    const h = t.getHours()
    return h >= 0 && h < 5
  })

  const completedWishes = wishes.filter((w) => w.status === 'completed').length
  const anyDeposit = wishes.some((w) => w.deposits.length > 0 || w.savedAmount > 0)
  const wish100 = wishes.some((w) => w.savedAmount >= 10000)
  const wish1000 = wishes.some((w) => w.savedAmount >= 100000)

  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const lastMonth = m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }
  const curMi = monthExpenseIncome(records, y, m)
  const lastMi = monthExpenseIncome(records, lastMonth.y, lastMonth.m)
  const dimPrev = daysInMonth(lastMonth.y, lastMonth.m)
  const dailyAvgPrev = lastMi.expense / Math.max(1, dimPrev)

  const moonlight =
    lastMi.expense > lastMi.income && curMi.income > curMi.expense && curMi.expense > 0

  const rules: Record<string, boolean> = {
    first_record: totalRecords >= 1,
    streak_7: streak >= 7,
    streak_30: streak >= 30,
    records_100: totalRecords >= 100,
    records_1000: totalRecords >= 1000,
    all_categories: allPresetExpense,
    first_deposit: anyDeposit,
    first_wish_done: completedWishes >= 1,
    wishes_5: completedWishes >= 5,
    wish_100: wish100,
    wish_1000: wish1000,
    daily_under_50: dailyAvgPrev < 5000 && lastMi.expense > 0,
    zero_spend_day: hasZeroSpendDay(records),
    weekend_low:
      records.length >= 8 &&
      lastCompletedWeekendExpense(records) < 3000 &&
      records.some((r) => r.type === 'expense'),
    midnight_shop: midnightExpense,
    milktea_20: milkTeaCount >= 20,
    moonlight_awaken: moonlight,
  }

  for (const def of ACHIEVEMENTS) {
    if (alreadyUnlocked(def.id)) continue
    if (rules[def.id]) unlocked.push(def.id)
  }
  return unlocked
}

export function mergeAchievements(
  current: Achievement[],
  newIds: string[],
  now: string,
): Achievement[] {
  const map = new Map(current.map((a) => [a.id, a]))
  for (const id of newIds) {
    if (!map.has(id)) map.set(id, { id, unlockedAt: now })
    else if (!map.get(id)!.unlockedAt) {
      map.set(id, { id, unlockedAt: now })
    }
  }
  return [...map.values()]
}
