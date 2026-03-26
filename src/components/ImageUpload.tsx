import { Camera, ImageUp } from 'lucide-react'
import { useRef, useState } from 'react'
import { WishImage } from './WishImage'
import { useAppData } from '../hooks/useAppData'
import { getStrings } from '../constants/strings'

interface Props {
  value: string
  onChange: (value: string) => void
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 2 * 1024 * 1024

export function ImageUpload({ value, onChange }: Props) {
  const { settings } = useAppData()
  const s = getStrings(settings.language)
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const showError = (msg: string) => {
    setError(msg)
    window.setTimeout(() => setError(null), 1400)
  }

  const handleFile = (file?: File) => {
    if (!file) return
    if (!ALLOWED.includes(file.type)) {
      showError(s.image.typeError)
      return
    }
    if (file.size > MAX_SIZE) {
      showError(s.image.sizeError)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex items-center gap-4">
        <WishImage src={value} alt={s.image.preview} size={80} />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface)]"
          >
            {value ? <ImageUp size={16} /> : <Camera size={16} />}
            {value ? s.image.change : s.image.upload}
          </button>
          <p className="text-xs text-[#9CA3AF]">{s.image.support}</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--color-hot)]">{error}</p>}
    </div>
  )
}
