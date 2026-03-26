import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import type {
  Achievement,
  AchievementUnlockEvent,
  RecordItem,
  SpendingDNA,
  UserSettings,
  Wish,
} from '../types'
import {
  loadAchievements,
  loadDNA,
  loadRecords,
  loadSettings,
  loadWishes,
  saveAchievements,
  saveDNA,
  saveRecords,
  saveSettings,
  saveWishes,
} from '../utils/storage'
import { achievementMap, getAchievementName } from '../constants/achievements'
import { checkAchievements, mergeAchievements, type CheckContext } from '../utils/achievement-rules'
import { calculateSpendingDNA, canGenerateDNA, shouldRefreshDNA } from '../utils/dna-calculator'
import { themes, type ThemeKey } from '../constants/themes'

export interface AppDataValue {
  records: RecordItem[]
  wishes: Wish[]
  achievements: Achievement[]
  dna: SpendingDNA | null
  settings: UserSettings
  setTheme: (theme: ThemeKey) => void
  setLanguage: (language: 'en' | 'zh') => void
  clearAllData: () => void
  addRecord: (r: Omit<RecordItem, 'id' | 'createdAt'>) => RecordItem
  updateRecord: (id: string, patch: Partial<RecordItem>) => void
  deleteRecord: (id: string) => void
  addWish: (w: Omit<Wish, 'id' | 'createdAt' | 'deposits' | 'status' | 'savedAmount'>) => Wish | null
  updateWish: (id: string, patch: Partial<Wish>) => void
  deleteWish: (id: string) => void
  depositToWish: (wishId: string, amountFen: number) => { completed: boolean }
  archiveCompletedWish: (id: string) => void
  refreshDNA: () => void
  pendingAchievement: AchievementUnlockEvent | null
  clearPendingAchievement: () => void
  wishJustCompleted: Wish | null
  clearWishJustCompleted: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppDataContext = createContext<AppDataValue | null>(null)

const MAX_ACTIVE_WISHES = 5

function buildAchievementMap(list: Achievement[]): Map<string, Achievement> {
  return new Map(list.map((a) => [a.id, a]))
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const initialSettings = loadSettings()
  const [records, setRecords] = useState<RecordItem[]>(loadRecords)
  const [wishes, setWishes] = useState<Wish[]>(loadWishes)
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements)
  const [dna, setDNA] = useState<SpendingDNA | null>(() => {
    const stored = loadDNA()
    if (!canGenerateDNA(records)) return stored
    if (!shouldRefreshDNA(stored)) return stored
    return calculateSpendingDNA(records, new Date(), initialSettings.language) ?? stored
  })
  const [settings, setSettings] = useState<UserSettings>(initialSettings)

  const [pendingAchievement, setPendingAchievement] = useState<AchievementUnlockEvent | null>(null)
  const [wishJustCompleted, setWishJustCompleted] = useState<Wish | null>(null)

  const achTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const achievementsRef = useRef(achievements)
  useEffect(() => {
    achievementsRef.current = achievements
  }, [achievements])

