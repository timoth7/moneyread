import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppData } from '../hooks/useAppData'
import { formatYuan } from '../utils/money'
import { WishImage } from '../components/WishImage'
import { getStrings } from '../constants/strings'

const itemVariants = {
  initial: { opacity: 0, y: 16, x: 8, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

export function Wishes() {
  const { wishes, deleteWish, settings } = useAppData()
  const s = getStrings(settings.language)
  const active = wishes.filter((w) => w.status === 'active')
  const done = wishes.filter((w) => w.status === 'completed')

  return (
    <div className="px-4 pb-6 pt-[max(12px,env(safe-area-inset-top))] md:px-8 md:pb-10 md:pt-8">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)] [transform:rotate(-2deg)] md:text-4xl">
          {s.wishes.title}
        </h1>
        <Link
          to="/wishes/new"
          className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-md"
        >
          {s.wishes.new}
        </Link>
      </div>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.wishes.subtitle}</p>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#9CA3AF]">{s.wishes.active}</h2>
        {active.length === 0 ? (
          <Link
            to="/wishes/new"
            className="block rounded-2xl border-2 border-dashed border-[var(--color-primary)]/40 bg-[var(--color-surface)] px-4 py-10 text-center font-medium text-[var(--color-primary)]"
          >
            {s.wishes.create}
          </Link>
        ) : (
          <motion.ul
            className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.06 }}
          >
            {active.map((w) => {
              const pct = w.targetAmount > 0 ? Math.min(100, Math.round((w.savedAmount / w.targetAmount) * 100)) : 0
              return (
                <motion.li key={w.id} variants={itemVariants}>
                  <div className="rounded-2xl border-l-4 border-[var(--color-primary)] bg-[var(--color-background)] p-4 shadow-md">
                    <div className="flex items-start gap-3">
                      <WishImage src={w.icon} alt={w.name} size={56} />
                      <div className="min-w-0 flex-1">
                        <Link to={`/wishes/${w.id}`} className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)] hover:underline">
                          {w.name}
                        </Link>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                          ¥{formatYuan(w.savedAmount)} / ¥{formatYuan(w.targetAmount)} · {pct}%
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(s.wishes.deleteConfirm)) deleteWish(w.id)
                        }}
                        className="rounded-lg p-2 text-[var(--color-hot)] hover:bg-[#FFF0F3]"
                        aria-label="Delete wish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </section>

      {done.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#9CA3AF]">{s.wishes.memories}</h2>
          <ul className="space-y-2 opacity-80">
            {done.map((w) => (
              <li key={w.id} className="flex items-center gap-3 rounded-xl bg-[var(--color-surface)] px-4 py-3">
                <WishImage src={w.icon} alt={w.name} size={40} />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--color-text)] line-through">{w.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{s.wishes.completed}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(s.wishes.deleteDoneConfirm)) deleteWish(w.id)
                  }}
                  className="rounded-lg p-2 text-[var(--color-hot)] hover:bg-[#FFF0F3]"
                  aria-label="Delete wish"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
