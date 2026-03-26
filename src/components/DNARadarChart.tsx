import { useLayoutEffect, useRef, useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts'
import type { SpendingDNA } from '../types'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

const CHART_HEIGHT = 256

export function DNARadarChart({ dna }: { dna: SpendingDNA }) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  const labels = s.dna.dimensions
  const data = Object.entries(dna.dimensions).map(([key, value]) => ({
    subject: labels[key as keyof typeof labels] ?? key,
    a: value,
    fullMark: 100,
  }))

  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: CHART_HEIGHT })

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const r = el.getBoundingClientRect()
      const w = Math.floor(r.width)
      if (w > 0) {
        const nextW = w
        setSize((prev) => (prev.w !== nextW ? { w: nextW, h: CHART_HEIGHT } : prev))
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)

    /* 转场动画 / flex 首帧宽度常为 0，需延后测量（与拖动 DevTools 触发重排同理） */
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measure)
    })
    const timeouts = [0, 50, 150, 320].map((ms) => window.setTimeout(measure, ms))

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [dna.generatedAt])

  return (
    <div
      ref={wrapRef}
      className="w-full min-w-0"
      style={{ minHeight: CHART_HEIGHT }}
    >
      {size.w > 0 ? (
        <RadarChart width={size.w} height={size.h} cx={size.w / 2} cy={size.h / 2} outerRadius={Math.min(size.w, size.h) * 0.36} data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar name="Score" dataKey="a" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
        </RadarChart>
      ) : (
        <div
          className="w-full rounded-xl bg-[var(--color-surface)]"
          style={{ height: CHART_HEIGHT }}
          aria-hidden
        />
      )}
    </div>
  )
}
