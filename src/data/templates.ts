import type { EditorSnapshot } from '@/store/useEditorStore'

export const TEMPLATES: { id: string; name: string; desc: string; snapshot: EditorSnapshot }[] = [
  {
    id: 'blank',
    name: 'Blank',
    desc: 'Start from scratch',
    snapshot: { walls: [], rooms: [], doors: [], windows: [], stairs: [], placedItems: [], projectName: 'New Project' },
  },
  {
    id: 'living-room',
    name: 'Living Room',
    desc: 'Pre-furnished living room',
    snapshot: {
      projectName: 'Living Room',
      walls: [
        { id: 'w1', x1: 200, y1: 200, x2: 450, y2: 200, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w2', x1: 450, y1: 200, x2: 450, y2: 400, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w3', x1: 450, y1: 400, x2: 200, y2: 400, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w4', x1: 200, y1: 400, x2: 200, y2: 200, thickness: 8, color: '#374151', height: 2.7 },
      ],
      rooms: [{
        id: 'r1', name: 'Living Room', type: 'living',
        points: [{ x: 200, y: 200 }, { x: 450, y: 200 }, { x: 450, y: 400 }, { x: 200, y: 400 }],
        floorColor: '#f3f4f6', wallColor: '#e5e7eb', ceilingHeight: 2.7,
      }],
      doors: [{ id: 'd1', wallId: 'w1', position: 0.3, width: 0.9, opensInward: true }],
      windows: [{ id: 'n1', wallId: 'w2', position: 0.5, width: 1.2, sillHeight: 1.0 }],
      stairs: [],
      placedItems: [
        { id: 'i1', furnitureId: 'sofa-1', name: '3-Seater Sofa', emoji: '🛋️', x: 280, y: 340, width: 2.2, depth: 0.85, height: 0.9, rotation: 0, scaleX: 1, scaleY: 1 },
        { id: 'i2', furnitureId: 'table-2', name: 'Coffee Table', emoji: '☕', x: 320, y: 280, width: 1.2, depth: 0.6, height: 0.45, rotation: 0, scaleX: 1, scaleY: 1 },
        { id: 'i3', furnitureId: 'chair-1', name: 'Office Chair', emoji: '🪑', x: 400, y: 230, width: 0.6, depth: 0.6, height: 1.2, rotation: 180, scaleX: 1, scaleY: 1 },
      ],
    },
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    desc: 'Pre-furnished bedroom',
    snapshot: {
      projectName: 'Bedroom',
      walls: [
        { id: 'w1', x1: 250, y1: 180, x2: 400, y2: 180, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w2', x1: 400, y1: 180, x2: 400, y2: 380, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w3', x1: 400, y1: 380, x2: 250, y2: 380, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w4', x1: 250, y1: 380, x2: 250, y2: 180, thickness: 8, color: '#374151', height: 2.7 },
      ],
      rooms: [{
        id: 'r1', name: 'Bedroom', type: 'bedroom',
        points: [{ x: 250, y: 180 }, { x: 400, y: 180 }, { x: 400, y: 380 }, { x: 250, y: 380 }],
        floorColor: '#f5f5dc', wallColor: '#e5e7eb', ceilingHeight: 2.7,
      }],
      doors: [{ id: 'd1', wallId: 'w1', position: 0.5, width: 0.9, opensInward: true }],
      windows: [],
      stairs: [],
      placedItems: [
        { id: 'i1', furnitureId: 'bed-1', name: 'King Bed', emoji: '🛏️', x: 325, y: 280, width: 1.9, depth: 2.1, height: 0.5, rotation: 0, scaleX: 1, scaleY: 1 },
        { id: 'i2', furnitureId: 'storage-1', name: 'Bookshelf', emoji: '📚', x: 260, y: 200, width: 0.8, depth: 0.35, height: 2.0, rotation: 90, scaleX: 1, scaleY: 1 },
      ],
    },
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    desc: 'Pre-furnished kitchen',
    snapshot: {
      projectName: 'Kitchen',
      walls: [
        { id: 'w1', x1: 180, y1: 220, x2: 420, y2: 220, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w2', x1: 420, y1: 220, x2: 420, y2: 360, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w3', x1: 420, y1: 360, x2: 180, y2: 360, thickness: 8, color: '#374151', height: 2.7 },
        { id: 'w4', x1: 180, y1: 360, x2: 180, y2: 220, thickness: 8, color: '#374151', height: 2.7 },
      ],
      rooms: [{
        id: 'r1', name: 'Kitchen', type: 'kitchen',
        points: [{ x: 180, y: 220 }, { x: 420, y: 220 }, { x: 420, y: 360 }, { x: 180, y: 360 }],
        floorColor: '#e8e8e8', wallColor: '#f0f0f0', ceilingHeight: 2.7,
      }],
      doors: [{ id: 'd1', wallId: 'w1', position: 0.2, width: 0.9, opensInward: true }],
      windows: [{ id: 'n1', wallId: 'w2', position: 0.5, width: 1.5, sillHeight: 1.0 }],
      stairs: [],
      placedItems: [
        { id: 'i1', furnitureId: 'kitchen-1', name: 'Kitchen Island', emoji: '🍳', x: 300, y: 290, width: 1.5, depth: 0.8, height: 0.9, rotation: 0, scaleX: 1, scaleY: 1 },
        { id: 'i2', furnitureId: 'kitchen-2', name: 'Refrigerator', emoji: '🧊', x: 200, y: 240, width: 0.7, depth: 0.7, height: 1.8, rotation: 90, scaleX: 1, scaleY: 1 },
      ],
    },
  },
]
