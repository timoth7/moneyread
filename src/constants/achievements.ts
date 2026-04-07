import type { Locale } from './strings'
import { strings } from './strings'

export interface AchievementDef {
  id: string
  name: string
  icon: string
  category: 'habit' | 'wish' | 'pattern' | 'hidden'
  hidden?: boolean
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_record', name: 'First Steps', icon: '🌱', category: 'habit' },
  { id: 'streak_7', name: 'On a Roll', icon: '🔥', category: 'habit' },
  { id: 'streak_30', name: 'Habit Formed', icon: '💎', category: 'habit' },
  { id: 'records_100', name: 'Logging Pro', icon: '📝', category: 'habit' },
  { id: 'records_1000', name: 'Thousand Entries', icon: '🏅', category: 'habit' },
  { id: 'all_categories', name: 'Category Master', icon: '🎨', category: 'habit' },
  { id: 'first_deposit', name: 'Seed Planted', icon: '🌰', category: 'wish' },
  { id: 'first_wish_done', name: 'Wish Granted', icon: '⭐', category: 'wish' },
  { id: 'wishes_5', name: 'Wish Collector', icon: '🌟', category: 'wish' },
  { id: 'wish_100', name: 'Hundred Club', icon: '💯', category: 'wish' },
  { id: 'wish_1000', name: 'Thousand Club', icon: '👑', category: 'wish' },
  { id: 'daily_under_50', name: 'Penny Pincher', icon: '🧮', category: 'pattern' },
  { id: 'zero_spend_day', name: 'Zero Day', icon: '🧘', category: 'pattern' },
  { id: 'weekend_low', name: 'Chill Weekend', icon: '🍃', category: 'pattern' },
  { id: 'midnight_shop', name: 'Night Owl Spender', icon: '🌙', category: 'hidden', hidden: true },
  { id: 'milktea_20', name: 'Boba Addict', icon: '🧋', category: 'hidden', hidden: true },
  { id: 'moonlight_awaken', name: 'Comeback Kid', icon: '🌅', category: 'hidden', hidden: true },
]

export const achievementMap = new Map(ACHIEVEMENTS.map((a) => [a.id, a]))

export function getAchievementName(locale: Locale, id: string): string {
  return strings[locale].achievementNames[id as keyof typeof strings.en.achievementNames] ?? id
}

export function getAchievementDescription(locale: Locale, id: string): string {
  const pack = strings[locale].achievementDesc
  const v = pack[id as keyof typeof pack]
  return typeof v === 'string' ? v : ''
}
