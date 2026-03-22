import React, { useState, useEffect } from 'react'
import {
  MousePointer2, Minus, Square, DoorOpen,
  Grid3x3, Ruler, Layers,
  ZoomIn, ZoomOut
} from 'lucide-react'

import Canvas2D from '@/components/editor/Canvas2D'
import Canvas3D from '@/components/editor/Canvas3D'
import WalkthroughView from '@/components/editor/WalkthroughView'
import RenderView from '@/components/editor/RenderView'
import FurnitureLibrary from '@/components/editor/FurnitureLibrary'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import SmartWizard from '@/components/editor/SmartWizard'
import AIDesignGenerator from '@/components/editor/AIDesignGenerator'

// ✅ FROM YOUR BRANCH (UI FEATURES)
import TemplatePicker from '@/components/editor/TemplatePicker'
import MoodBoard from '@/components/editor/MoodBoard'
import ShoppingList from '@/components/editor/ShoppingList'

// ✅ MERGED STORE IMPORT (FIXED)
import { useEditorStore, type Tool, type EditorSnapshot } from '@/store/useEditorStore'

const TOOLS: { id: Tool; label: string; icon: any }[] = [
  { id: 'select', label: 'Select', icon: MousePointer2 },
  { id: 'wall', label: 'Wall', icon: Minus },
  { id: 'room', label: 'Room', icon: Square },
  { id: 'door', label: 'Door', icon: DoorOpen },
  { id: 'window', label: 'Window', icon: Grid3x3 },
  { id: 'measure', label: 'Measure', icon: Ruler },
]

export default function Editor() {
  const [view, setView] = useState<'2d' | '3d'>('2d')

  const {
    activeTool,
    setActiveTool,
    zoom,
    setZoom,
  } = useEditorStore()

  // 🔥 OPTIONAL: Save snapshot (for undo/redo later)
  const [history, setHistory] = useState<EditorSnapshot[]>([])

  useEffect(() => {
    // placeholder for snapshot saving
  }, [])

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">

      {/* 🔷 TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
        <div className="flex gap-2">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-2 rounded-md ${
                  activeTool === tool.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <Icon size={18} />
              </button>
            )
          })}
        </div>

        {/* VIEW SWITCH */}
        <div className="flex gap-2">
          <button onClick={() => setView('2d')} className="px-3 py-1 bg-gray-200 rounded">
            2D
          </button>
          <button onClick={() => setView('3d')} className="px-3 py-1 bg-gray-200 rounded">
            3D
          </button>
        </div>

        {/* ZOOM */}
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(zoom - 0.1)}>
            <ZoomOut size={18} />
          </button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom + 0.1)}>
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <FurnitureLibrary />
          <TemplatePicker />
          <MoodBoard />
          <ShoppingList />
        </div>

        {/* CENTER CANVAS */}
        <div className="flex-1 relative">
          {view === '2d' && <Canvas2D />}
          {view === '3d' && <Canvas3D />}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-72 bg-white border-l overflow-y-auto">
          <PropertiesPanel />
          <SmartWizard />
          <AIDesignGenerator />
        </div>
      </div>
    </div>
  )
}