const DEFAULT_COLORS = ['#BFFF00', '#6C2BD9', '#00D4FF', '#FF3366']

export interface DNAHelixProps {
  size?: number
  colors?: string[]
}

export function DNAHelix({ size = 220, colors = DEFAULT_COLORS }: DNAHelixProps) {
  const pts = 20
  const w = size
  const h = size
  const strands: { x1: number; x2: number; y: number; c: string }[] = []
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1)
    const y = t * h
    const x1 = w / 2 + Math.sin(t * Math.PI * 3) * (w * 0.32)
    const x2 = w / 2 + Math.sin(t * Math.PI * 3 + Math.PI) * (w * 0.32)
    strands.push({ x1, x2, y, c: colors[i % colors.length]! })
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="mr-lab-dna-spin"
      aria-hidden
    >
      {strands.map((s, i) => (
        <line key={`r${i}`} x1={s.x1} y1={s.y} x2={s.x2} y2={s.y} stroke={s.c} strokeWidth="1.5" opacity={0.5} />
      ))}
      <path
        d={strands.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x1} ${s.y}`).join(' ')}
        stroke={colors[0]}
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d={strands.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x2} ${s.y}`).join(' ')}
        stroke={colors[1 % colors.length]}
        strokeWidth="2.5"
        fill="none"
      />
      {strands.map((s, i) => (
        <g key={`n${i}`}>
          <circle cx={s.x1} cy={s.y} r="3.2" fill={colors[0]} />
          <circle cx={s.x2} cy={s.y} r="3.2" fill={colors[i % colors.length]} />
        </g>
      ))}
    </svg>
  )
}
