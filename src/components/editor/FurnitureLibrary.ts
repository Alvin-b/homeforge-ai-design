import React, { useState, useMemo } from 'react'
import { Search, ChevronRight, LayoutTemplate, X } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { FURNITURE_CATALOG, FURNITURE_CATEGORIES, type FurnitureDef } from '@/data/furniture'
import { v4 as uuidv4 } from 'uuid'

// ── Room templates ────────────────────────────────────────────────
interface RoomTemplate {
  id: string
  name: string
  emoji: string
  description: string
  size: string
  items: Array<{ furnitureId: string; x: number; y: number; rotation: number }>
  walls: Array<{ x1: number; y1: number; x2: number; y2: number }>
}

const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    emoji: '🛋️',
    description: 'Sofa, coffee table, TV unit',
    size: '5m × 4m',
    walls: [
      { x1:100, y1:100, x2:350, y2:100 },
      { x1:350, y1:100, x2:350, y2:300 },
      { x1:350, y1:300, x2:100, y2:300 },
      { x1:100, y1:300, x2:100, y2:100 },
    ],
    items: [
      { furnitureId:'sofa-3seat',  x:225, y:200, rotation:0   },
      { furnitureId:'table-coffee',x:225, y:165, rotation:0   },
      { furnitureId:'cabinet-tv',  x:225, y:120, rotation:180 },
      { furnitureId:'tv-55',       x:225, y:118, rotation:180 },
      { furnitureId:'chair-arm',   x:310, y:195, rotation:270 },
      { furnitureId:'plant-floor', x:330, y:280, rotation:0   },
    ],
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    emoji: '🛏️',
    description: 'King bed, wardrobes, dresser',
    size: '4m × 4m',
    walls: [
      { x1:100, y1:100, x2:300, y2:100 },
      { x1:300, y1:100, x2:300, y2:300 },
      { x1:300, y1:300, x2:100, y2:300 },
      { x1:100, y1:300, x2:100, y2:100 },
    ],
    items: [
      { furnitureId:'bed-king',    x:200, y:200, rotation:0   },
      { furnitureId:'nightstand',  x:155, y:195, rotation:0   },
      { furnitureId:'nightstand',  x:245, y:195, rotation:0   },
      { furnitureId:'wardrobe',    x:155, y:125, rotation:180 },
      { furnitureId:'wardrobe',    x:245, y:125, rotation:180 },
      { furnitureId:'lamp-table',  x:155, y:190, rotation:0   },
      { furnitureId:'lamp-table',  x:245, y:190, rotation:0   },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    emoji: '🍳',
    description: 'Counter, island, appliances',
    size: '3.5m × 3m',
    walls: [
      { x1:100, y1:100, x2:275, y2:100 },
      { x1:275, y1:100, x2:275, y2:250 },
      { x1:275, y1:250, x2:100, y2:250 },
      { x1:100, y1:250, x2:100, y2:100 },
    ],
    items: [
      { furnitureId:'counter-s',   x:187, y:115, rotation:0   },
      { furnitureId:'sink-kitchen',x:145, y:115, rotation:0   },
      { furnitureId:'oven',        x:260, y:175, rotation:90  },
      { furnitureId:'fridge',      x:260, y:120, rotation:90  },
      { furnitureId:'island',      x:187, y:190, rotation:0   },
      { furnitureId:'chair-kitchen',x:175,y:225, rotation:0   },
      { furnitureId:'chair-kitchen',x:200,y:225, rotation:0   },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    emoji: '🚿',
    description: 'Bathtub, shower, toilet, vanity',
    size: '3m × 2.5m',
    walls: [
      { x1:100, y1:100, x2:250, y2:100 },
      { x1:250, y1:100, x2:250, y2:225 },
      { x1:250, y1:225, x2:100, y2:225 },
      { x1:100, y1:225, x2:100, y2:100 },
    ],
    items: [
      { furnitureId:'bathtub',     x:155, y:115, rotation:0   },
      { furnitureId:'shower',      x:235, y:115, rotation:0   },
      { furnitureId:'toilet',      x:235, y:200, rotation:0   },
      { furnitureId:'sink-bath',   x:145, y:205, rotation:0   },
      { furnitureId:'mirror-bath', x:145, y:195, rotation:0   },
    ],
  },
  {
    id: 'office',
    name: 'Home Office',
    emoji: '💻',
    description: 'L-desk, bookshelf, office chair',
    size: '3m × 3m',
    walls: [
      { x1:100, y1:100, x2:250, y2:100 },
      { x1:250, y1:100, x2:250, y2:250 },
      { x1:250, y1:250, x2:100, y2:250 },
      { x1:100, y1:250, x2:100, y2:100 },
    ],
    items: [
      { furnitureId:'desk-l',      x:170, y:145, rotation:0   },
      { furnitureId:'chair-office',x:170, y:175, rotation:0   },
      { furnitureId:'shelf-office',x:235, y:175, rotation:90  },
      { furnitureId:'monitor',     x:160, y:135, rotation:0   },
      { furnitureId:'lamp-table',  x:205, y:135, rotation:0   },
      { furnitureId:'plant-small', x:235, y:235, rotation:0   },
    ],
  },
  {
    id: 'open-plan',
    name: 'Open Plan',
    emoji: '🏠',
    description: 'Living + dining combined',
    size: '7m × 5m',
    walls: [
      { x1:80,  y1:80,  x2:430, y2:80  },
      { x1:430, y1:80,  x2:430, y2:330 },
      { x1:430, y1:330, x2:80,  y2:330 },
      { x1:80,  y1:330, x2:80,  y2:80  },
    ],
    items: [
      { furnitureId:'sofa-3seat',  x:190, y:230, rotation:0   },
      { furnitureId:'table-coffee',x:190, y:200, rotation:0   },
      { furnitureId:'tv-65',       x:190, y:110, rotation:180 },
      { furnitureId:'cabinet-tv',  x:190, y:112, rotation:180 },
      { furnitureId:'chair-arm',   x:115, y:230, rotation:90  },
      { furnitureId:'table-dining',x:360, y:180, rotation:0   },
      { furnitureId:'chair-dining',x:340, y:160, rotation:45  },
      { furnitureId:'chair-dining',x:380, y:160, rotation:315 },
      { furnitureId:'chair-dining',x:340, y:200, rotation:135 },
      { furnitureId:'chair-dining',x:380, y:200, rotation:225 },
      { furnitureId:'plant-floor', x:405, y:305, rotation:0   },
      { furnitureId:'plant-floor', x:100, y:305, rotation:0   },
    ],
  },
]

