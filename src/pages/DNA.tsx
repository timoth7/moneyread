import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { canGenerateDNA } from '../utils/dna-calculator'
import { getStrings } from '../constants/strings'
import { monthBounds, topExpenseCategories } from '../utils/stats'
import { EXPENSE_CATEGORIES } from '../constants/categories'
import { themes, type ThemeKey } from '../constants/themes'

const DIMENSION_COLORS = ['#FF3366', '#FFB800', '#8B5CF6', '#00D4FF'] as const
const BASE_COLORS = ['#FF3366', '#BFFF00', '#A855F7', '#FFB800', '#00D4FF', '#8B5CF6']

function themeTokens(theme: string) {
  const key = (theme in themes ? theme : 'signature') as ThemeKey
  return themes[key]
}

function Radar({
  dims,
  size = 320,
  compact = false,
  language = 'en',
}: {
  dims: Record<string, number>
  size?: number
  compact?: boolean
  language?: 'en' | 'zh'
}) {
  const labelPad = compact ? 52 : 78
  const R = size / 2 - labelPad
  const cx = size / 2
  const cy = size / 2
  const axisDefs = [
    { k: 'frequency', labelEn: 'Frequency', labelZh: '频率', labelShortEn: 'FREQ', labelShortZh: '频次', color: DIMENSION_COLORS[0], angle: -Math.PI / 2 },
    { k: 'concentration', labelEn: 'Concentration', labelZh: '集中度', labelShortEn: 'CONC', labelShortZh: '集中', color: DIMENSION_COLORS[1], angle: 0 },
    { k: 'timePattern', labelEn: 'Time', labelZh: '时段', labelShortEn: 'TIME', labelShortZh: '时段', color: DIMENSION_COLORS[2], angle: Math.PI / 2 },
    { k: 'volatility', labelEn: 'Volatility', labelZh: '波动', labelShortEn: 'VOL', labelShortZh: '波动', color: DIMENSION_COLORS[3], angle: Math.PI },
  ]
  const axes = axisDefs.map((a) => ({
    ...a,
    label: compact
      ? (language === 'zh' ? a.labelShortZh : a.labelShortEn)
      : (language === 'zh' ? a.labelZh : a.labelEn),
  }))
  const pt = (angle: number, r: number): [number, number] => [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]
  const poly = axes.map((a) => pt(a.angle, ((dims[a.k] ?? 0) / 100) * R)).map(([x, y]) => `${x},${y}`).join(' ')
  const rings = [25, 50, 75, 100]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
      <defs>
        <radialGradient id="dnaRadarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity=".55" />
          <stop offset="60%" stopColor="var(--color-accent)" stopOpacity=".18" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity=".05" />
        </radialGradient>
        <filter id="dnaGlow"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {rings.map((r) => (
        <polygon
          key={r}
          points={axes.map((a) => pt(a.angle, (r / 100) * R)).map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeDasharray={r === 100 ? '0' : '2 3'}
        />
      ))}
      {axes.map((a) => {
        const [x, y] = pt(a.angle, R)
        const [tx, ty] = pt(a.angle, ((dims[a.k] ?? 0) / 100) * R)
        return (
          <g key={a.k}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={a.color} strokeOpacity=".35" strokeWidth="1" />
            <circle cx={tx} cy={ty} r="6" fill={a.color} filter="url(#dnaGlow)" opacity=".6" />
            <circle cx={tx} cy={ty} r="3" fill={a.color} />
          </g>
        )
      })}
      <polygon points={poly} fill="url(#dnaRadarFill)" stroke="var(--color-accent)" strokeWidth="1.8" filter="url(#dnaGlow)" opacity=".9" />
      <polygon points={poly} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
      {axes.map((a) => {
        const lblR = R + (compact ? 30 : 42)
        const [lx, ly] = pt(a.angle, lblR)
        const fs = compact ? 7.5 : 9
        const valFs = compact ? 15 : 18
        return (
          <g key={`lbl-${a.k}`}>
            <text x={lx} y={ly - 5} textAnchor="middle" fontSize={fs} fill="rgba(255,255,255,.5)"
              className="font-[family-name:var(--font-mono)]"
              style={{ letterSpacing: compact ? '.06em' : '.12em', textTransform: 'uppercase' }}>{a.label}</text>
            <text x={lx} y={ly + (compact ? 9 : 11)} textAnchor="middle" fontSize={valFs} fill={a.color}
              className="font-[family-name:var(--font-mono)]"
              style={{ fontWeight: 700, textShadow: `0 0 10px ${a.color}88` }}>
              {dims[a.k] ?? 0}
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r="2" fill="white" />
    </svg>
  )
}

function Helix({ w = 240, h = 360, colors }: { w?: number; h?: number; colors: string[] }) {
  const pts = 28
  const strands: { x1: number; x2: number; y: number; c: string }[] = []
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1)
    const y = t * h
    const x1 = w / 2 + Math.sin(t * Math.PI * 4) * (w * 0.32)
    const x2 = w / 2 + Math.sin(t * Math.PI * 4 + Math.PI) * (w * 0.32)
    strands.push({ x1, x2, y, c: colors[i % colors.length] })
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mr-lab-dna-spin">
      {strands.map((s, i) => (
        <line key={`r${i}`} x1={s.x1} y1={s.y} x2={s.x2} y2={s.y} stroke={s.c} strokeOpacity=".55" strokeWidth="1.5" />
      ))}
      <path d={strands.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x1} ${s.y}`).join(' ')} stroke={colors[0]} strokeWidth="2.5" fill="none" />
      <path d={strands.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x2} ${s.y}`).join(' ')} stroke={colors[1] ?? colors[0]} strokeWidth="2.5" fill="none" />
      {strands.map((s, i) => (
        <g key={`n${i}`}>
          <circle cx={s.x1} cy={s.y} r="3.5" fill={colors[0]} />
          <circle cx={s.x2} cy={s.y} r="3.5" fill={s.c} />
        </g>
      ))}
    </svg>
  )
}

