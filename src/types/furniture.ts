export interface FurnitureItem {
  id: string
  name: string
  category: string
  emoji: string
  width: number   // meters
  height: number   // meters (depth in 3D)
  depth: number    // meters (height in 3D)
  isPremium: boolean
  styles: string[]
}

export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📦' },
  { id: 'sofa', label: 'Sofas', emoji: '🛋️' },
  { id: 'bed', label: 'Beds', emoji: '🛏️' },
  { id: 'table', label: 'Tables', emoji: '🍽️' },
  { id: 'chair', label: 'Chairs', emoji: '🪑' },
  { id: 'storage', label: 'Storage', emoji: '🗄️' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { id: 'bathroom', label: 'Bathroom', emoji: '🚿' },
  { id: 'decor', label: 'Decor', emoji: '🌿' },
  { id: 'lighting', label: 'Lighting', emoji: '💡' },
] as const

export const FURNITURE_ITEMS: FurnitureItem[] = [
  { id: 'sofa-1', name: '3-Seater Sofa', category: 'sofa', emoji: '🛋️', width: 2.2, height: 0.9, depth: 0.85, isPremium: false, styles: ['modern'] },
  { id: 'sofa-2', name: 'L-Shape Sofa', category: 'sofa', emoji: '🛋️', width: 2.8, height: 0.9, depth: 1.8, isPremium: true, styles: ['modern'] },
  { id: 'sofa-3', name: 'Armchair', category: 'sofa', emoji: '🪑', width: 0.9, height: 0.85, depth: 0.9, isPremium: false, styles: ['classic'] },
  { id: 'bed-1', name: 'King Bed', category: 'bed', emoji: '🛏️', width: 1.9, height: 0.5, depth: 2.1, isPremium: false, styles: ['modern'] },
  { id: 'bed-2', name: 'Single Bed', category: 'bed', emoji: '🛏️', width: 1.0, height: 0.5, depth: 2.0, isPremium: false, styles: ['modern'] },
  { id: 'bed-3', name: 'Bunk Bed', category: 'bed', emoji: '🛏️', width: 1.0, height: 1.8, depth: 2.0, isPremium: true, styles: ['modern'] },
  { id: 'table-1', name: 'Dining Table', category: 'table', emoji: '🍽️', width: 1.8, height: 0.75, depth: 0.9, isPremium: false, styles: ['modern'] },
  { id: 'table-2', name: 'Coffee Table', category: 'table', emoji: '☕', width: 1.2, height: 0.45, depth: 0.6, isPremium: false, styles: ['modern'] },
  { id: 'desk-1', name: 'Office Desk', category: 'table', emoji: '🖥️', width: 1.4, height: 0.75, depth: 0.7, isPremium: false, styles: ['modern'] },
  { id: 'chair-1', name: 'Office Chair', category: 'chair', emoji: '🪑', width: 0.6, height: 1.2, depth: 0.6, isPremium: false, styles: ['modern'] },
  { id: 'chair-2', name: 'Dining Chair', category: 'chair', emoji: '🪑', width: 0.5, height: 0.9, depth: 0.5, isPremium: false, styles: ['classic'] },
  { id: 'storage-1', name: 'Bookshelf', category: 'storage', emoji: '📚', width: 0.8, height: 2.0, depth: 0.35, isPremium: false, styles: ['modern'] },
  { id: 'storage-2', name: 'Wardrobe', category: 'storage', emoji: '🚪', width: 1.2, height: 2.2, depth: 0.6, isPremium: false, styles: ['modern'] },
  { id: 'kitchen-1', name: 'Kitchen Island', category: 'kitchen', emoji: '🍳', width: 1.5, height: 0.9, depth: 0.8, isPremium: true, styles: ['modern'] },
  { id: 'kitchen-2', name: 'Refrigerator', category: 'kitchen', emoji: '🧊', width: 0.7, height: 1.8, depth: 0.7, isPremium: false, styles: ['modern'] },
  { id: 'bath-1', name: 'Bathtub', category: 'bathroom', emoji: '🛁', width: 0.8, height: 0.6, depth: 1.7, isPremium: false, styles: ['modern'] },
  { id: 'bath-2', name: 'Toilet', category: 'bathroom', emoji: '🚽', width: 0.4, height: 0.8, depth: 0.7, isPremium: false, styles: ['modern'] },
  { id: 'decor-1', name: 'Potted Plant', category: 'decor', emoji: '🌿', width: 0.4, height: 1.2, depth: 0.4, isPremium: false, styles: ['modern'] },
  { id: 'decor-2', name: 'Floor Rug', category: 'decor', emoji: '🟫', width: 2.0, height: 0.02, depth: 1.5, isPremium: false, styles: ['modern'] },
  { id: 'light-1', name: 'Floor Lamp', category: 'lighting', emoji: '💡', width: 0.3, height: 1.6, depth: 0.3, isPremium: false, styles: ['modern'] },
  { id: 'light-2', name: 'Table Lamp', category: 'lighting', emoji: '🔆', width: 0.25, height: 0.5, depth: 0.25, isPremium: false, styles: ['classic'] },
]
