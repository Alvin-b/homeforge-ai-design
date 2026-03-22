import React, { useState } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { Trash2, RotateCw, RotateCcw, Lock, Unlock, FlipHorizontal } from 'lucide-react'

// ─── Preset colors per category ──────────────────────────────────────
const COLOR_PRESETS: Record<string, string[]> = {
  sofa:    ['#c2b280', '#8b8589', '#4a4a4a', '#5c3317', '#ffffff', '#1a1a2e'],
  chair:   ['#b08d57', '#5c3317', '#8b8589', '#4a4a4a', '#c2b280', '#2d4a6e'],
  bed:     ['#5c3317', '#b08d57', '#8b8589', '#3d2b1f', '#c2b280', '#2d4a6e'],
  table:   ['#b08d57', '#5c3317', '#3d2b1f', '#d4d4d4', '#1a1a1a', '#c2b280'],
  desk:    ['#b08d57', '#5c3317', '#d4d4d4', '#1a1a1a', '#3d2b1f', '#c2b280'],
  storage: ['#5c3317', '#b08d57', '#3d2b1f', '#d4d4d4', '#1a1a1a', '#c2b280'],
  default: ['#c2b280', '#8b8589', '#5c3317', '#b08d57', '#4a4a4a', '#d4d4d4'],
}

function getPresets(furnitureId: string) {
  const cat = furnitureId.split('-')[0]
  return COLOR_PRESETS[cat] || COLOR_PRESETS.default
}

// ─── Slider row ───────────────────────────────────────────────────────
function SliderRow({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step: number; unit: string; onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        <span className="text-[11px] font-medium text-foreground tabular-nums">
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none bg-muted rounded-full cursor-pointer accent-accent"
        style={{ accentColor: 'hsl(var(--accent))' }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] text-muted-foreground">{min}{unit}</span>
        <span className="text-[9px] text-muted-foreground">{max}{unit}</span>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="w-56 h-full bg-card border-l border-border flex flex-col items-center justify-center gap-2 px-4">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">✦</div>
      <p className="text-xs font-medium text-foreground text-center">No selection</p>
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        Click any wall or furniture item to see its properties
      </p>
    </div>
  )
}

