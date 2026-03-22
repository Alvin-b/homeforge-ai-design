import React from 'react'
import { Link } from 'react-router-dom'
import { LayoutTemplate, Square, Home, Utensils, Bed } from 'lucide-react'
import { TEMPLATES } from '@/data/templates'
import { useEditorStore } from '@/store/useEditorStore'
import { v4 as uuidv4 } from 'uuid'

const ICONS: Record<string, React.ReactNode> = {
  blank: <Square className="w-8 h-8" />,
  'living-room': <Home className="w-8 h-8" />,
  bedroom: <Bed className="w-8 h-8" />,
  kitchen: <Utensils className="w-8 h-8" />,
}

export default function TemplatePicker({ onSelect }: { onSelect?: () => void }) {
  const hydrate = useEditorStore((s) => s.hydrate)

  const handleSelect = (t: typeof TEMPLATES[0]) => {
    const snapshot = JSON.parse(JSON.stringify(t.snapshot))
    const wallIdMap: Record<string, string> = {}
    snapshot.walls = snapshot.walls.map((w: any) => {
      const newId = uuidv4()
      wallIdMap[w.id] = newId
      return { ...w, id: newId }
    })
    snapshot.rooms = snapshot.rooms.map((r: any) => ({ ...r, id: uuidv4() }))
    snapshot.doors = (snapshot.doors || []).map((d: any) => ({
      ...d, id: uuidv4(), wallId: wallIdMap[d.wallId] ?? d.wallId
    }))
    snapshot.windows = (snapshot.windows || []).map((w: any) => ({
      ...w, id: uuidv4(), wallId: wallIdMap[w.wallId] ?? w.wallId
    }))
    snapshot.stairs = snapshot.stairs || []
    snapshot.placedItems = (snapshot.placedItems || []).map((i: any) => ({ ...i, id: uuidv4() }))
    hydrate(snapshot)
    onSelect?.()
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => handleSelect(t)}
          className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-highlight/50 hover:shadow-medium text-left transition-all"
        >
          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            {ICONS[t.id] || <LayoutTemplate className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.name}</h3>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
