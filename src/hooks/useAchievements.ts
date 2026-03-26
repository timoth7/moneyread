import { useAppData } from '../hooks/useAppData'

export function useAchievements() {
  const { achievements, pendingAchievement, clearPendingAchievement } = useAppData()
  return { achievements, pendingAchievement, clearPendingAchievement }
}
