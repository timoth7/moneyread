import type {
  Achievement,
  AppStorageShape,
  RecordItem,
  SpendingDNA,
  UserSettings,
  Wish,
} from '../types'

const DEFAULT_SETTINGS = (): UserSettings => ({
  currency: 'CNY',
  theme: 'signature',
  language: 'en',
  customCategories: [],
  createdAt: new Date().toISOString(),
})

function readJSON<T>(key: keyof AppStorageShape, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadRecords(): RecordItem[] {
  return readJSON('mr_records', [])
}

export function loadWishes(): Wish[] {
  return readJSON('mr_wishes', [])
}

export function loadAchievements(): Achievement[] {
  return readJSON('mr_achievements', [])
}

export function loadDNA(): SpendingDNA | null {
  return readJSON('mr_dna', null)
}

export function loadSettings(): UserSettings {
  const parsed = readJSON<Partial<UserSettings>>('mr_settings', {})
  const defaults = DEFAULT_SETTINGS()
  return {
    ...defaults,
    ...parsed,
    customCategories: parsed.customCategories ?? defaults.customCategories,
  }
}

export function saveRecords(r: RecordItem[]) {
  localStorage.setItem('mr_records', JSON.stringify(r))
}

export function saveWishes(w: Wish[]) {
  localStorage.setItem('mr_wishes', JSON.stringify(w))
}

export function saveAchievements(a: Achievement[]) {
  localStorage.setItem('mr_achievements', JSON.stringify(a))
}

export function saveDNA(d: SpendingDNA | null) {
  localStorage.setItem('mr_dna', JSON.stringify(d))
}

export function saveSettings(s: UserSettings) {
  localStorage.setItem('mr_settings', JSON.stringify(s))
}
