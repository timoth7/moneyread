export interface RecordItem {
  id: string
  amount: number
  type: 'expense' | 'income'
  category: string
  note?: string
  date: string
  createdAt: string
  wishDepositWishId?: string
}

export interface Deposit {
  id: string
  amount: number
  date: string
}

export interface Wish {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  icon: string
  deadline?: string
  status: 'active' | 'completed'
  deposits: Deposit[]
  createdAt: string
  completedAt?: string
}

export interface Achievement {
  id: string
  unlockedAt?: string
}

export interface SpendingDNA {
  generatedAt: string
  label: string
  emoji: string
  dimensions: {
    frequency: number
    concentration: number
    timePattern: number
    volatility: number
  }
  description: string
}

export interface CustomCategory {
  id: string
  name: string
  emoji: string
  type: 'expense' | 'income'
}

export interface UserSettings {
  currency: string
  theme: 'signature' | 'light' | 'dark' | 'lab'
  language: 'en' | 'zh'
  monthlyBudget?: number
  /** Daily expense cap in fen; null/undefined = off */
  dailySpendingLimitFen?: number | null
  customCategories: CustomCategory[]
  createdAt: string
}

export interface QuickTemplate {
  id: string
  name: string
  amount: number
  type: 'expense' | 'income'
  category: string
  note?: string
}

export interface AppStorageShape {
  mr_records: RecordItem[]
  mr_wishes: Wish[]
  mr_achievements: Achievement[]
  mr_dna: SpendingDNA | null
  mr_settings: UserSettings
  mr_templates: QuickTemplate[]
}

export interface AchievementUnlockEvent {
  id: string
  name: string
  icon: string
}
