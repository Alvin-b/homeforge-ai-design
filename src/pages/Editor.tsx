import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  MousePointer2, Minus, Square, DoorOpen,
  Grid3x3, Ruler, Trash2,
  ZoomIn, ZoomOut, Box, Camera, Footprints,
  Save, Share2, ChevronLeft, Grip, Check, Wand2, Sparkles
} from 'lucide-react'
import Canvas2D from '@/components/editor/Canvas2D'
import Canvas3D from '@/components/editor/Canvas3D'
import WalkthroughView from '@/components/editor/WalkthroughView'
import RenderView from '@/components/editor/RenderView'
import FurnitureLibrary from '@/components/editor/FurnitureLibrary'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import SmartWizard from '@/components/editor/SmartWizard'
import AIDesignGenerator from '@/components/editor/AIDesignGenerator'
import { useEditorStore, type Tool } from '@/store/useEditorStore'
import { Link, useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

const STORAGE_KEY = 'homeforge-projects'

const TOOLS: { id: Tool; icon: any; label: string; shortcut: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'wall', icon: Minus, label: 'Draw Wall', shortcut: 'W' },
  { id: 'room', icon: Square, label: 'Draw Room', shortcut: 'R' },
  { id: 'door', icon: DoorOpen, label: 'Add Door', shortcut: 'D' },
  { id: 'window', icon: Grid3x3, label: 'Add Window', shortcut: 'N' },
  { id: 'measure', icon: Ruler, label: 'Measure', shortcut: 'M' },
  { id: 'delete', icon: Trash2, label: 'Delete', shortcut: 'Del' },
]

function loadProject(id: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    return all[id] ?? null
  } catch {
    return null
  }
}

function saveProject(id: string, data: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[id] = { ...data, savedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (e) {
    console.error('Failed to save project', e)
  }
}

export default function Editor() {
  const { projectId } = useParams()
  const { toast } = useToast()
  const projectKey = projectId || 'default'
  const {
    activeTool, setTool, viewMode, setViewMode,
    zoom, setZoom, projectName, setProjectName,
    deleteSelected, hydrate, exportSnapshot
  } = useEditorStore()
  const [showFurniture, setShowFurniture] = useState(true)
  const [saved, setSaved] = useState(false)
  const [smartWizardOpen, setSmartWizardOpen] = useState(false)
  const [aiDesignOpen, setAIDesignOpen] = useState(false)

  useEffect(() => {
    const data = loadProject(projectKey)
    if (data && typeof data === 'object') {
      hydrate(data as Parameters<typeof hydrate>[0])
    }
  }, [projectKey, hydrate])

  const handleSave = useCallback(() => {
    saveProject(projectKey, exportSnapshot())
    setSaved(true)
    toast({ title: 'Project saved', description: 'Your design has been saved.' })
    setTimeout(() => setSaved(false), 2000)
  }, [projectKey, exportSnapshot, toast])

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/editor/${projectKey}`
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'Link copied', description: 'Share this link to view the project.' })
    })
  }, [projectKey, toast])

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return useEditorStore.subscribe(() => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        saveProject(projectKey, exportSnapshot())
      }, 2000)
    })
  }, [projectKey, exportSnapshot])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      const map: Record<string, Tool> = { v: 'select', w: 'wall', r: 'room', d: 'door', n: 'window', m: 'measure' }
      if (map[e.key.toLowerCase()]) setTool(map[e.key.toLowerCase()])
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected()
      if (e.key === 'Escape') setTool('select')
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
          <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors active:scale-[0.97]">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity active:scale-[0.97]">
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Saved' : 'Save'}
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
            onClick={() => setSmartWizardOpen(true)}
            title="Smart Wizard - Auto generate room"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-highlight/10 hover:text-highlight transition-all active:scale-[0.95]"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAIDesignOpen(true)}
            title="AI Design Generator"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-highlight/10 hover:text-highlight transition-all active:scale-[0.95]"
          >
            <Sparkles className="w-4 h-4" />
          </button>
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

        {/* Furniture Library - show in 2D and 3D */}
        {showFurniture && (viewMode === '2d' || viewMode === '3d') && <FurnitureLibrary />}

        {/* Main Canvas */}
        <div className="flex-1 relative overflow-hidden">
          {viewMode === '2d' && <Canvas2D />}
          {viewMode === '3d' && <Canvas3D />}
          {viewMode === 'walkthrough' && <WalkthroughView />}
          {viewMode === 'render' && <RenderView />}

          {/* Zoom Controls - 2D only */}
          {viewMode === '2d' && (
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
          )}
        </div>

        {/* Right Panel */}
        <PropertiesPanel />
      </div>

      <SmartWizard open={smartWizardOpen} onOpenChange={setSmartWizardOpen} />
      <AIDesignGenerator open={aiDesignOpen} onOpenChange={setAIDesignOpen} />
    </div>
  )
}
