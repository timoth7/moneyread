import { useAppData } from '../hooks/useAppData'

export function useRecords() {
  const { records, addRecord, updateRecord, deleteRecord } = useAppData()
  return { records, addRecord, updateRecord, deleteRecord }
}
