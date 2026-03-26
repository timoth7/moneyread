export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function parseISODate(s: string): Date {
  const [y, m, day] = s.split('-').map(Number)
  return new Date(y, m - 1, day)
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

export function endOfWeekSunday(d: Date): Date {
  const s = startOfWeekMonday(d)
  const e = addDays(s, 6)
  e.setHours(23, 59, 59, 999)
  return e
}

/** 公历是否有效（含闰年 2 月） */
export function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) return false
  if (!Number.isInteger(month) || month < 1 || month > 12) return false
  if (!Number.isInteger(day) || day < 1 || day > 31) return false
  const dt = new Date(year, month - 1, day)
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day
}

/**
 * 将年(四位)、月、日字符串合并为 ISO `yyyy-mm-dd`；任一部分缺失或非法则返回 null。
 */
export function tryCombineYMDParts(yStr: string, mStr: string, dStr: string): string | null {
  const trimmed = [yStr, mStr, dStr].map((s) => s.trim())
  if (trimmed.every((s) => s === '')) return null
  if (trimmed.some((s) => s === '')) return null
  const y = parseInt(trimmed[0], 10)
  const m = parseInt(trimmed[1], 10)
  const d = parseInt(trimmed[2], 10)
  if (trimmed[0].length !== 4) return null
  if (!isValidCalendarDate(y, m, d)) return null
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