// ─── Wall panel ───────────────────────────────────────────────────────
function WallPanel({ wallId }: { wallId: string }) {
  const { walls, updateWall, deleteSelected } = useEditorStore()
  const wall = walls.find(w => w.id === wallId)
  if (!wall) return null

  const length = Math.sqrt(
    Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)
  ) / 50

  return (
    <div className="w-56 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Selected</p>
            <h3 className="text-sm font-semibold text-foreground">Wall</h3>
          </div>
          <button
            onClick={deleteSelected}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'thin' }}>
        <Section title="Dimensions">
          <div className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Length</span>
            <span className="text-[11px] font-semibold text-foreground tabular-nums">{length.toFixed(2)}m</span>
          </div>
          <SliderRow
            label="Height" value={wall.height} min={1.8} max={4.0} step={0.1} unit="m"
            onChange={v => updateWall(wall.id, { height: v })}
          />
          <SliderRow
            label="Thickness" value={wall.thickness} min={4} max={40} step={1} unit="px"
            onChange={v => updateWall(wall.id, { thickness: v })}
          />
        </Section>

        <Section title="Appearance">
          <div>
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={wall.color}
                onChange={e => updateWall(wall.id, { color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground font-mono">{wall.color}</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}

// ─── Item panel ───────────────────────────────────────────────────────
function ItemPanel({ itemId }: { itemId: string }) {
  const { placedItems, updateItem, deleteSelected } = useEditorStore()
  const item = placedItems.find(i => i.id === itemId)
  if (!item) return null

  const presets = getPresets(item.furnitureId)
  const cat = item.furnitureId.split('-')[0]

  return (
    <div className="w-56 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Selected</p>
            <h3 className="text-sm font-semibold text-foreground truncate flex items-center gap-1">
              <span>{item.emoji}</span>
              <span className="truncate">{item.name}</span>
            </h3>
          </div>
          <button
            onClick={deleteSelected}
            className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors ml-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'thin' }}>

        {/* Position */}
        <Section title="Position">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'X', val: item.x, key: 'x' },
              { label: 'Y', val: item.y, key: 'y' },
            ].map(({ label, val, key }) => (
              <div key={key}>
                <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
                <input
                  type="number"
                  value={Math.round(val)}
                  onChange={e => updateItem(item.id, { [key]: parseInt(e.target.value) || 0 })}
                  className="w-full bg-muted border border-border rounded-md px-2 py-1.5 text-[11px] text-foreground tabular-nums focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Dimensions */}
        <Section title="Dimensions">
          <SliderRow
            label="Width" value={item.width} min={0.3} max={5.0} step={0.05} unit="m"
            onChange={v => updateItem(item.id, { width: v })}
          />
          <SliderRow
            label="Depth" value={item.depth} min={0.3} max={5.0} step={0.05} unit="m"
            onChange={v => updateItem(item.id, { depth: v })}
          />
          <SliderRow
            label="Height" value={item.height} min={0.1} max={3.0} step={0.05} unit="m"
            onChange={v => updateItem(item.id, { height: v })}
          />
        </Section>

        {/* Rotation */}
        <Section title="Rotation">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Angle</label>
              <span className="text-[11px] font-medium text-foreground tabular-nums">{item.rotation}°</span>
            </div>
            <input
              type="range" min={0} max={359} step={1} value={item.rotation}
              onChange={e => updateItem(item.id, { rotation: parseInt(e.target.value) })}
              className="w-full" style={{ accentColor: 'hsl(var(--accent))' }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateItem(item.id, { rotation: (item.rotation - 90 + 360) % 360 })}
              className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg py-1.5 text-[10px] font-medium transition-colors active:scale-[0.97]"
            >
              <RotateCcw className="w-3 h-3" />
              -90°
            </button>
            <button
              onClick={() => updateItem(item.id, { rotation: (item.rotation + 90) % 360 })}
              className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg py-1.5 text-[10px] font-medium transition-colors active:scale-[0.97]"
            >
              <RotateCw className="w-3 h-3" />
              +90°
            </button>
          </div>
        </Section>

        {/* Color */}
        <Section title="Color">
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {presets.map(color => (
              <button
                key={color}
                onClick={() => updateItem(item.id, { color })}
                title={color}
                className="w-full aspect-square rounded-md border-2 transition-all active:scale-[0.9]"
                style={{
                  background: color,
                  borderColor: item.color === color ? 'hsl(var(--accent))' : 'transparent',
                  boxShadow: item.color === color ? '0 0 0 1px hsl(var(--accent))' : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={item.color || presets[0]}
              onChange={e => updateItem(item.id, { color: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-border flex-shrink-0"
            />
            <span className="text-[10px] text-muted-foreground font-mono">{item.color || presets[0]}</span>
          </div>
        </Section>

        {/* Quick actions */}
        <Section title="Actions">
          <button
            onClick={() => updateItem(item.id, { rotation: 0, scaleX: 1, scaleY: 1 })}
            className="w-full bg-muted hover:bg-muted/80 text-foreground rounded-lg py-2 text-[10px] font-medium transition-colors active:scale-[0.97] flex items-center justify-center gap-1.5"
          >
            <FlipHorizontal className="w-3 h-3" />
            Reset transform
          </button>
          <button
            onClick={deleteSelected}
            className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg py-2 text-[10px] font-medium transition-colors active:scale-[0.97] flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            Delete item
          </button>
        </Section>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────
export default function PropertiesPanel() {
  const { selectedId, walls, placedItems } = useEditorStore()

  if (!selectedId) return <EmptyState />

  const isWall = walls.some(w => w.id === selectedId)
  const isItem = placedItems.some(i => i.id === selectedId)

  if (isWall) return <WallPanel wallId={selectedId} />
  if (isItem) return <ItemPanel itemId={selectedId} />

  return <EmptyState />
}
