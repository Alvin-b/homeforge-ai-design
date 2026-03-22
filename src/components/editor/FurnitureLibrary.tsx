import React, { useState, useMemo } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { CATEGORIES, FURNITURE_ITEMS } from '@/types/furniture'
import { v4 as uuidv4 } from 'uuid'

const CAT_COLORS: Record<string, string> = {
  sofa: '#c2b280', bed: '#5c3317', table: '#b08d57', chair: '#8b8589',
  desk: '#b08d57', storage: '#6b4226', kitchen: '#d4d4d4', bath: '#faf8f5',
  decor: '#2d5a27', light: '#f5e6d3', default: '#b08d57',
}

function FurnitureIcon({ item }: { item: typeof FURNITURE_ITEMS[0] }) {
  const cat = item.id.split('-')[0]
  const color = CAT_COLORS[cat] || CAT_COLORS.default
  const w = Math.min(item.width * 28, 56)
  const d = Math.min(item.depth * 28, 44)

  return (
    <svg width="80" height="70" viewBox="0 0 80 70" style={{ display: 'block', margin: '0 auto' }}>
      {/* shadow */}
      <ellipse cx="40" cy="62" rx={w * 0.5} ry="5" fill="rgba(0,0,0,0.08)" />
      {/* main body — isometric-ish box */}
      {/* top face */}
      <polygon
        points={`40,${22 - d*0.18} ${40 + w*0.5},${22 + d*0.1} 40,${22 + d*0.38} ${40 - w*0.5},${22 + d*0.1}`}
        fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth="0.5"
      />
      {/* left face */}
      <polygon
        points={`${40 - w*0.5},${22 + d*0.1} 40,${22 + d*0.38} 40,${52} ${40 - w*0.5},${52 - d*0.28}`}
        fill={color} style={{ filter: 'brightness(0.82)' }} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"
      />
      {/* right face */}
      <polygon
        points={`${40 + w*0.5},${22 + d*0.1} 40,${22 + d*0.38} 40,${52} ${40 + w*0.5},${52 - d*0.28}`}
        fill={color} style={{ filter: 'brightness(0.92)' }} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"
      />
    </svg>
  )
}

export default function FurnitureLibrary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { placeItem } = useEditorStore()

  const filtered = useMemo(() => FURNITURE_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'all' || item.category === activeCategory
    return matchSearch && matchCat
  }), [search, activeCategory])

  const handleAdd = (item: typeof FURNITURE_ITEMS[0]) => {
    placeItem({
      id: uuidv4(),
      furnitureId: item.id,
      name: item.name,
      emoji: item.emoji,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      width: item.width,
      depth: item.depth,
      height: item.height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  }

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-foreground tracking-wide uppercase">Furniture</h2>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{filtered.length}</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search furniture..."
            className="w-full pl-7 pr-3 py-1.5 bg-muted border border-border rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-accent text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-1 px-2 py-2 overflow-x-auto border-b border-border" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium transition-all flex-shrink-0 ${
              activeCategory === cat.id
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'thin' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-xs text-muted-foreground">No items found</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }}
              className="mt-2 text-[10px] text-accent underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => handleAdd(item)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative bg-muted/40 hover:bg-accent/5 border border-border hover:border-accent/40 rounded-xl overflow-hidden transition-all text-left active:scale-[0.97]"
              >
                {item.isPremium && (
                  <div className="absolute top-1.5 right-1.5 z-10 bg-amber-400 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">PRO</div>
                )}
                {/* Isometric SVG preview — no WebGL needed */}
                <div className="w-full pt-2 pb-1 flex items-center justify-center">
                  <FurnitureIcon item={item} />
                </div>
                <div className="px-2 py-1.5 border-t border-border/50">
                  <p className="text-[10px] font-medium text-foreground leading-tight truncate">{item.name}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{item.width}m × {item.depth}m</p>
                </div>
                {hoveredId === item.id && (
                  <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
                    <div className="bg-accent text-accent-foreground text-[9px] font-semibold px-2 py-1 rounded-full shadow-sm">+ Place</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-t border-border flex items-center justify-between">
        <p className="text-[9px] text-muted-foreground">{filtered.length} items · click to place</p>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  )
}
