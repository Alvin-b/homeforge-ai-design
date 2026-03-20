import React, { useState, useEffect } from 'react'
import {
  MousePointer2, Minus, Square, DoorOpen,
  Grid3x3, Ruler, Trash2, RotateCcw, RotateCw,
  ZoomIn, ZoomOut, Box, Camera, Wand2,
  Save, Share2, ChevronLeft, Grip
} from 'lucide-react'
import Canvas2D from '@/components/editor/Canvas2D'
import Canvas3D from '@/components/editor/Canvas3D'
import FurnitureLibrary from '@/components/editor/FurnitureLibrary'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import { useEditorStore, type Tool } from '@/store/useEditorStore'
import { Link } from 'react-router-dom'

const TOOLS: { id: Tool; icon: any; label: string; shortcut: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'wall', icon: Minus, label: 'Draw Wall', shortcut: 'W' },
  { id: 'room', icon: Square, label: 'Draw Room', shortcut: 'R' },
  { id: 'door', icon: DoorOpen, label: 'Add Door', shortcut: 'D' },
  { id: 'window', icon: Grid3x3, label: 'Add Window', shortcut: 'N' },
  { id: 'measure', icon: Ruler, label: 'Measure', shortcut: 'M' },
  { id: 'delete', icon: Trash2, label: 'Delete', shortcut: 'Del' },
]

export default function Editor() {
  const {
    activeTool, setTool, viewMode, setViewMode,
    zoom, setZoom, projectName, setProjectName,
    deleteSelected, selectedId
  } = useEditorStore()
  const [showFurniture, setShowFurniture] = useState(true)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      const map: Record<string, Tool> = { v: 'select', w: 'wall', r: 'room', d: 'door', n: 'window', m: 'measure' }
      if (map[e.key.toLowerCase()]) {
        setTool(map[e.key.toLowerCase()])
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setTool, deleteSelected])

  return (
    <div className="flex flex-col h-screen bg-muted overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-card border-b border-border flex items-center justify-between px-3 z-10 shadow-toolbar">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Box className="w-3 h-3 text-primary-foreground" />
            </div>
          </Link>
          <div className="w-px h-5 bg-border" />
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-sm font-display font-semibold text-foreground bg-transparent border-none outline-none hover:bg-muted px-2 py-1 rounded-md w-48"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-0.5">
          {([
            { id: '2d' as const, icon: Grid3x3, label: '2D' },
            { id: '3d' as const, icon: Box, label: '3D' },
            { id: 'render' as const, icon: Camera, label: 'Render' },
          ]).map((view) => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all active:scale-[0.97] ${
                viewMode === view.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <view.icon className="w-3.5 h-3.5" />
              {view.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors active:scale-[0.97]">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity active:scale-[0.97]">
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-12 bg-card border-r border-border flex flex-col items-center py-2 gap-0.5 z-10">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setTool(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-[0.95] ${
                activeTool === tool.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <tool.icon className="w-4 h-4" />
            </button>
          ))}

          <div className="w-6 h-px bg-border my-1.5" />

          <button
            onClick={() => setShowFurniture(!showFurniture)}
            title="Toggle Furniture Library"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-[0.95] ${
              showFurniture ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Grip className="w-4 h-4" />
          </button>
        </div>

        {/* Furniture Library */}
        {showFurniture && viewMode === '2d' && <FurnitureLibrary />}

        {/* Main Canvas */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === '2d' && <Canvas2D />}
          {viewMode === '3d' && <Canvas3D />}
          {viewMode === 'render' && (
            <div className="w-full h-full flex items-center justify-center bg-surface-dark">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-lg font-display font-semibold text-primary-foreground">4K Render</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate a photorealistic render of your space
                </p>
                <button className="mt-4 bg-highlight text-highlight-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]">
                  Start Render
                </button>
              </div>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col bg-card rounded-xl shadow-toolbar border border-border overflow-hidden">
            <button
              onClick={() => setZoom(zoom + 0.15)}
              className="p-2 hover:bg-muted transition-colors active:scale-[0.95]"
            >
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <div className="px-3 py-1 text-[11px] text-center text-muted-foreground border-y border-border tabular-nums">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={() => setZoom(zoom - 0.15)}
              className="p-2 hover:bg-muted transition-colors active:scale-[0.95]"
            >
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <PropertiesPanel />
      </div>
    </div>
  )
}
