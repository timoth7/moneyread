export function yuanToFen(yuan: number): number {
  return Math.round(Math.round(yuan * 10000) / 100)
}

export function fenToYuan(fen: number): number {
  return fen / 100
}

export function formatYuan(fen: number): string {
  let locale = 'en-US'
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('mr_settings')
      const lang = raw ? (JSON.parse(raw) as { language?: 'en' | 'zh' }).language : 'en'
      locale = lang === 'zh' ? 'zh-CN' : 'en-US'
    } catch {
      locale = 'en-US'
    }
  }
  return (fen / 100).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseYuanInput(s: string): number | null {
  const t = s.trim().replace(/,/g, '')
  if (t === '' || t === '.') return null
  const n = Number.parseFloat(t)
  if (Number.isNaN(n) || n < 0) return null
  return yuanToFen(n)
}
