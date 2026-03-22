// src/data/furniture.ts
// Complete furniture catalog — 60+ items across 10 categories

export interface FurnitureDef {
  id: string
  name: string
  category: string
  emoji: string
  width: number   // metres
  depth: number
  height: number
  color?: string
  tags?: string[]
}

export const FURNITURE_CATEGORIES = [
  { id: 'all',       label: 'All',        emoji: '🏠' },
  { id: 'sofa',      label: 'Sofas',      emoji: '🛋️' },
  { id: 'bed',       label: 'Beds',       emoji: '🛏️' },
  { id: 'table',     label: 'Tables',     emoji: '🪑' },
  { id: 'storage',   label: 'Storage',    emoji: '🗄️' },
  { id: 'kitchen',   label: 'Kitchen',    emoji: '🍳' },
  { id: 'bathroom',  label: 'Bathroom',   emoji: '🚿' },
  { id: 'office',    label: 'Office',     emoji: '💻' },
  { id: 'tv',        label: 'TV & Media', emoji: '📺' },
  { id: 'decor',     label: 'Decor',      emoji: '🌿' },
  { id: 'door',      label: 'Doors',      emoji: '🚪' },
]

export const FURNITURE_CATALOG: FurnitureDef[] = [
  // ── SOFAS ────────────────────────────────────────────────────
  { id:'sofa-3seat',   name:'3-Seater Sofa',    category:'sofa',    emoji:'🛋️', width:2.2,  depth:0.95, height:0.85, color:'#c8b89a' },
  { id:'sofa-2seat',   name:'2-Seater Sofa',    category:'sofa',    emoji:'🛋️', width:1.6,  depth:0.9,  height:0.82, color:'#a89878' },
  { id:'sofa-lshape',  name:'L-Shape Sofa',     category:'sofa',    emoji:'🛋️', width:2.8,  depth:1.8,  height:0.85, color:'#8a9ab0' },
  { id:'sofa-corner',  name:'Corner Sofa',      category:'sofa',    emoji:'🛋️', width:2.5,  depth:2.5,  height:0.85, color:'#b0a898' },
  { id:'chair-arm',    name:'Armchair',          category:'sofa',    emoji:'🪑', width:0.88, depth:0.88, height:0.9,  color:'#9c7a6b' },
  { id:'chair-accent', name:'Accent Chair',      category:'sofa',    emoji:'🪑', width:0.75, depth:0.78, height:0.88, color:'#7a8c6a' },
  { id:'ottoman',      name:'Ottoman',            category:'sofa',    emoji:'🪑', width:0.7,  depth:0.7,  height:0.42, color:'#c0a878' },
  { id:'bench-entry',  name:'Entry Bench',       category:'sofa',    emoji:'🪑', width:1.2,  depth:0.45, height:0.48, color:'#8a7060' },

  // ── BEDS ─────────────────────────────────────────────────────
  { id:'bed-king',     name:'King Bed',          category:'bed',     emoji:'🛏️', width:1.93, depth:2.13, height:0.55, color:'#8b6914' },
  { id:'bed-queen',    name:'Queen Bed',         category:'bed',     emoji:'🛏️', width:1.53, depth:2.03, height:0.52, color:'#7a5c12' },
  { id:'bed-double',   name:'Double Bed',        category:'bed',     emoji:'🛏️', width:1.37, depth:1.93, height:0.5,  color:'#6a4c10' },
  { id:'bed-single',   name:'Single Bed',        category:'bed',     emoji:'🛏️', width:0.97, depth:2.0,  height:0.48, color:'#a07040' },
  { id:'bed-bunk',     name:'Bunk Bed',          category:'bed',     emoji:'🛏️', width:0.97, depth:2.0,  height:1.6,  color:'#6a5a4a' },
  { id:'nightstand',   name:'Nightstand',        category:'bed',     emoji:'🗄️', width:0.5,  depth:0.42, height:0.55, color:'#a07850' },
  { id:'dresser',      name:'Dresser',           category:'bed',     emoji:'🗄️', width:1.0,  depth:0.45, height:0.82, color:'#b09070' },
  { id:'wardrobe',     name:'Wardrobe',          category:'bed',     emoji:'🗄️', width:1.8,  depth:0.6,  height:2.1,  color:'#c8bca8' },
  { id:'wardrobe-2d',  name:'Wardrobe 2-Door',   category:'bed',     emoji:'🗄️', width:1.2,  depth:0.6,  height:2.1,  color:'#b8aa98' },

  // ── TABLES ───────────────────────────────────────────────────
  { id:'table-dining', name:'Dining Table',      category:'table',   emoji:'🍽️', width:1.8,  depth:0.9,  height:0.76, color:'#8b6334' },
  { id:'table-round',  name:'Round Table',       category:'table',   emoji:'🍽️', width:1.2,  depth:1.2,  height:0.76, color:'#7a5828' },
  { id:'table-coffee', name:'Coffee Table',      category:'table',   emoji:'🪑', width:1.2,  depth:0.6,  height:0.42, color:'#6a4820' },
  { id:'table-side',   name:'Side Table',        category:'table',   emoji:'🪑', width:0.55, depth:0.55, height:0.55, color:'#9a8060' },
  { id:'chair-dining', name:'Dining Chair',      category:'table',   emoji:'🪑', width:0.45, depth:0.48, height:0.95, color:'#7a6050' },
  { id:'chair-bar',    name:'Bar Stool',         category:'table',   emoji:'🪑', width:0.42, depth:0.42, height:1.05, color:'#4a3828' },
  { id:'table-bar',    name:'Bar Table',         category:'table',   emoji:'🍽️', width:0.6,  depth:0.6,  height:1.05, color:'#5a4030' },
  { id:'bench-dining', name:'Dining Bench',      category:'table',   emoji:'🪑', width:1.2,  depth:0.38, height:0.47, color:'#8a6848' },

  // ── STORAGE ──────────────────────────────────────────────────
  { id:'shelf-book',   name:'Bookshelf',         category:'storage', emoji:'📚', width:0.9,  depth:0.3,  height:1.8,  color:'#a08060' },
  { id:'shelf-wall',   name:'Wall Shelf',        category:'storage', emoji:'📚', width:1.2,  depth:0.25, height:0.22, color:'#b09878' },
  { id:'cabinet-tv',   name:'TV Cabinet',        category:'storage', emoji:'📺', width:1.8,  depth:0.45, height:0.55, color:'#3a3028' },
  { id:'cabinet-side', name:'Sideboard',         category:'storage', emoji:'🗄️', width:1.5,  depth:0.45, height:0.78, color:'#8a7258' },
  { id:'cabinet-file', name:'Filing Cabinet',    category:'storage', emoji:'🗄️', width:0.46, depth:0.62, height:1.32, color:'#888888' },
  { id:'shelf-corner', name:'Corner Shelf',      category:'storage', emoji:'📚', width:0.6,  depth:0.6,  height:1.8,  color:'#a09080' },

  // ── TV & MEDIA ────────────────────────────────────────────────
  { id:'tv-55',        name:'TV 55"',             category:'tv',      emoji:'📺', width:1.28, depth:0.08, height:0.74, color:'#111111' },
  { id:'tv-65',        name:'TV 65"',             category:'tv',      emoji:'📺', width:1.52, depth:0.08, height:0.88, color:'#111111' },
  { id:'tv-wall',      name:'Wall-Mounted TV',    category:'tv',      emoji:'📺', width:1.28, depth:0.05, height:0.74, color:'#0a0a0a' },
  { id:'tv-stand',     name:'TV Stand',           category:'tv',      emoji:'📺', width:1.5,  depth:0.45, height:0.5,  color:'#2a2020' },
  { id:'fireplace',    name:'Fireplace',          category:'tv',      emoji:'🔥', width:1.4,  depth:0.35, height:1.1,  color:'#4a3830' },
  { id:'speaker-fl',   name:'Floor Speaker',      category:'tv',      emoji:'🔊', width:0.28, depth:0.32, height:1.0,  color:'#2a2a2a' },
  { id:'speaker-book', name:'Bookshelf Speaker',  category:'tv',      emoji:'🔊', width:0.22, depth:0.28, height:0.35, color:'#222222' },
  { id:'console-game', name:'Gaming Console',     category:'tv',      emoji:'🎮', width:0.38, depth:0.26, height:0.08, color:'#111111' },

  // ── KITCHEN ───────────────────────────────────────────────────
  { id:'fridge',       name:'Refrigerator',       category:'kitchen', emoji:'❄️', width:0.7,  depth:0.72, height:1.85, color:'#e8e8e8' },
  { id:'fridge-2d',    name:'French Door Fridge', category:'kitchen', emoji:'❄️', width:0.92, depth:0.75, height:1.88, color:'#d8d8d8' },
  { id:'oven',         name:'Oven / Range',       category:'kitchen', emoji:'🍳', width:0.6,  depth:0.65, height:0.9,  color:'#222222' },
  { id:'microwave',    name:'Microwave',          category:'kitchen', emoji:'📦', width:0.55, depth:0.42, height:0.35, color:'#1a1a1a' },
  { id:'sink-kitchen', name:'Kitchen Sink',       category:'kitchen', emoji:'🚰', width:0.8,  depth:0.55, height:0.9,  color:'#c8d0d0' },
  { id:'counter-l',    name:'Counter Left',       category:'kitchen', emoji:'🪵', width:0.65, depth:0.65, height:0.9,  color:'#e0dbd0' },
  { id:'counter-s',    name:'Counter Straight',   category:'kitchen', emoji:'🪵', width:1.2,  depth:0.65, height:0.9,  color:'#e0dbd0' },
  { id:'island',       name:'Kitchen Island',     category:'kitchen', emoji:'🪵', width:1.5,  depth:0.8,  height:0.9,  color:'#d8d0c0' },
  { id:'dishwasher',   name:'Dishwasher',         category:'kitchen', emoji:'🧹', width:0.6,  depth:0.6,  height:0.85, color:'#c8c8c8' },
  { id:'chair-kitchen',name:'Kitchen Chair',      category:'kitchen', emoji:'🪑', width:0.44, depth:0.44, height:0.88, color:'#8a7060' },

  // ── BATHROOM ──────────────────────────────────────────────────
  { id:'bathtub',      name:'Bathtub',            category:'bathroom',emoji:'🛁', width:1.7,  depth:0.8,  height:0.55, color:'#f5f5f0' },
  { id:'shower',       name:'Shower Cubicle',     category:'bathroom',emoji:'🚿', width:0.9,  depth:0.9,  height:2.1,  color:'#e0eaf0' },
  { id:'toilet',       name:'Toilet',             category:'bathroom',emoji:'🚽', width:0.38, depth:0.65, height:0.82, color:'#f8f8f4' },
  { id:'sink-bath',    name:'Bathroom Sink',      category:'bathroom',emoji:'🚰', width:0.6,  depth:0.48, height:0.85, color:'#f0f0ec' },
  { id:'sink-double',  name:'Double Sink',        category:'bathroom',emoji:'🚰', width:1.2,  depth:0.5,  height:0.85, color:'#f0f0ec' },
  { id:'vanity',       name:'Vanity Unit',        category:'bathroom',emoji:'🪞', width:0.9,  depth:0.5,  height:0.85, color:'#e8e0d0' },
  { id:'mirror-bath',  name:'Bathroom Mirror',    category:'bathroom',emoji:'🪞', width:0.8,  depth:0.06, height:0.9,  color:'#c0d0d8' },
  { id:'towel-rack',   name:'Towel Rack',         category:'bathroom',emoji:'🪣', width:0.6,  depth:0.12, height:0.9,  color:'#c0c0b8' },

  // ── OFFICE ────────────────────────────────────────────────────
  { id:'desk-straight',name:'Straight Desk',      category:'office',  emoji:'💻', width:1.4,  depth:0.7,  height:0.76, color:'#b8a888' },
  { id:'desk-l',       name:'L-Shape Desk',       category:'office',  emoji:'💻', width:1.8,  depth:1.4,  height:0.76, color:'#a89878' },
  { id:'chair-office', name:'Office Chair',       category:'office',  emoji:'🪑', width:0.65, depth:0.65, height:1.15, color:'#222222' },
  { id:'shelf-office', name:'Office Bookshelf',   category:'office',  emoji:'📚', width:1.0,  depth:0.3,  height:2.0,  color:'#8a7860' },
  { id:'cabinet-office',name:'Office Cabinet',    category:'office',  emoji:'🗄️', width:0.8,  depth:0.42, height:0.75, color:'#999999' },
  { id:'monitor',      name:'Monitor',            category:'office',  emoji:'🖥️', width:0.6,  depth:0.2,  height:0.45, color:'#111111' },
  { id:'printer',      name:'Printer',            category:'office',  emoji:'🖨️', width:0.45, depth:0.4,  height:0.22, color:'#888888' },

  // ── DECOR ─────────────────────────────────────────────────────
  { id:'plant-floor',  name:'Floor Plant',        category:'decor',   emoji:'🌿', width:0.55, depth:0.55, height:1.4,  color:'#2d6a22' },
  { id:'plant-small',  name:'Small Plant',        category:'decor',   emoji:'🌿', width:0.3,  depth:0.3,  height:0.55, color:'#3a7a2a' },
  { id:'lamp-floor',   name:'Floor Lamp',         category:'decor',   emoji:'💡', width:0.38, depth:0.38, height:1.65, color:'#c8b878' },
  { id:'lamp-table',   name:'Table Lamp',         category:'decor',   emoji:'💡', width:0.28, depth:0.28, height:0.55, color:'#c8b878' },
  { id:'rug-rect',     name:'Rectangular Rug',    category:'decor',   emoji:'🪣', width:2.0,  depth:1.4,  height:0.02, color:'#8a7060' },
  { id:'rug-round',    name:'Round Rug',          category:'decor',   emoji:'🪣', width:1.6,  depth:1.6,  height:0.02, color:'#9a8070' },
  { id:'mirror-wall',  name:'Wall Mirror',        category:'decor',   emoji:'🪞', width:0.8,  depth:0.05, height:1.1,  color:'#c0c8d0' },
  { id:'art-wall',     name:'Wall Art',           category:'decor',   emoji:'🖼️', width:0.9,  depth:0.04, height:0.7,  color:'#8888aa' },
  { id:'curtain',      name:'Curtain',            category:'decor',   emoji:'🪟', width:1.4,  depth:0.1,  height:2.5,  color:'#c8c0b0' },

  // ── DOORS & WINDOWS ───────────────────────────────────────────
  { id:'door-single',  name:'Single Door',        category:'door',    emoji:'🚪', width:0.9,  depth:0.1,  height:2.1,  color:'#8a7060' },
  { id:'door-double',  name:'Double Door',        category:'door',    emoji:'🚪', width:1.6,  depth:0.1,  height:2.1,  color:'#8a7060' },
  { id:'door-sliding', name:'Sliding Door',       category:'door',    emoji:'🚪', width:1.2,  depth:0.08, height:2.1,  color:'#c0d0d8' },
  { id:'window-std',   name:'Standard Window',    category:'door',    emoji:'🪟', width:1.2,  depth:0.1,  height:1.2,  color:'#c0d8e8' },
  { id:'window-tall',  name:'Tall Window',        category:'door',    emoji:'🪟', width:0.9,  depth:0.08, height:2.0,  color:'#c0d8e8' },
  { id:'stairs',       name:'Staircase',          category:'door',    emoji:'🪜', width:1.0,  depth:2.5,  height:2.8,  color:'#a09080' },
]
