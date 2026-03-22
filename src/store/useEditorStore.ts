import { create } from 'zustand'

export type Tool = 
  | 'select' | 'wall' | 'room' | 'door' | 'window' 
  | 'stairs' | 'measure' | 'text' | 'delete'

export type ViewMode = '2d' | '3d' | 'walkthrough' | 'render'

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
  depth: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  color?: string
}

export interface Door {
  id: string
  wallId: string
  position: number
  width: number
  opensInward: boolean
}

export interface Window {
  id: string
  wallId: string
  position: number
  width: number
  sillHeight: number
}

interface EditorState {
  activeTool: Tool
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
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
  addDoor: (door: Door) => void
  deleteDoor: (id: string) => void
  addWindow: (win: Window) => void
  deleteWindow: (id: string) => void
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

  hydrate: (data: EditorSnapshot) => void
  exportSnapshot: () => EditorSnapshot
}

export interface EditorSnapshot {
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
  placedItems: PlacedItem[]
  projectName: string
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeTool: 'select',
  walls: [],
  rooms: [],
  doors: [],
  windows: [],
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

  addDoor: (door) => set((s) => ({ doors: [...s.doors, door] })),
  deleteDoor: (id) => set((s) => ({
    doors: s.doors.filter(d => d.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),

  addWindow: (win) => set((s) => ({ windows: [...s.windows, win] })),
  deleteWindow: (id) => set((s) => ({
    windows: s.windows.filter(w => w.id !== id),
    selectedId: s.selectedId === id ? null : s.selectedId,
  })),

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
      doors: s.doors.filter(d => d.id !== selectedId),
      windows: s.windows.filter(w => w.id !== selectedId),
      selectedId: null,
    }))
  },

  setSelected: (id) => set({ selectedId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setProjectName: (name) => set({ projectName: name }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  hydrate: (data) => set({
    walls: data.walls ?? [],
    rooms: data.rooms ?? [],
    doors: data.doors ?? [],
    windows: data.windows ?? [],
    placedItems: data.placedItems ?? [],
    projectName: data.projectName ?? 'Untitled Project',
  }),

  exportSnapshot: () => {
    const s = get()
    return {
      walls: s.walls,
      rooms: s.rooms,
      doors: s.doors,
      windows: s.windows,
      placedItems: s.placedItems,
      projectName: s.projectName,
    }
  },
}))
