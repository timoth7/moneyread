import { useContext } from 'react'
import { AppDataContext, type AppDataValue } from '../context/AppDataContext'

export function useAppData(): AppDataValue {
  const v = useContext(AppDataContext)
  if (!v) throw new Error('useAppData must be used within AppDataProvider')
  return v
}
