import { motion } from 'framer-motion'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { getCategoryDef } from '../constants/categories'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'
import { formatYuan } from '../utils/money'
import { toLocalISODate } from '../utils/dates'
import type { QuickTemplate } from '../types'
import { TemplateFormModal } from './TemplateFormModal'

const MAX = 8

export function QuickTemplates() {
  const {
    quickTemplates,
    settings,
    addRecord,
    addQuickTemplate,
    updateQuickTemplate,
    deleteQuickTemplate,
  } = useAppData()
  const s = getStrings(settings.language)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<QuickTemplate | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [flash, setFlash] = useState(false)

  const applyTemplate = (tpl: QuickTemplate) => {
    addRecord({
      amount: tpl.amount,
      type: tpl.type,
      category: tpl.category,
      note: tpl.note,
      date: toLocalISODate(),
    })
    setFlash(true)
    window.setTimeout(() => setFlash(false), 1600)
  }

  return (
    <section className="mb-8">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text)]">
          {s.dashboard.quickTemplates}
        </h2>
        {flash && (
          <span className="text-xs font-semibold text-[var(--color-primary)]">{s.dashboard.templateRecorded}</span>
        )}
      </div>
      <p className="mb-3 text-xs text-[var(--color-text-secondary)]">{s.dashboard.quickTemplatesHint}</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
        {quickTemplates.map((tpl) => {
          const def = getCategoryDef(tpl.type, tpl.category)
          const emoji = def?.emoji ?? '🏷️'
          return (
            <motion.div
              key={tpl.id}
              className="relative flex max-w-[220px] shrink-0 items-stretch overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
              whileTap={{ scale: 0.98 }}
              onContextMenu={(e) => {
                e.preventDefault()
                setMenuId(menuId === tpl.id ? null : tpl.id)
              }}
              onTouchStart={() => {
                longPressRef.current = setTimeout(() => setMenuId(tpl.id), 480)
              }}
              onTouchEnd={() => {
                if (longPressRef.current) clearTimeout(longPressRef.current)
              }}
              onTouchMove={() => {
                if (longPressRef.current) clearTimeout(longPressRef.current)
              }}
            >
              <button
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="min-w-0 flex-1 truncate py-2 pl-3 pr-1 text-left text-sm font-medium text-[var(--color-text)]"
              >
                {emoji} {tpl.name} ¥{formatYuan(tpl.amount)}
              </button>
              <button
                type="button"
                className="shrink-0 px-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                aria-label={s.templates.menu}
                onClick={() => setMenuId(menuId === tpl.id ? null : tpl.id)}
              >
                <MoreHorizontal size={16} />
              </button>
              {menuId === tpl.id && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-background)]"
                    onClick={() => {
                      setEditing(tpl)
                      setFormOpen(true)
                      setMenuId(null)
                    }}
                  >
                    {s.common.edit}
                  </button>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-[var(--color-hot)] hover:bg-[var(--color-background)]"
                    onClick={() => {
                      if (window.confirm(s.templates.deleteConfirm)) deleteQuickTemplate(tpl.id)
                      setMenuId(null)
                    }}
                  >
                    {s.common.delete}
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
        <button
          type="button"
          disabled={quickTemplates.length >= MAX}
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[var(--color-primary)]/50 text-[var(--color-primary)] disabled:opacity-40"
          aria-label={s.templates.newTitle}
        >
          <Plus size={22} />
        </button>
      </div>

      <TemplateFormModal
        open={formOpen}
        language={settings.language}
        editing={editing}
        templateCount={quickTemplates.length}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={(data) => {
          if (editing) updateQuickTemplate(editing.id, data)
          else addQuickTemplate(data)
        }}
        onDelete={deleteQuickTemplate}
      />
    </section>
  )
}
