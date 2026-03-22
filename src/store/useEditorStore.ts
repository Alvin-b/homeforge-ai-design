import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateCreator } from 'zustand'


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

export interface Stair {
  id: string
  x: number
  y: number
  width: number
  depth: number
  direction: number
}

interface EditorState {
  activeTool: Tool
  walls: Wall[]
  history: EditorSnapshot[]
  historyIndex: number
  currentFloor: number
  floors: FloorSnapshot[]
  measurements: Measurement[]
  theme: Theme

  undo: () => void
  redo: () => void
  addFloor: () => void
  setCurrentFloor: (floor: number) => void
  addMeasurement: (meas: Measurement) => void
  deleteMeasurement: (id: string) => void
  setTheme: (theme: Partial<Theme>) => void

  rooms: Room[]
  doors: Door[]
  windows: Window[]
  stairs: Stair[]
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
  updateRoom: (id: string, updates: Partial<Room>) => void
  addDoor: (door: Door) => void
  deleteDoor: (id: string) => void
  addWindow: (win: Window) => void
  deleteWindow: (id: string) => void
  addStair: (stair: Stair) => void
  updateStair: (id: string, updates: Partial<Stair>) => void
  deleteStair: (id: string) => void
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

interface FloorSnapshot {
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
  stairs: Stair[]
  placedItems: PlacedItem[]
}

interface Measurement {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  label?: string
}

interface Theme {
  wallColor: string
  floorColor: string
  furnitureStyle: 'modern' | 'classic' | 'boho'
}

export interface EditorSnapshot {
  floors: FloorSnapshot[]
  measurements: Measurement[]
  theme: Theme
  projectName: string
}

export const useEditorStore = create(
  persist(
    (set, get) => ({
      activeTool: 'select',
      walls: [],
      rooms: [],
      history: [] as EditorSnapshot[],
      historyIndex: -1,
      currentFloor: 0,
      floors: [{ walls: [], rooms: [], doors: [], windows: [], stairs: [], placedItems: [] }],
      measurements: [] as { id: string; startX: number; startY: number; endX: number; endY: number; label?: string }[],
  theme: {
        wallColor: '#e5e7eb',
        floorColor: '#f3f4f6',
        furnitureStyle: 'modern',
      },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1]
      set({ 
        historyIndex: historyIndex - 1,
        floors: prev.floors || get().floors,
        measurements: prev.measurements || [],
        theme: prev.theme || get().theme,
      })
    }
  },

  redo: () => {
    const { history, historyIndex, floors, measurements, theme } = get()
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1]
      set({ 
        historyIndex: historyIndex + 1,
        floors: next.floors || floors,
        measurements: next.measurements || measurements,
        theme: next.theme || theme,
      })
    }
  },

  addFloor: () => set((s) => ({
    floors: [...s.floors, { walls: [], rooms: [], doors: [], windows: [], stairs: [], placedItems: [] }],
  })),

  setCurrentFloor: (floor) => {
    if (floor < 0 || floor >= get().floors.length) return
    set({ currentFloor: floor })
  },

  addMeasurement: (meas) => set((s) => ({
    measurements: [...s.measurements, meas]
  })),

  deleteMeasurement: (id) => set((s) => ({
    measurements: s.measurements.filter(m => m.id !== id)
  })),

  setTheme: (updates) => set((s) => ({
    theme: { ...s.theme, ...updates }
  })),

  doors: [],

  doors: [],
  windows: [],
  stairs: [],
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
  updateRoom: (id, updates) => set((s) => ({
    rooms: s.rooms.map(r => r.id === id ? { ...r, ...updates } : r)
  })),

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
  addStair: (stair) => set((s) => ({ stairs: [...s.stairs, stair] })),
  updateStair: (id, updates) => set((s) => ({
    stairs: s.stairs.map(st => st.id === id ? { ...st, ...updates } : st)
  })),
  deleteStair: (id) => set((s) => ({
    stairs: s.stairs.filter(st => st.id !== id),
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
      rooms: s.rooms.filter(r => r.id !== selectedId),
      placedItems: s.placedItems.filter(i => i.id !== selectedId),
      doors: s.doors.filter(d => d.id !== selectedId),
      windows: s.windows.filter(w => w.id !== selectedId),
      stairs: s.stairs.filter(st => st.id !== selectedId),
      selectedId: null,
    }))
  },

  setSelected: (id) => set({ selectedId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setProjectName: (name) => set({ projectName: name }),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  // Update hydrate to handle new fields
  hydrate: (data: Partial<EditorState>) => set((s) => ({
    floors: data.floors || s.floors,
    measurements: data.measurements || s.measurements,
    theme: data.theme || s.theme,
    // Backwards compat
    walls: data.walls ? [{ walls: data.walls, rooms: data.rooms || [], doors: data.doors || [], windows: data.windows || [], stairs: data.stairs || [], placedItems: data.placedItems || [] }] : s.floors,
  })),

    rooms: data.rooms ?? [],
    doors: data.doors ?? [],
    windows: data.windows ?? [],
    stairs: data.stairs ?? [],
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
      stairs: s.stairs,
      placedItems: s.placedItems,
      projectName: s.projectName,
    }
  },
}))
