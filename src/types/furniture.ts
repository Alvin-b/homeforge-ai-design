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

const BASE_ITEMS: Omit<FurnitureItem, 'id'>[] = [
  { name: '3-Seater Sofa', category: 'sofa', emoji: '🛋️', width: 2.2, height: 0.9, depth: 0.85, isPremium: false, styles: ['modern'] },
  { name: 'L-Shape Sofa', category: 'sofa', emoji: '🛋️', width: 2.8, height: 0.9, depth: 1.8, isPremium: true, styles: ['modern'] },
  { name: 'Armchair', category: 'sofa', emoji: '🪑', width: 0.9, height: 0.85, depth: 0.9, isPremium: false, styles: ['classic'] },
  { name: 'Sofa Bed', category: 'sofa', emoji: '🛋️', width: 2.0, height: 0.4, depth: 1.0, isPremium: false, styles: ['modern'] },
  { name: 'King Bed', category: 'bed', emoji: '🛏️', width: 1.9, height: 0.5, depth: 2.1, isPremium: false, styles: ['modern'] },
  { name: 'Queen Bed', category: 'bed', emoji: '🛏️', width: 1.5, height: 0.5, depth: 2.0, isPremium: false, styles: ['modern'] },
  { name: 'Single Bed', category: 'bed', emoji: '🛏️', width: 1.0, height: 0.5, depth: 2.0, isPremium: false, styles: ['modern'] },
  { name: 'Bunk Bed', category: 'bed', emoji: '🛏️', width: 1.0, height: 1.8, depth: 2.0, isPremium: true, styles: ['modern'] },
  { name: 'Nightstand', category: 'bed', emoji: '🛏️', width: 0.5, height: 0.5, depth: 0.4, isPremium: false, styles: ['modern'] },
  { name: 'Dining Table', category: 'table', emoji: '🍽️', width: 1.8, height: 0.75, depth: 0.9, isPremium: false, styles: ['modern'] },
  { name: 'Coffee Table', category: 'table', emoji: '☕', width: 1.2, height: 0.45, depth: 0.6, isPremium: false, styles: ['modern'] },
  { name: 'Side Table', category: 'table', emoji: '🪑', width: 0.5, height: 0.5, depth: 0.4, isPremium: false, styles: ['modern'] },
  { name: 'Office Desk', category: 'table', emoji: '🖥️', width: 1.4, height: 0.75, depth: 0.7, isPremium: false, styles: ['modern'] },
  { name: 'Console Table', category: 'table', emoji: '📺', width: 1.2, height: 0.8, depth: 0.4, isPremium: false, styles: ['modern'] },
  { name: 'Office Chair', category: 'chair', emoji: '🪑', width: 0.6, height: 1.2, depth: 0.6, isPremium: false, styles: ['modern'] },
  { name: 'Dining Chair', category: 'chair', emoji: '🪑', width: 0.5, height: 0.9, depth: 0.5, isPremium: false, styles: ['classic'] },
  { name: 'Bar Stool', category: 'chair', emoji: '🪑', width: 0.4, height: 1.1, depth: 0.4, isPremium: false, styles: ['modern'] },
  { name: 'Accent Chair', category: 'chair', emoji: '🪑', width: 0.7, height: 0.85, depth: 0.75, isPremium: true, styles: ['classic'] },
  { name: 'Bookshelf', category: 'storage', emoji: '📚', width: 0.8, height: 2.0, depth: 0.35, isPremium: false, styles: ['modern'] },
  { name: 'Wardrobe', category: 'storage', emoji: '🚪', width: 1.2, height: 2.2, depth: 0.6, isPremium: false, styles: ['modern'] },
  { name: 'Chest of Drawers', category: 'storage', emoji: '🗄️', width: 0.9, height: 0.9, depth: 0.5, isPremium: false, styles: ['modern'] },
  { name: 'TV Stand', category: 'storage', emoji: '📺', width: 1.2, height: 0.5, depth: 0.45, isPremium: false, styles: ['modern'] },
  { name: 'Kitchen Island', category: 'kitchen', emoji: '🍳', width: 1.5, height: 0.9, depth: 0.8, isPremium: true, styles: ['modern'] },
  { name: 'Refrigerator', category: 'kitchen', emoji: '🧊', width: 0.7, height: 1.8, depth: 0.7, isPremium: false, styles: ['modern'] },
  { name: 'Oven', category: 'kitchen', emoji: '🔥', width: 0.6, height: 0.9, depth: 0.6, isPremium: false, styles: ['modern'] },
  { name: 'Dishwasher', category: 'kitchen', emoji: '🍽️', width: 0.6, height: 0.85, depth: 0.6, isPremium: false, styles: ['modern'] },
  { name: 'Bathtub', category: 'bathroom', emoji: '🛁', width: 0.8, height: 0.6, depth: 1.7, isPremium: false, styles: ['modern'] },
  { name: 'Shower', category: 'bathroom', emoji: '🚿', width: 0.9, height: 0.6, depth: 0.9, isPremium: false, styles: ['modern'] },
  { name: 'Toilet', category: 'bathroom', emoji: '🚽', width: 0.4, height: 0.8, depth: 0.7, isPremium: false, styles: ['modern'] },
  { name: 'Vanity', category: 'bathroom', emoji: '🪞', width: 1.0, height: 0.85, depth: 0.5, isPremium: false, styles: ['modern'] },
  { name: 'Potted Plant', category: 'decor', emoji: '🌿', width: 0.4, height: 1.2, depth: 0.4, isPremium: false, styles: ['modern'] },
  { name: 'Floor Rug', category: 'decor', emoji: '🟫', width: 2.0, height: 0.02, depth: 1.5, isPremium: false, styles: ['modern'] },
  { name: 'Mirror', category: 'decor', emoji: '🪞', width: 0.8, height: 1.2, depth: 0.05, isPremium: false, styles: ['modern'] },
  { name: 'Artwork', category: 'decor', emoji: '🖼️', width: 0.9, height: 0.7, depth: 0.05, isPremium: false, styles: ['modern'] },
  { name: 'Floor Lamp', category: 'lighting', emoji: '💡', width: 0.3, height: 1.6, depth: 0.3, isPremium: false, styles: ['modern'] },
  { name: 'Table Lamp', category: 'lighting', emoji: '🔆', width: 0.25, height: 0.5, depth: 0.25, isPremium: false, styles: ['classic'] },
  { name: 'Pendant Light', category: 'lighting', emoji: '💡', width: 0.3, height: 0.4, depth: 0.3, isPremium: true, styles: ['modern'] },
]

export const FURNITURE_ITEMS: FurnitureItem[] = BASE_ITEMS.map((item, i) => ({
  ...item,
  id: `${item.category}-${i + 1}`,
}))
