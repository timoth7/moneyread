import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../../hooks/useAppData'
import { getStrings } from '../../constants/strings'

export function BackButton({ fallback = '/' }: { fallback?: string }) {
  const navigate = useNavigate()
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) navigate(-1)
        else navigate(fallback)
      }}
      className="inline-flex items-center justify-center rounded-full p-2 text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
      aria-label={s.common.back}
    >
      <ArrowLeft size={24} />
    </button>
  )
}
