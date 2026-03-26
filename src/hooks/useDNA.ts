import { useAppData } from '../hooks/useAppData'

export function useDNA() {
  const { dna, refreshDNA } = useAppData()
  return { dna, refreshDNA }
}
