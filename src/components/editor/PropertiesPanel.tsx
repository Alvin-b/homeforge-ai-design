import React from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { Trash2, RotateCw } from 'lucide-react'

export default function PropertiesPanel() {
  const { selectedId, walls, rooms, stairs, placedItems, updateWall, updateRoom, updateItem, updateStair, deleteSelected } = useEditorStore()

  if (!selectedId) {
    return (
      <div className="w-64 h-full bg-card border-l border-border p-4 flex items-center justify-center">
        <p className="text-xs text-muted-foreground text-center">
          Select an element to view its properties
        </p>
      </div>
    )
  }

  const wall = walls.find(w => w.id === selectedId)
  const room = rooms.find(r => r.id === selectedId)
  const stair = stairs.find(s => s.id === selectedId)
  const item = placedItems.find(i => i.id === selectedId)

  if (room) {
    return (
      <div className="w-64 h-full bg-card border-l border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-foreground">Room</h3>
          <button onClick={deleteSelected} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors active:scale-[0.95]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Name</label>
            <input
              value={room.name}
              onChange={(e) => updateRoom(room.id, { name: e.target.value })}
              className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Floor Color</label>
            <input
              type="color"
              value={room.floorColor}
              onChange={(e) => updateRoom(room.id, { floorColor: e.target.value })}
              className="w-full mt-1 h-8 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Wall Color</label>
            <input
              type="color"
              value={room.wallColor}
              onChange={(e) => updateRoom(room.id, { wallColor: e.target.value })}
              className="w-full mt-1 h-8 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  }

  if (stair) {
    return (
      <div className="w-64 h-full bg-card border-l border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-foreground">Stairs</h3>
          <button onClick={deleteSelected} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors active:scale-[0.95]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Width (m)</label>
              <input
                type="number"
                step={0.1}
                value={stair.width}
                onChange={(e) => updateStair(stair.id, { width: parseFloat(e.target.value) || 1.2 })}
                className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Depth (m)</label>
              <input
                type="number"
                step={0.1}
                value={stair.depth}
                onChange={(e) => updateStair(stair.id, { depth: parseFloat(e.target.value) || 2.5 })}
                className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (wall) {
    const length = Math.sqrt(
      Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
    ) / 50

    return (
      <div className="w-64 h-full bg-card border-l border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-foreground">Wall</h3>
          <button onClick={deleteSelected} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors active:scale-[0.95]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Length</label>
            <p className="text-sm font-medium text-foreground tabular-nums">{length.toFixed(2)}m</p>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Height</label>
            <input
              type="number"
              step={0.1}
              value={wall.height}
              onChange={(e) => updateWall(wall.id, { height: parseFloat(e.target.value) || 2.7 })}
              className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Thickness</label>
            <input
              type="number"
              step={1}
              value={wall.thickness}
              onChange={(e) => updateWall(wall.id, { thickness: parseInt(e.target.value) || 8 })}
              className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Color</label>
            <input
              type="color"
              value={wall.color}
              onChange={(e) => updateWall(wall.id, { color: e.target.value })}
              className="w-full mt-1 h-8 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  }

  if (item) {
    return (
      <div className="w-64 h-full bg-card border-l border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-display font-semibold text-foreground">{item.emoji} {item.name}</h3>
          <button onClick={deleteSelected} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors active:scale-[0.95]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">X</label>
              <input
                type="number"
                value={Math.round(item.x)}
                onChange={(e) => updateItem(item.id, { x: parseInt(e.target.value) || 0 })}
                className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground tabular-nums"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Y</label>
              <input
                type="number"
                value={Math.round(item.y)}
                onChange={(e) => updateItem(item.id, { y: parseInt(e.target.value) || 0 })}
                className="w-full mt-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground tabular-nums"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Rotation</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min={0}
                max={360}
                value={item.rotation}
                onChange={(e) => updateItem(item.id, { rotation: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground tabular-nums w-8">{item.rotation}°</span>
            </div>
          </div>
          <button
            onClick={() => updateItem(item.id, { rotation: (item.rotation + 90) % 360 })}
            className="w-full flex items-center justify-center gap-2 bg-muted text-foreground rounded-lg py-2 text-xs font-medium hover:bg-muted/80 transition-colors active:scale-[0.97]"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Rotate 90°
          </button>
        </div>
      </div>
    )
  }

  return null
}