// ── Thumbnail component ───────────────────────────────────────────
function FurnitureThumbnail({ item }: { item: FurnitureDef }) {
  // Simple colored box thumbnail
  const hue = item.color || '#a08060'
  return (
    <div className="w-full aspect-square rounded-lg flex items-center justify-center mb-1.5 relative overflow-hidden"
      style={{ background: '#f5f3ef' }}>
      {/* 3D-ish box illusion */}
      <div className="relative" style={{ width: '52%', height: '52%' }}>
        {/* Top face */}
        <div className="absolute inset-0" style={{
          background: hue,
          filter: 'brightness(1.15)',
          transform: 'perspective(60px) rotateX(20deg) rotateY(-15deg)',
          borderRadius: 3,
        }} />
      </div>
      {/* Emoji overlay */}
      <span className="absolute bottom-1 right-1.5" style={{ fontSize: 14 }}>{item.emoji}</span>
    </div>
  )
}

// ── Template card ─────────────────────────────────────────────────
function TemplateCard({ template, onApply }: { template: RoomTemplate; onApply: (t: RoomTemplate) => void }) {
  return (
    <div
      onClick={() => onApply(template)}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer border transition-all hover:border-[#1eaedb] hover:bg-[#f0f8fd] group"
      style={{ background: '#fafaf8', border: '1px solid #e8e8e4' }}
    >
      <span style={{ fontSize: 22 }}>{template.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-[#333]">{template.name}</div>
        <div className="text-[10px] text-[#888] truncate">{template.description}</div>
        <div className="text-[10px] text-[#aaa]">{template.size}</div>
      </div>
      <ChevronRight size={13} className="text-[#ccc] group-hover:text-[#1eaedb] flex-shrink-0" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function FurnitureLibrary() {
  const { placeItem, addWall, addRoom } = useEditorStore()
  const [search,    setSearch]    = useState('')
  const [activeTab, setActiveTab] = useState<'furniture' | 'templates'>('furniture')
  const [activeCat, setActiveCat] = useState('all')

  const filtered = useMemo(() => {
    let items = FURNITURE_CATALOG
    if (activeCat !== 'all') items = items.filter(i => i.category === activeCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.includes(q))
      )
    }
    return items
  }, [activeCat, search])

  const handleDragStart = (e: React.DragEvent, item: FurnitureDef) => {
    e.dataTransfer.setData('application/furniture', JSON.stringify(item))
  }

  const handleClick = (item: FurnitureDef) => {
    // Place item at center of current view
    placeItem({
      id:          uuidv4(),
      furnitureId: item.id,
      name:        item.name,
      emoji:       item.emoji,
      x:           400,
      y:           300,
      width:       item.width,
      depth:       item.depth,
      height:      item.height,
      rotation:    0,
      scaleX:      1,
      scaleY:      1,
      color:       item.color,
    })
  }

  const handleApplyTemplate = (template: RoomTemplate) => {
    // Add walls
    template.walls.forEach(w => {
      addWall({
        id:        uuidv4(),
        x1:        w.x1, y1: w.y1,
        x2:        w.x2, y2: w.y2,
        thickness: 15,
        color:     '#f0ece6',
        height:    2.7,
      })
    })
    // Add items
    template.items.forEach(it => {
      const def = FURNITURE_CATALOG.find(f => f.id === it.furnitureId)
      if (!def) return
      placeItem({
        id:          uuidv4(),
        furnitureId: def.id,
        name:        def.name,
        emoji:       def.emoji,
        x:           it.x * 2,
        y:           it.y * 2,
        width:       def.width,
        depth:       def.depth,
        height:      def.height,
        rotation:    it.rotation,
        scaleX:      1,
        scaleY:      1,
        color:       def.color,
      })
    })
  }

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: '#fff', borderRight: '1px solid #e4e4e4', width: 280 }}>

      {/* Header */}
      <div className="flex-shrink-0 px-3 pt-3 pb-0">
        {/* Tab switcher */}
        <div className="flex rounded-lg overflow-hidden mb-2.5"
          style={{ background: '#f0f0ee', border: '1px solid #e4e4e4', padding: 2, gap: 2 }}>
          {(['furniture', 'templates'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize"
              style={{
                background: activeTab === tab ? '#fff' : 'transparent',
                color:      activeTab === tab ? '#333' : '#888',
                boxShadow:  activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}>
              {tab === 'furniture' ? '🪑 Furniture' : '📐 Templates'}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab === 'furniture' && (
          <div className="relative mb-2.5">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search furniture..."
              className="w-full pl-7 pr-7 py-1.5 rounded-lg text-xs outline-none"
              style={{
                background: '#f5f5f3',
                border: '1px solid #e4e4e4',
                color: '#333',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555]">
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Furniture tab */}
      {activeTab === 'furniture' && (
        <>
          {/* Category pills — horizontal scroll */}
          <div className="flex-shrink-0 px-3 pb-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
              {FURNITURE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex-shrink-0"
                  style={{
                    background: activeCat === cat.id ? '#1eaedb' : '#f0f0ee',
                    color:      activeCat === cat.id ? '#fff'    : '#666',
                    border:     `1px solid ${activeCat === cat.id ? '#1eaedb' : '#e4e4e4'}`,
                  }}>
                  <span style={{ fontSize: 11 }}>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Item count */}
          <div className="flex-shrink-0 px-3 pb-1.5">
            <span className="text-[10px] text-[#aaa]">
              {filtered.length} item{filtered.length !== 1 ? 's' : ''} · click to place
            </span>
          </div>

          {/* Grid of items */}
          <div className="flex-1 overflow-y-auto px-2 pb-4"
            style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-2 gap-1.5">
              {filtered.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item)}
                  onClick={() => handleClick(item)}
                  className="rounded-xl p-2 cursor-pointer transition-all border hover:border-[#1eaedb] hover:shadow-sm active:scale-[0.97]"
                  style={{
                    background: '#fafaf8',
                    border: '1px solid #ececea',
                  }}
                >
                  <FurnitureThumbnail item={item} />
                  <div className="text-[11px] font-medium text-[#333] leading-tight truncate">{item.name}</div>
                  <div className="text-[10px] text-[#aaa] mt-0.5">
                    {item.width}m × {item.depth}m
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-10 text-[#aaa]">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-xs">No items found for "{search}"</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Templates tab */}
      {activeTab === 'templates' && (
        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-1">
          <p className="text-[11px] text-[#888] mb-3 leading-relaxed">
            Click a template to instantly place walls and furniture into your design.
          </p>
          <div className="flex flex-col gap-2">
            {ROOM_TEMPLATES.map(t => (
              <TemplateCard key={t.id} template={t} onApply={handleApplyTemplate} />
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl text-[11px] text-[#888] leading-relaxed"
            style={{ background: '#f5f5f2', border: '1px solid #e8e8e4' }}>
            💡 <strong className="text-[#555]">Tip:</strong> Switch to 2D view to edit the layout, then switch to 3D to see it rendered.
          </div>
        </div>
      )}
    </div>
  )
}
