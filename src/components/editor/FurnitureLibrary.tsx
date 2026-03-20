import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { CATEGORIES, FURNITURE_ITEMS } from '@/types/furniture'
import { v4 as uuidv4 } from 'uuid'

export default function FurnitureLibrary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const { placeItem } = useEditorStore()

  const filtered = useMemo(() => {
    return FURNITURE_ITEMS.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'all' || item.category === activeCategory
      return matchSearch && matchCat
    })
  }, [search, activeCategory])

  const handleAddItem = (item: typeof FURNITURE_ITEMS[0]) => {
    placeItem({
      id: uuidv4(),
      furnitureId: item.id,
      name: item.name,
      emoji: item.emoji,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      width: item.width,
      height: item.depth,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    })
  }

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-display font-semibold text-foreground mb-2">Furniture</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex gap-1 p-2 overflow-x-auto border-b border-border editor-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors flex-shrink-0 active:scale-[0.97] ${
              activeCategory === cat.id
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 editor-scrollbar">
        <div className="grid grid-cols-2 gap-1.5">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAddItem(item)}
              className="relative bg-muted/50 hover:bg-accent/10 border border-border hover:border-accent/30 rounded-xl p-2.5 transition-all group text-left active:scale-[0.97]"
            >
              {item.isPremium && (
                <span className="absolute top-1.5 right-1.5 bg-highlight text-highlight-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
              <div className="text-2xl mb-1.5 text-center">{item.emoji}</div>
              <p className="text-[11px] text-center text-foreground font-medium leading-tight">
                {item.name}
              </p>
              <p className="text-[9px] text-center text-muted-foreground mt-0.5">
                {item.width}m × {item.depth}m
              </p>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No items found
          </div>
        )}
      </div>

      <div className="p-2 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground">
          {filtered.length} items · Click to place
        </p>
      </div>
    </div>
  )
}
