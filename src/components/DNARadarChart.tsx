import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import type { SpendingDNA } from '../types'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

export function DNARadarChart({ dna }: { dna: SpendingDNA }) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  const labels = s.dna.dimensions
  const data = Object.entries(dna.dimensions).map(([key, value]) => ({
    subject: labels[key as keyof typeof labels] ?? key,
    a: value,
    fullMark: 100,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar name="Score" dataKey="a" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
