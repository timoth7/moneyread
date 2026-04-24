import { Dna, Home, List, Target, User } from 'lucide-react'
import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { RecordItem } from '../../types'
import { RouteFallback } from '../RouteFallback'
import { PageTransition } from '../motion/PageTransition'
import { useAppData } from '../../hooks/useAppData'
import { RecordSheet } from '../RecordSheet'
import { AchievementBanner } from '../AchievementBanner'
import { WishCelebrate } from '../WishCelebrate'
import { Toast } from '../ui/Toast'
import { Onboarding } from '../Onboarding'
import { DailyLimitBanner } from '../DailyLimitBanner'
import { TemplateFormModal } from '../TemplateFormModal'
import { getStrings } from '../../constants/strings'
import { loadOnboardingComplete } from '../../utils/storage'

export function MainLayout() {
  const location = useLocation()
  const mainScrollRef = useRef<HTMLElement>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [recordForTemplate, setRecordForTemplate] = useState<Omit<RecordItem, 'id' | 'createdAt'> | null>(null)
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false)
  /** 连续相同金额（分）记账次数，满 3 次才提示存为模板 */
  const templateAmountStreakRef = useRef<{ fen: number | null; n: number }>({ fen: null, n: 0 })

  const clearTemplateHint = useCallback(() => {
    setRecordForTemplate(null)
    templateAmountStreakRef.current = { fen: null, n: 0 }
  }, [])

  useLayoutEffect(() => {
    const el = mainScrollRef.current
    if (el) el.scrollTop = 0
  }, [location.pathname])

  const labHomeShell = location.pathname === '/' || location.pathname === '/dna'

  const {
    addRecord,
    addQuickTemplate,
    quickTemplates,
    records,
    wishes,
    pendingAchievement,
    clearPendingAchievement,
    wishJustCompleted,
    clearWishJustCompleted,
    dailyLimitWarning,
    clearDailyLimitWarning,
    settings,
  } = useAppData()
  const s = getStrings(settings.language)

  useEffect(() => {
    if (loadOnboardingComplete()) return
    if (records.length === 0 && wishes.length === 0) {
      setOnboardingStep((prev) => (prev === 0 ? 1 : prev))
    }
  }, [records.length, wishes.length])

  useEffect(() => {
    if (!recordForTemplate) return
    const t = window.setTimeout(() => clearTemplateHint(), 8000)
    return () => clearTimeout(t)
  }, [recordForTemplate, clearTemplateHint])

  const showOnboarding = onboardingStep >= 1
  const fabHi = showOnboarding && onboardingStep === 2
  const wishesHi = showOnboarding && onboardingStep === 3
  const profileHi = showOnboarding && onboardingStep === 4

  const closeOnboarding = () => setOnboardingStep(0)

  const tabs = [
    { to: '/', icon: Home, label: s.nav.home },
    { to: '/records', icon: List, label: s.nav.records },
    { to: '/wishes', icon: Target, label: s.nav.wishes },
    { to: '/profile', icon: User, label: s.nav.profile },
  ]

  const sidebarTabs = [
    { to: '/', icon: Home, label: s.nav.home },
    { to: '/records', icon: List, label: s.nav.records },
    { to: '/wishes', icon: Target, label: s.nav.wishes },
    { to: '/dna', icon: Dna, label: s.labHome.navDna },
    { to: '/profile', icon: User, label: s.nav.profile },
  ]

  const xpPerLevel = 20
  const levelN = Math.floor(records.length / xpPerLevel) + 1
  const xpInLevel = records.length % xpPerLevel
  const xpMeterPct = (xpInLevel / xpPerLevel) * 100

  const ringOnboarding =
    'ring-4 ring-[var(--color-solar)] ring-offset-2 ring-offset-[var(--color-background)] z-[200]'

  /** 全路由统一的「记一笔」：主色→浅主色渐变，随主题 `--color-primary*` 变化（与 Records 侧栏一致） */
  const addRecordSidebarClass =
    'mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] px-4 py-3 font-semibold text-white shadow-lg outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]'
  const addRecordFabClass =
    'flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-transparent bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-lg outline-none transition hover:brightness-110 active:scale-95 active:rotate-90 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]'

  return (
    <div className={`min-h-dvh w-full bg-[var(--color-background)]`}>
      {!labHomeShell && (
        <>
          <div className="pointer-events-none fixed left-1/2 top-20 z-0 h-20 w-20 -translate-x-[200px] bg-[var(--color-primary)]/5 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />
          <div className="pointer-events-none fixed left-1/2 top-40 z-0 h-16 w-16 translate-x-[140px] bg-[var(--color-accent)]/10 [clip-path:polygon(0_0,100%_20%,85%_100%,0_85%)]" />
        </>
      )}
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px]">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-background)]/90 px-5 py-6 backdrop-blur md:flex md:flex-col">
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-primary)]">moneyread</p>
          <div className="mt-8 space-y-1">
            {sidebarTabs.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => {
                  const hi = (wishesHi && to === '/wishes') || (profileHi && to === '/profile')
                  if (labHomeShell) {
                    return `flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-electric)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[color-mix(in_srgb,var(--color-text)_6%,var(--color-surface))]'
                    } ${hi ? ringOnboarding : ''}`
                  }
                  return `flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                  } ${hi ? ringOnboarding : ''}`
                }}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[var(--color-border)] p-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              <span>
                {s.labHome.level} {levelN}
              </span>
              <span className="font-[family-name:var(--font-mono)] tabular-nums">
                {xpInLevel}/{xpPerLevel}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-text)_10%,var(--color-background))]">
              <div className="h-full rounded-full bg-[var(--color-electric)]" style={{ width: `${xpMeterPct}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={`${addRecordSidebarClass} ${fabHi ? ringOnboarding : ''}`}
          >
            <span className="text-xl leading-none">+</span>
            {s.recordForm.addRecord}
          </button>
        </aside>

        <main
          ref={mainScrollRef}
          className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-[var(--color-background)] pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-8"
        >
          <Suspense fallback={<RouteFallback />}>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </Suspense>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-[100] mx-auto flex h-16 w-full items-end justify-between border-t border-[var(--color-border)] bg-[var(--color-background)] px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden">
        {tabs.slice(0, 2).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium ${
                labHomeShell
                  ? isActive
                    ? 'text-[var(--color-electric)]'
                    : 'text-[var(--color-text-secondary)]'
                  : isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}

        <div className="relative flex w-[72px] shrink-0 justify-center">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={`absolute bottom-[calc(12px+env(safe-area-inset-bottom)*0.3)] ${addRecordFabClass} ${fabHi ? ringOnboarding : ''}`}
            aria-label={s.recordForm.addRecord}
          >
            <span className="text-2xl font-light leading-none">+</span>
          </button>
        </div>

        {tabs.slice(2).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const hi = (wishesHi && to === '/wishes') || (profileHi && to === '/profile')
              const activeCls = labHomeShell
                ? isActive
                  ? 'text-[var(--color-electric)]'
                  : 'text-[var(--color-text-secondary)]'
                : isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)]'
              return `flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium ${activeCls} ${hi ? ringOnboarding : ''}`
            }}
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {recordForTemplate && quickTemplates.length < 8 && (
        <div className="pointer-events-none fixed bottom-[calc(72px+env(safe-area-inset-bottom))] left-0 right-0 z-[110] flex justify-center px-4 md:bottom-8">
          <div
            className="pointer-events-auto flex max-w-md items-center gap-2 rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-surface)] px-4 py-2 shadow-lg backdrop-blur-md"
          >
            <button
              type="button"
              className="cursor-pointer text-sm font-semibold text-[var(--color-primary)]"
              onClick={() => setSaveTemplateModalOpen(true)}
            >
              {s.dashboard.saveAsTemplate}
            </button>
            <button
              type="button"
              className="cursor-pointer text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              onClick={clearTemplateHint}
              aria-label={s.common.cancel}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <RecordSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={(data) => {
          addRecord(data)
          setToast('✓')
          window.setTimeout(() => setToast(null), 2000)
        }}
        onAfterSubmit={(data) => {
          if (quickTemplates.length >= 8) return
          const fen = data.amount
          const st = templateAmountStreakRef.current
          if (st.fen === fen) {
            st.n += 1
          } else {
            st.fen = fen
            st.n = 1
          }
          if (st.n >= 3) {
            setRecordForTemplate(data)
            templateAmountStreakRef.current = { fen: null, n: 0 }
          }
        }}
      />

      <TemplateFormModal
        open={saveTemplateModalOpen}
        language={settings.language}
        editing={null}
        prefilled={recordForTemplate}
        templateCount={quickTemplates.length}
        onClose={() => {
          setSaveTemplateModalOpen(false)
          clearTemplateHint()
        }}
        onSave={(t) => {
          addQuickTemplate(t)
          clearTemplateHint()
        }}
      />

      <Onboarding
        open={showOnboarding}
        step={onboardingStep}
        language={settings.language}
        onStepChange={setOnboardingStep}
        onClose={closeOnboarding}
      />

      {dailyLimitWarning && (
        <DailyLimitBanner
          spentFen={dailyLimitWarning.spentFen}
          limitFen={dailyLimitWarning.limitFen}
          language={settings.language}
          onDismiss={clearDailyLimitWarning}
        />
      )}

      <AchievementBanner event={pendingAchievement} onDismiss={clearPendingAchievement} />
      <WishCelebrate wish={wishJustCompleted} onClose={clearWishJustCompleted} />
      <Toast message={toast ?? ''} open={!!toast} />
    </div>
  )
}