function deriveDimensionLabels(dims: { frequency: number; concentration: number; timePattern: number; volatility: number }, locale: 'en' | 'zh') {
  const labels: { word: string; color: string }[] = []
  const tp = dims.timePattern > 55
    ? (locale === 'zh' ? '夜猫型' : 'Night Owl')
    : (locale === 'zh' ? '早鸟型' : 'Early Bird')
  const vol = dims.volatility > 55
    ? (locale === 'zh' ? '大起大落' : 'Rollercoaster')
    : (locale === 'zh' ? '稳如泰山' : 'Steady Rock')
  const conc = dims.concentration > 55
    ? (locale === 'zh' ? '专情玩家' : 'Loyal Spender')
    : (locale === 'zh' ? '雨露均沾' : 'Spread-out')
  const freq = dims.frequency > 55
    ? (locale === 'zh' ? '随手买买买' : 'Impulse Buyer')
    : (locale === 'zh' ? '极简主义者' : 'Minimalist')
  labels.push(
    { word: tp, color: '#8B5CF6' },
    { word: vol, color: '#00D4FF' },
    { word: conc, color: '#FFB800' },
    { word: freq, color: '#FF3366' },
  )
  return labels
}

export function DNAPage() {
  const { records, dna, refreshDNA, settings } = useAppData()
  const navigate = useNavigate()
  const s = getStrings(settings.language)
  const th = themeTokens(settings.theme)
  const helixColors = [th['--color-accent'], th['--color-primary'], th['--color-electric'], th['--color-hot']]

  const [busy, setBusy] = useState(false)

  const runRefresh = useCallback(() => {
    if (busy) return
    setBusy(true)
    refreshDNA()
    window.setTimeout(() => setBusy(false), 700)
  }, [busy, refreshDNA])

  const runGenerate = useCallback(() => {
    if (busy) return
    setBusy(true)
    refreshDNA()
    window.setTimeout(() => setBusy(false), 650)
  }, [busy, refreshDNA])

  const now = new Date()
  const monthLabel = now.toLocaleString(settings.language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', year: 'numeric' })

  const bases = useMemo(() => {
    const { start, end } = monthBounds(now)
    const top = topExpenseCategories(records, start, end, 6)
    const total = top.reduce((s, t) => s + t.amount, 0)
    return top.map((t, i) => {
      const cat = EXPENSE_CATEGORIES.find((c) => c.key === t.key)
      return {
        key: cat?.label ?? t.key,
        emoji: cat?.emoji ?? '🏷️',
        color: BASE_COLORS[i % BASE_COLORS.length],
        pct: total > 0 ? Math.round((t.amount / total) * 100) : 0,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, now.getMonth(), now.getFullYear()])

  const dimLabels = dna ? deriveDimensionLabels(dna.dimensions, settings.language) : []
  const seqCode = dna
    ? `${dna.dimensions.frequency > 55 ? 'F' : 'f'}${dna.dimensions.concentration > 55 ? 'C' : 'c'}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(records.length).padStart(4, '0')}`
    : ''

  const notReady = !canGenerateDNA(records)

  return (
    <div className="relative min-h-[calc(100dvh-64px)] bg-[var(--color-background)]">
      {/* Header */}
      <header className="relative flex flex-wrap items-start justify-between gap-3 px-5 pb-4 pt-[max(16px,env(safe-area-inset-top))] md:px-6 md:pt-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="break-words font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              {monthLabel}
              {seqCode ? (
                <span className="mt-0.5 block normal-case tracking-normal text-[var(--color-text-secondary)]">
                  · SEQ {seqCode}
                </span>
              ) : null}
            </div>
            <h1 className="mt-1 break-words font-[family-name:var(--font-display)] text-[clamp(1.125rem,4vw,1.375rem)] font-bold leading-snug text-[var(--color-text)]">
              {s.dna.title.split(' ')[0]}{' '}
              <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-electric)] bg-clip-text italic text-transparent">
                {s.dna.title.split(' ').slice(1).join(' ') || 'DNA'}
              </span>
            </h1>
          </div>
        </div>
        {dna && (
          <div className="flex shrink-0 items-center gap-1.5 rounded border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--color-accent)]">
            <span className="mr-lab-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" /> LIVE
          </div>
        )}
      </header>

      {/* Not enough records */}
      {notReady ? (
        <div className="relative px-5 md:px-6">
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-5xl">🧬</p>
            <p className="mt-4 text-[var(--color-text-secondary)]">{s.dna.need20}</p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-[var(--color-text-secondary)]">
              {s.dna.current} {records.length} {s.dna.records}
            </p>
          </div>
        </div>
      ) : !dna ? (
        <div className="relative px-5 md:px-6">
          <div className="mx-auto max-w-md">
            <button
              type="button"
              disabled={busy}
              onClick={runGenerate}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-electric)] py-4 font-bold text-white disabled:opacity-80"
            >
              {busy && <Loader2 className="h-5 w-5 shrink-0 animate-spin" />}
              {busy ? s.dna.refreshing : s.dna.generate}
            </button>
          </div>
        </div>
      ) : (
        /* 大屏：左 4/12 人格，右 8/12 为 Live Sequence（上：螺旋+碱基组成，下：基因图谱）；小屏顺序：人格 → 综合卡 */
        <motion.div
          className="relative grid min-w-0 grid-cols-1 gap-4 px-5 pb-6 lg:grid-cols-12 lg:items-start lg:px-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Pattern */}
          <aside className="order-1 min-w-0 lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <div
              className="relative min-w-0 overflow-hidden rounded-2xl p-6"
              style={{
                background: `linear-gradient(160deg, color-mix(in srgb, var(--color-primary-dark) 60%, var(--color-surface)) 0%, var(--color-surface) 100%)`,
                border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
              }}
            >
              <div className="font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                {settings.language === 'zh' ? '你的人格' : 'Your Pattern'}
              </div>
              <div className="mr-lab-float my-4 text-6xl">{dna.emoji}</div>
              <div className="mr-lab-glow-accent break-words text-balance font-[family-name:var(--font-display)] text-xl font-bold leading-snug text-[var(--color-accent)] lg:text-2xl">
                {dna.label}
              </div>
              <div className="mt-3 break-words text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                {dna.description}
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {dimLabels.map((l) => (
                  <div
                    key={l.word}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1"
                    style={{ background: `${l.color}15`, border: `1px solid ${l.color}40` }}
                  >
                    <div className="h-1 w-1 rounded-full" style={{ background: l.color }} />
                    <span className="text-[10px] font-semibold" style={{ color: l.color }}>{l.word}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">
                <span>GEN {dna.generatedAt.slice(5, 10)}</span>
                <span>{records.length} {s.dna.records}</span>
              </div>
            </div>
          </aside>

          {/* Live Sequence + Gene Map（同一张大卡，填满右侧视觉重量） */}
          <section className="order-2 min-w-0 lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <div
              className="relative overflow-hidden rounded-2xl border border-[var(--color-border)]"
              style={{
                background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 60%), var(--color-surface)`,
              }}
            >
              <div className="pointer-events-none absolute inset-0 mr-lab-scanlines opacity-60" />
              <div className="absolute left-4 right-4 top-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="mr-lab-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
                    {settings.language === 'zh' ? '实时序列' : 'Live Sequence'}
                  </span>
                </div>
                <span className="shrink-0 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-text-secondary)]">
                  {records.length} {s.dna.records} · {bases.length} {settings.language === 'zh' ? '碱基' : 'bases'}
                </span>
              </div>

              <div className="flex flex-col gap-10 p-6 pb-8 pt-14">
                <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start">
                  <div className="flex shrink-0 justify-center lg:justify-start">
                    <Helix w={240} h={360} colors={helixColors} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="mb-3 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
                      {settings.language === 'zh' ? '碱基对组成' : 'Base Pair Composition'}
                    </div>
                    {bases.length === 0 ? (
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {settings.language === 'zh' ? '本月暂无支出记录' : 'No expenses this month yet'}
                      </p>
                    ) : (
                      bases.map((b) => (
                        <div key={b.key} className="flex min-w-0 items-center gap-2">
                          <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
                          <span className="shrink-0 text-base">{b.emoji}</span>
                          <span className="min-w-0 flex-1 basis-0 break-words text-[13px] font-semibold text-[var(--color-text)]">
                            {b.key}
                          </span>
                          <div className="h-1.5 min-w-[4rem] flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                            <div className="h-full rounded-full transition-[width]" style={{ width: `${b.pct}%`, background: b.color }} />
                          </div>
                          <span className="w-9 shrink-0 text-right font-[family-name:var(--font-mono)] text-[11px] font-bold tabular-nums" style={{ color: b.color }}>
                            {b.pct}%
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="relative border-t border-[var(--color-border)] pt-8">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <div className="font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-secondary)]">
                        {settings.language === 'zh' ? '四维指标' : '4D Dimensions'}
                      </div>
                      <div className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">
                        {settings.language === 'zh' ? '基因图谱' : 'Gene Map'}
                      </div>
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-text-secondary)]">0–100</div>
                  </div>
                  <div className="flex w-full min-w-0 justify-center overflow-x-auto">
                    <Radar dims={dna.dimensions} size={320} language={settings.language} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refresh */}
          <div className="order-3 min-w-0 lg:col-span-12 lg:col-start-1 lg:row-start-2">
            <div className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <button
                type="button"
                disabled={busy}
                onClick={runRefresh}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2.5 font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {busy ? s.dna.refreshing : s.dna.refresh}
              </button>
              <span className="text-center font-[family-name:var(--font-mono)] text-[10px] leading-snug text-[var(--color-text-secondary)] sm:max-w-[14rem] sm:text-left">
                {s.dna.refreshHint}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
