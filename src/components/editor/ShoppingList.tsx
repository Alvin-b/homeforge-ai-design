import React from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { ShoppingCart, DollarSign } from 'lucide-react'

const PRICE_MAP: Record<string, { min: number; max: number }> = {
  sofa: { min: 400, max: 1200 },
  bed: { min: 300, max: 800 },
  table: { min: 80, max: 400 },
  chair: { min: 50, max: 250 },
  storage: { min: 100, max: 500 },
  kitchen: { min: 200, max: 1500 },
  bathroom: { min: 150, max: 800 },
  decor: { min: 20, max: 150 },
  lighting: { min: 30, max: 200 },
}

function getPrice(furnitureId: string): { min: number; max: number } {
  const cat = furnitureId.split('-')[0]
  return PRICE_MAP[cat] || { min: 50, max: 200 }
}

export default function ShoppingList({ onClose }: { onClose?: () => void }) {
  const placedItems = useEditorStore((s) => s.placedItems)

  const grouped = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number; min: number; max: number }>()
    for (const item of placedItems) {
      const key = item.furnitureId
      const { min, max } = getPrice(key)
      const existing = map.get(key)
      if (existing) {
        existing.count++
        existing.min += min
        existing.max += max
      } else {
        map.set(key, { name: item.name, count: 1, min, max })
      }
    }
    return Array.from(map.values())
  }, [placedItems])

  const totalMin = grouped.reduce((a, g) => a + g.min, 0)
  const totalMax = grouped.reduce((a, g) => a + g.max, 0)

  return (
    <div className="flex flex-col h-full w-64 bg-card border-l border-border">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Shopping List
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground">
            ×
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 text-sm">
        {grouped.length === 0 ? (
          <p className="text-muted-foreground text-xs">Add furniture to see cost estimates.</p>
        ) : (
          <>
            {grouped.map((g, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-foreground">{g.name} {g.count > 1 && `×${g.count}`}</span>
                <span className="text-muted-foreground tabular-nums">
                  ${g.min}–${g.max}
                </span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-border font-semibold flex justify-between">
              <span>Estimated total</span>
              <span className="text-highlight tabular-nums">
                ${totalMin.toLocaleString()}–${totalMax.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
