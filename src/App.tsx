import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'
import { MainLayout } from './components/layout/MainLayout'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Records = lazy(() => import('./pages/Records').then((m) => ({ default: m.Records })))
const Wishes = lazy(() => import('./pages/Wishes').then((m) => ({ default: m.Wishes })))
const WishNew = lazy(() => import('./pages/WishNew').then((m) => ({ default: m.WishNew })))
const WishDetail = lazy(() => import('./pages/WishDetail').then((m) => ({ default: m.WishDetail })))
const AchievementsPage = lazy(() =>
  import('./pages/Achievements').then((m) => ({ default: m.AchievementsPage })),
)
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))
const DNAPage = lazy(() => import('./pages/DNA').then((m) => ({ default: m.DNAPage })))
const ReportPage = lazy(() => import('./pages/Report').then((m) => ({ default: m.ReportPage })))

function RouteFallback() {
  return (
    <div className="px-4 py-8">
      <div className="h-7 w-28 animate-pulse rounded-lg bg-[var(--color-surface)]" />
      <div className="mt-4 h-36 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
      <div className="mt-3 h-20 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
    </div>
  )
}

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="records" element={<Records />} />
              <Route path="wishes" element={<Wishes />} />
              <Route path="wishes/new" element={<WishNew />} />
              <Route path="wishes/:id" element={<WishDetail />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/dna" element={<DNAPage />} />
              <Route path="profile/report" element={<ReportPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppDataProvider>
  )
}
