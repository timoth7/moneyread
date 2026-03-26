import { useAppData } from '../hooks/useAppData'

export function useWishes() {
  const { wishes, addWish, updateWish, deleteWish, depositToWish } = useAppData()
  return { wishes, addWish, updateWish, deleteWish, depositToWish }
}
