import React, { useState } from 'react'
import { Plus, X, ImagePlus } from 'lucide-react'

const STORAGE_KEY = 'homeforge-moodboard'

function getImages(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveImages(images: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
}

export default function MoodBoard({ onClose }: { onClose?: () => void }) {
  const [images, setImages] = useState<string[]>(getImages())
  const inputRef = React.useRef<HTMLInputElement>(null)

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      const next = [...images, url]
      setImages(next)
      saveImages(next)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i)
    setImages(next)
    saveImages(next)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Mood Board</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-highlight/50 flex items-center justify-center text-muted-foreground hover:text-highlight transition-colors"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Collect inspiration images for your design.</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={addImage} className="hidden" />
    </div>
  )
}
