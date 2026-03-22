import React, { useState } from 'react'
import { Wand2, ChevronRight, X } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { FURNITURE_ITEMS } from '@/types/furniture'
import { v4 as uuidv4 } from 'uuid'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const ROOM_SHAPES = [
  { id: 'rect', label: 'Rectangle', w: 5, h: 4 },
  { id: 'square', label: 'Square', w: 4, h: 4 },
  { id: 'lshape', label: 'L-Shape', w: 6, h: 5 },
  { id: 'long', label: 'Long', w: 6, h: 3 },
  { id: 'wide', label: 'Wide', w: 4, h: 5 },
  { id: 'small', label: 'Small', w: 3, h: 3 },
]

const ROOM_TYPES = [
  { id: 'living', label: 'Living Room', emoji: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', emoji: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { id: 'bathroom', label: 'Bathroom', emoji: '🚿' },
  { id: 'kids', label: "Kids' Room", emoji: '🧸' },
  { id: 'office', label: 'Home Office', emoji: '💻' },
]

const STYLES = [
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'scandinavian', label: 'Scandinavian' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'boho', label: 'Boho' },
  { id: 'classic', label: 'Classic' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'country', label: 'Country' },
]

function getFurnitureForRoom(roomType: string): typeof FURNITURE_ITEMS {
  const catMap: Record<string, string> = {
    living: 'sofa',
    bedroom: 'bed',
    kitchen: 'kitchen',
    bathroom: 'bathroom',
    kids: 'bed',
    office: 'table',
  }
  const primary = catMap[roomType] || 'sofa'
  return FURNITURE_ITEMS.filter(
    (f) => f.category === primary || f.category === 'chair' || f.category === 'table' || f.category === 'decor'
  ).slice(0, 8)
}

export default function SmartWizard({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState(1)
  const [shape, setShape] = useState<typeof ROOM_SHAPES[0] | null>(null)
  const [roomType, setRoomType] = useState<typeof ROOM_TYPES[0] | null>(null)
  const [style, setStyle] = useState<typeof STYLES[0] | null>(null)
  const { addWall, addRoom, placeItem } = useEditorStore()

  const handleGenerate = () => {
    if (!shape || !roomType || !style) return
    const SCALE = 50
    const cx = 400
    const cy = 300
    const w = shape.w * SCALE
    const h = shape.h * SCALE
    const x1 = cx - w / 2
    const y1 = cy - h / 2
    const wallT = 8

    addWall({ id: uuidv4(), x1, y1, x2: x1 + w, y2: y1, thickness: wallT, color: '#374151', height: 2.7 })
    addWall({ id: uuidv4(), x1: x1 + w, y1, x2: x1 + w, y2: y1 + h, thickness: wallT, color: '#374151', height: 2.7 })
    addWall({ id: uuidv4(), x1: x1 + w, y1: y1 + h, x2: x1, y2: y1 + h, thickness: wallT, color: '#374151', height: 2.7 })
    addWall({ id: uuidv4(), x1, y1: y1 + h, x2: x1, y2: y1, thickness: wallT, color: '#374151', height: 2.7 })
    addRoom({
      id: uuidv4(),
      name: roomType.label,
      type: roomType.id,
      points: [
        { x: x1, y: y1 },
        { x: x1 + w, y: y1 },
        { x: x1 + w, y: y1 + h },
        { x: x1, y: y1 + h },
      ],
      floorColor: style.id === 'scandinavian' ? '#f5f5dc' : style.id === 'boho' ? '#deb887' : '#f3f4f6',
      wallColor: '#e5e7eb',
      ceilingHeight: 2.7,
    })

    const items = getFurnitureForRoom(roomType.id)
    const padding = 80
    const innerW = w - padding * 2
    const innerH = h - padding * 2
    items.forEach((item, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const x = x1 + padding + (innerW / 2) * (col / 2 + 0.25)
      const y = y1 + padding + (innerH / 2) * (row / 2 + 0.25)
      placeItem({
        id: uuidv4(),
        furnitureId: item.id,
        name: item.name,
        emoji: item.emoji,
        x,
        y,
        width: item.width,
        depth: item.depth,
        height: item.height,
        rotation: i % 2 === 0 ? 0 : 90,
        scaleX: 1,
        scaleY: 1,
      })
    })

    onOpenChange(false)
    setStep(1)
    setShape(null)
    setRoomType(null)
    setStyle(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-highlight" />
            Smart Wizard – AI Room Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Step 1 */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">1. Choose room shape</p>
            <div className="grid grid-cols-3 gap-2">
              {ROOM_SHAPES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s)}
                  className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                    shape?.id === s.id ? 'border-highlight bg-highlight/10' : 'border-border hover:bg-muted'
                  }`}
                >
                  {s.label}
                  <span className="block text-xs text-muted-foreground">{s.w}×{s.h}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">2. Select room type</p>
            <div className="grid grid-cols-3 gap-2">
              {ROOM_TYPES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoomType(r)}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                    roomType?.id === r.id ? 'border-highlight bg-highlight/10' : 'border-border hover:bg-muted'
                  }`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-xs">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">3. Pick a style</p>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    style?.id === s.id ? 'bg-highlight text-highlight-foreground' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!shape || !roomType || !style}
            className="w-full"
          >
            Generate Room
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
