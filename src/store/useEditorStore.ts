import { create } from 'zustand'

export type Tool = 
  | 'select' | 'wall' | 'room' | 'door' | 'window' 
  | 'stairs' | 'measure' | 'text' | 'delete'

export type ViewMode = '2d' | '3d' | 'render'

export interface Wall {
  id: string
  x1: number; y1: number
  x2: number; y2: number
  thickness: number
  color: string
  height: number
}

export interface Room {
  id: string
  name: string
  type: string
  points: { x: number; y: number }[]
  floorColor: string
  wallColor: string
  ceilingHeight: number
}

export interface PlacedItem {
  id: string
  furnitureId: string
  name: string
  emoji: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  color?: string
}

interface EditorState {
  activeTool: Tool
  walls: Wall[]
  rooms: Room[]
  placedItems: PlacedItem[]
  selectedId: string | null
  viewMode: ViewMode
  gridSize: number
  snapToGrid: boolean
  zoom: number
  panX: number
  panY: number
  projectName: string

  setTool: (tool: Tool) => void
  addWall: (wall: Wall) => void
  updateWall: (id: string, updates: Partial<Wall>) => void
  deleteWall: (id: string) => void
  addRoom: (room: Room) => void
  placeItem: (item: PlacedItem) => void
  updateItem: (id: string, updates: Partial<PlacedItem>) => void
  deleteItem: (id: string) => void
  deleteSelected: () => void
  setSelected: (id: string | null) => void
  setViewMode: (mode: ViewMode) => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setProjectName: (name: string) => void
  setSnapToGrid: (snap: boolean) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeTool: 'select',
  walls: [],
  rooms: [],
  placedItems: [],
  selectedId: null,
  viewMode: '2d',
  gridSize: 20,
  snapToGrid: true,
  zoom: 1,
  panX: 0,
  panY: 0,
  projectName: 'Untitled Project',

  setTool: (tool) => set({ activeTool: tool, selectedId: null }),

  addWall: (wall) => set((s) => ({ walls: [...s.walls, wall] })),
  
  updateWall: (id, updates) => set((s) => ({
    walls: s.walls.map(w => w.id === id ? { ...w, ...updates } : w)
  })),
  
  deleteWall: (id) => set((s) => ({
    walls: s.walls.filter(w => w.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),

  addRoom: (room) => set((s) => ({ rooms: [...s.rooms, room] })),

  placeItem: (item) => set((s) => ({ placedItems: [...s.placedItems, item] })),

  updateItem: (id, updates) => set((s) => ({
    placedItems: s.placedItems.map(i => i.id === id ? { ...i, ...updates } : i)
  })),

  deleteItem: (id) => set((s) => ({
    placedItems: s.placedItems.filter(i => i.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),

  deleteSelected: () => {
    const { selectedId } = get()
    if (!selectedId) return
    set((s) => ({
      walls: s.walls.filter(w => w.id !== selectedId),
      placedItems: s.placedItems.filter(i => i.id !== selectedId),
      selectedId: null,
    }))
  },

  setSelected: (id) => set({ selectedId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setProjectName: (name) => set({ projectName: name }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),
}))