  useEffect(() => {
    saveRecords(records)
  }, [records])
  useEffect(() => {
    saveWishes(wishes)
  }, [wishes])
  useEffect(() => {
    saveAchievements(achievements)
  }, [achievements])
  useEffect(() => {
    saveDNA(dna)
  }, [dna])
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const currentTheme = themes[settings.theme] ?? themes.signature
    const root = document.documentElement
    for (const [k, v] of Object.entries(currentTheme)) {
      root.style.setProperty(k, v)
    }
  }, [settings.theme])

  useEffect(() => {
    document.documentElement.lang = settings.language === 'zh' ? 'zh-CN' : 'en'
  }, [settings.language])

  useEffect(() => {
    if (!canGenerateDNA(records)) return
    setDNA((prev) => {
      if (!prev) return prev
      return calculateSpendingDNA(records, new Date(), settings.language) ?? prev
    })
  }, [records, settings.language])


  const runAchievementScan = useCallback(
    (recordsSnap: RecordItem[], wishesSnap: Wish[]) => {
      const existing = buildAchievementMap(achievementsRef.current)
      const ctx: CheckContext = { records: recordsSnap, wishes: wishesSnap, existing }
      const newIds = checkAchievements(ctx)
      if (newIds.length === 0) return
      const now = new Date().toISOString()
      setAchievements((prev) => mergeAchievements(prev, newIds, now))
      const first = newIds[0]
      const def = achievementMap.get(first)
      if (def) {
        setPendingAchievement({ id: first, name: getAchievementName(settings.language, first), icon: def.icon })
      }
    },
    [settings.language],
  )

  const scheduleAchievementCheck = useCallback(
    (r: RecordItem[], w: Wish[]) => {
      if (achTimer.current) clearTimeout(achTimer.current)
      achTimer.current = setTimeout(() => runAchievementScan(r, w), 280)
    },
    [runAchievementScan],
  )

  const maybeUpdateDNA = useCallback(
    (recs: RecordItem[]) => {
      if (!canGenerateDNA(recs)) return
      setDNA((prev) => {
        if (!shouldRefreshDNA(prev)) return prev
        return calculateSpendingDNA(recs, new Date(), settings.language) ?? prev
      })
    },
    [settings.language],
  )

  const addRecord = useCallback(
    (input: Omit<RecordItem, 'id' | 'createdAt'>) => {
      const item: RecordItem = {
        ...input,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      }
      setRecords((prev) => {
        const next = [item, ...prev]
        scheduleAchievementCheck(next, wishes)
        maybeUpdateDNA(next)
        return next
      })
      return item
    },
    [maybeUpdateDNA, scheduleAchievementCheck, wishes],
  )

  const updateRecord = useCallback(
    (id: string, patch: Partial<RecordItem>) => {
      setRecords((prev) => {
        const next = prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
        scheduleAchievementCheck(next, wishes)
        maybeUpdateDNA(next)
        return next
      })
    },
    [maybeUpdateDNA, scheduleAchievementCheck, wishes],
  )

  const deleteRecord = useCallback(
    (id: string) => {
      setRecords((prev) => {
        const next = prev.filter((x) => x.id !== id)
        scheduleAchievementCheck(next, wishes)
        maybeUpdateDNA(next)
        return next
      })
    },
    [maybeUpdateDNA, scheduleAchievementCheck, wishes],
  )

  const addWish = useCallback(
    (input: Omit<Wish, 'id' | 'createdAt' | 'deposits' | 'status' | 'savedAmount'>) => {
      const active = wishes.filter((w) => w.status === 'active').length
      if (active >= MAX_ACTIVE_WISHES) return null
      const w: Wish = {
        ...input,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        deposits: [],
        status: 'active',
        savedAmount: 0,
      }
      setWishes((prev) => {
        const next = [w, ...prev]
        scheduleAchievementCheck(records, next)
        return next
      })
      return w
    },
    [records, scheduleAchievementCheck, wishes],
  )

  const updateWish = useCallback(
    (id: string, patch: Partial<Wish>) => {
      setWishes((prev) => {
        const next = prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
        scheduleAchievementCheck(records, next)
        return next
      })
    },
    [records, scheduleAchievementCheck],
  )

  const deleteWish = useCallback(
    (id: string) => {
      setWishes((prev) => {
        const next = prev.filter((x) => x.id !== id)
        scheduleAchievementCheck(records, next)
        return next
      })
    },
    [records, scheduleAchievementCheck],
  )

  const depositToWish = useCallback(
    (wishId: string, amountFen: number): { completed: boolean } => {
      let doneWish: Wish | null = null
      setWishes((prev) => {
        const next = prev.map((w) => {
          if (w.id !== wishId || w.status !== 'active') return w
          const dep = { id: uuidv4(), amount: amountFen, date: new Date().toISOString().slice(0, 10) }
          const savedAmount = w.savedAmount + amountFen
          const deposits = [...w.deposits, dep]
          const done = savedAmount >= w.targetAmount
          if (done) {
            const completedWish: Wish = {
              ...w,
              savedAmount: w.targetAmount,
              deposits,
              status: 'completed',
              completedAt: new Date().toISOString(),
            }
            doneWish = completedWish
            return completedWish
          }
          return { ...w, savedAmount, deposits }
        })
        scheduleAchievementCheck(records, next)
        return next
      })
      if (doneWish) setWishJustCompleted(doneWish)
      return { completed: !!doneWish }
    },
    [records, scheduleAchievementCheck],
  )

  const archiveCompletedWish = useCallback((id: string) => {
    /* no-op archive — completed wishes stay in list with status */
    void id
  }, [])

  const refreshDNA = useCallback(() => {
    if (!canGenerateDNA(records)) return
    setDNA(calculateSpendingDNA(records, new Date(), settings.language))
  }, [records, settings.language])

  const clearPendingAchievement = useCallback(() => setPendingAchievement(null), [])
  const clearWishJustCompleted = useCallback(() => setWishJustCompleted(null), [])
  const setTheme = useCallback((theme: ThemeKey) => {
    setSettings((prev) => ({ ...prev, theme }))
  }, [])
  const setLanguage = useCallback((language: 'en' | 'zh') => {
    setSettings((prev) => ({ ...prev, language }))
  }, [])
  const clearAllData = useCallback(() => {
    setRecords([])
    setWishes([])
    setAchievements([])
    setDNA(null)
    setPendingAchievement(null)
    setWishJustCompleted(null)
  }, [])

  const value = useMemo<AppDataValue>(
    () => ({
      records,
      wishes,
      achievements,
      dna,
      settings,
      setTheme,
      setLanguage,
      clearAllData,
      addRecord,
      updateRecord,
      deleteRecord,
      addWish,
      updateWish,
      deleteWish,
      depositToWish,
      archiveCompletedWish,
      refreshDNA,
      pendingAchievement,
      clearPendingAchievement,
      wishJustCompleted,
      clearWishJustCompleted,
    }),
    [
      records,
      wishes,
      achievements,
      dna,
      settings,
      setTheme,
      setLanguage,
      clearAllData,
      addRecord,
      updateRecord,
      deleteRecord,
      addWish,
      updateWish,
      deleteWish,
      depositToWish,
      archiveCompletedWish,
      refreshDNA,
      pendingAchievement,
      clearPendingAchievement,
      wishJustCompleted,
      clearWishJustCompleted,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

