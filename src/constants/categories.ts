import type { LucideIcon } from 'lucide-react'
import type { Locale } from './strings'
import { strings } from './strings'
import {
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Bus,
  Smartphone,
  Gamepad2,
  BookOpen,
  Heart,
  Gift,
  Tag,
  Wallet,
  Briefcase,
  PartyPopper,
  Package,
} from 'lucide-react'

export interface CategoryDef {
  key: string
  label: string
  emoji: string
  icon: LucideIcon
  color: string
}

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { key: 'food', label: 'Food', emoji: '🍜', icon: UtensilsCrossed, color: '#FF6B6B' },
  { key: 'milkTea', label: 'Bubble tea', emoji: '☕', icon: Coffee, color: '#E8A87C' },
  { key: 'shopping', label: 'Shopping', emoji: '🛒', icon: ShoppingBag, color: '#C06C84' },
  { key: 'transport', label: 'Transport', emoji: '🚌', icon: Bus, color: '#6C5B7B' },
  { key: 'digital', label: 'Subscriptions', emoji: '📱', icon: Smartphone, color: '#355C7D' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎮', icon: Gamepad2, color: '#99B898' },
  { key: 'study', label: 'Study', emoji: '📚', icon: BookOpen, color: '#F8B500' },
  { key: 'medical', label: 'Health', emoji: '💊', icon: Heart, color: '#E84A5F' },
  { key: 'social', label: 'Social', emoji: '🎁', icon: Gift, color: '#F67280' },
  { key: 'other_exp', label: 'Other', emoji: '🏷️', icon: Tag, color: '#95A5A6' },
]

export const INCOME_CATEGORIES: CategoryDef[] = [
  { key: 'allowance', label: 'Allowance', emoji: '💰', icon: Wallet, color: 'var(--color-electric)' },
  { key: 'parttime', label: 'Part-time', emoji: '💼', icon: Briefcase, color: 'var(--color-primary)' },
  { key: 'redpacket', label: 'Gift money', emoji: '🧧', icon: PartyPopper, color: 'var(--color-solar)' },
  { key: 'resale', label: 'Resale', emoji: '📦', icon: Package, color: 'var(--color-accent)' },
  { key: 'other_inc', label: 'Other', emoji: '🏷️', icon: Tag, color: '#9CA3AF' },
]

const expMap = new Map(EXPENSE_CATEGORIES.map((c) => [c.key, c]))
const incMap = new Map(INCOME_CATEGORIES.map((c) => [c.key, c]))

export function getCategoryDef(type: 'expense' | 'income', key: string): CategoryDef | undefined {
  return type === 'expense' ? expMap.get(key) : incMap.get(key)
}

export function getCategoryLabel(locale: Locale, key: string): string {
  return strings[locale].categoryNames[key as keyof typeof strings.en.categoryNames] ?? key
}
