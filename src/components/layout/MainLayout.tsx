import { Home, List, Target, User } from 'lucide-react'
import { Suspense, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { RouteFallback } from '../RouteFallback'
import { PageTransition } from '../motion/PageTransition'
import { useAppData } from '../../hooks/useAppData'
import { RecordSheet } from '../RecordSheet'
import { AchievementBanner } from '../AchievementBanner'
import { WishCelebrate } from '../WishCelebrate'
import { Toast } from '../ui/Toast'
import { getStrings } from '../../constants/strings'

export function MainLayout() {
  const location = useLocation()
  const mainScrollRef = useRef<HTMLElement>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useLayoutEffect(() => {
    const el = mainScrollRef.current
    if (el) el.scrollTop = 0
  }, [location.pathname])
  const { addRecord, pendingAchievement, clearPendingAchievement, wishJustCompleted, clearWishJustCompleted, settings } =
    useAppData()
  const s = getStrings(settings.language)
  const tabs = [
    { to: '/', icon: Home, label: s.nav.home },
    { to: '/records', icon: List, label: s.nav.records },
    { to: '/wishes', icon: Target, label: s.nav.wishes },
    { to: '/profile', icon: User, label: s.nav.profile },
  ]
  return (
    <div className="min-h-dvh w-full bg-[var(--color-background)]">
      <div className="pointer-events-none fixed left-1/2 top-20 z-0 h-28 w-28 -translate-x-[220px] bg-[var(--color-primary)]/8 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />
      <div className="pointer-events-none fixed left-1/2 top-44 z-0 h-24 w-24 translate-x-[150px] bg-[var(--color-accent)]/15 [clip-path:polygon(0_0,100%_20%,85%_100%,0_85%)]" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px]">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-background)]/90 px-5 py-6 backdrop-blur md:flex md:flex-col">
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-primary)]">
            moneyread
          </p>
          <div className="mt-8 space-y-2">
            {tabs.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] px-4 py-3 font-semibold text-white shadow-lg"
          >
            <span className="text-xl leading-none">+</span>
            {s.recordForm.addRecord}
          </button>
        </aside>

        <main
          ref={mainScrollRef}
          className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-8"
        >
          <Suspense fallback={<RouteFallback />}>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </Suspense>
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-[100] mx-auto flex h-16 w-full items-end justify-between border-t border-[var(--color-border)] bg-[var(--color-background)] px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] md:hidden"
      >
        {tabs.slice(0, 2).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
                isActive ? 'text-[var(--color-primary)]' : 'text-[#9CA3AF]'
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
            className="absolute bottom-[calc(12px+env(safe-area-inset-bottom)*0.3)] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-lg transition active:scale-95 active:rotate-90"
            aria-label={s.recordForm.addRecord}
          >
            <span className="text-2xl font-light leading-none">+</span>
          </button>
        </div>

        {tabs.slice(2).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
                isActive ? 'text-[var(--color-primary)]' : 'text-[#9CA3AF]'
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
      </nav>

      <RecordSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={(data) => {
          addRecord(data)
          setToast('✓')
          window.setTimeout(() => setToast(null), 2000)
        }}
      />

      <AchievementBanner
        event={pendingAchievement}
        onDismiss={clearPendingAchievement}
      />
      <WishCelebrate wish={wishJustCompleted} onClose={clearWishJustCompleted} />
      <Toast message={toast ?? ''} open={!!toast} />
    </div>
  )
}
