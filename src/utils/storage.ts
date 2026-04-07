import type {
  Achievement,
  AppStorageShape,
  QuickTemplate,
  RecordItem,
  SpendingDNA,
  UserSettings,
  Wish,
} from '../types'

const KEY_ONBOARDING = 'mr_onboarding_complete'
const KEY_LIMIT_WARNED = 'mr_limit_warned_date'

const DEFAULT_SETTINGS = (): UserSettings => ({
  currency: 'CNY',
  theme: 'signature',
  language: 'en',
  customCategories: [],
  createdAt: new Date().toISOString(),
  dailySpendingLimitFen: null,
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
    dailySpendingLimitFen:
      parsed.dailySpendingLimitFen === undefined ? defaults.dailySpendingLimitFen : parsed.dailySpendingLimitFen,
  }
}

export function loadTemplates(): QuickTemplate[] {
  return readJSON('mr_templates', [])
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

export function saveTemplates(t: QuickTemplate[]) {
  localStorage.setItem('mr_templates', JSON.stringify(t))
}

export function loadOnboardingComplete(): boolean {
  return localStorage.getItem(KEY_ONBOARDING) === 'true'
}

export function saveOnboardingComplete() {
  localStorage.setItem(KEY_ONBOARDING, 'true')
}

export function clearOnboardingComplete() {
  localStorage.removeItem(KEY_ONBOARDING)
}

export function loadLimitWarnedDate(): string | null {
  return localStorage.getItem(KEY_LIMIT_WARNED)
}

export function saveLimitWarnedDate(isoDate: string) {
  localStorage.setItem(KEY_LIMIT_WARNED, isoDate)
}

export function clearLimitWarnedDate() {
  localStorage.removeItem(KEY_LIMIT_WARNED)
}

export function clearAuxLocalFlags() {
  clearOnboardingComplete()
  clearLimitWarnedDate()
}
