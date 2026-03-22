import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  MousePointer2, Minus, Square, DoorOpen,
  Grid3x3, Ruler, Trash2, ZoomIn, ZoomOut,
  Box, Camera, Footprints, Save, Share2,
  ChevronLeft, Grip, Check, Wand2, Sparkles,
  Undo2, Redo2, Settings, HelpCircle, Copy,
  Download, Image, Layers, Plus
} from 'lucide-react'
import Canvas2D from '@/components/editor/Canvas2D'
import Canvas3D from '@/components/editor/Canvas3D'
import WalkthroughView from '@/components/editor/WalkthroughView'
import RenderView from '@/components/editor/RenderView'
import FurnitureLibrary from '@/components/editor/FurnitureLibrary'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import SmartWizard from '@/components/editor/SmartWizard'
import AIDesignGenerator from '@/components/editor/AIDesignGenerator'
import { useEditorStore, type Tool, type EditorSnapshot } from '@/store/useEditorStore'
import { Link, useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

const STORAGE_KEY = 'homeforge-projects'

const TOOLS: { id: Tool; icon: React.ElementType; label: string; shortcut: string }[] = [
  { id: 'select',  icon: MousePointer2, label: 'Select',      shortcut: 'V' },
  { id: 'wall',    icon: Minus,         label: 'Draw Wall',   shortcut: 'W' },
  { id: 'room',    icon: Square,        label: 'Draw Room',   shortcut: 'R' },
  { id: 'door',    icon: DoorOpen,      label: 'Add Door',    shortcut: 'D' },
  { id: 'window',  icon: Grid3x3,       label: 'Add Window',  shortcut: 'N' },
  { id: 'measure', icon: Ruler,         label: 'Measure',     shortcut: 'M' },
  { id: 'delete',  icon: Trash2,        label: 'Delete',      shortcut: 'Del' },
]

function loadProject(id: string): EditorSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    return all[id] ?? null
  } catch { return null }
}

function saveProject(id: string, data: EditorSnapshot) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const all = raw ? JSON.parse(raw) : {}
    all[id] = { ...data, savedAt: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (e) { console.error('Save failed', e) }
}

function IconBtn({ icon: Icon, label, shortcut, active, onClick, className = '' }: {
  icon: React.ElementType; label: string; shortcut?: string
  active?: boolean; onClick?: () => void; className?: string
}) {
  return (
    <div className="group relative" onClick={onClick}>
      <button className={`p5d-icon-btn ${active ? 'active' : ''} ${className}`} title={label}>
        <Icon size={16} />
      </button>
      <span className="p5d-tooltip">{label}{shortcut ? ` (${shortcut})` : ''}</span>
    </div>
  )
}

function ToolBtn({ tool, active, onClick }: { tool: typeof TOOLS[number]; active: boolean; onClick: () => void }) {
  return (
    <div className="group relative w-full flex justify-center" onClick={onClick}>
      <button className={`p5d-tool-btn ${active ? 'active' : ''}`}>
        <tool.icon size={17} />
      </button>
      <span className="p5d-tooltip">{tool.label} <span style={{ opacity: 0.6 }}>{tool.shortcut}</span></span>
    </div>
  )
}

function ViewSwitch({ viewMode, onChange }: {
  viewMode: '2d' | '3d' | 'render' | 'walkthrough'
  onChange: (m: '2d' | '3d' | 'render' | 'walkthrough') => void
}) {
  return (
    <div className="p5d-switch">
      <div className={`p5d-switch-item ${viewMode === '2d' ? 'is-active' : ''}`} onClick={() => onChange('2d')}>2D</div>
      <div className={`p5d-switch-item is-3d ${viewMode === '3d' ? 'is-active' : ''}`} onClick={() => onChange('3d')}>3D</div>
      <div className={`p5d-switch-item ${viewMode === 'render' ? 'is-active' : ''}`} onClick={() => onChange('render')}
        style={{ display:'flex', alignItems:'center', gap:4 }}>
        <Camera size={12} />Render
      </div>
      <div className={`p5d-switch-item ${viewMode === 'walkthrough' ? 'is-active' : ''}`} onClick={() => onChange('walkthrough')}
        style={{ display:'flex', alignItems:'center', gap:4 }}>
        <Footprints size={12} />Walk
      </div>
    </div>
  )
}

function FloorSelector() {
  const [open, setOpen] = useState(false)
  const [floors] = useState(['Ground Floor', 'First Floor', 'Second Floor'])
  const [active, setActive] = useState(0)
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium text-[#333] hover:bg-[#f0f0ee] border border-[#e4e4e4] transition-colors">
        <Layers size={13} className="text-[#888]" />
        <span>{floors[active]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="#888" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-[#e4e4e4] rounded-lg shadow-float z-50 py-1 panel-slide-in">
          {floors.map((f, i) => (
            <div key={f} onClick={() => { setActive(i); setOpen(false) }}
              className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-[#f0f0ee] ${i === active ? 'text-[#1eaedb] font-semibold' : 'text-[#333]'}`}>
              {f}{i === active && <Check size={12} className="text-[#1eaedb]" />}
            </div>
          ))}
          <div className="border-t border-[#e4e4e4] mt-1 pt-1">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#1eaedb] cursor-pointer hover:bg-[#e8f6fc] font-medium">
              <Plus size={12} /> Add Floor
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Editor() {
  const { projectId } = useParams()
  const { toast } = useToast()
  const projectKey = projectId || 'default'
  const { activeTool, setTool, viewMode, setViewMode, zoom, setZoom,
          projectName, setProjectName, deleteSelected, hydrate, exportSnapshot } = useEditorStore()
  const [showFurniture, setShowFurniture] = useState(true)
  const [saved, setSaved] = useState(false)
  const [smartWizardOpen, setSmartWizardOpen] = useState(false)
  const [aiDesignOpen, setAIDesignOpen] = useState(false)
  const [renderDropOpen, setRenderDropOpen] = useState(false)

  useEffect(() => {
    const data = loadProject(projectKey)
    if (data && typeof data === 'object') hydrate(data as Parameters<typeof hydrate>[0])
  }, [projectKey, hydrate])

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return useEditorStore.subscribe(() => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      saveTimeout.current = setTimeout(() => saveProject(projectKey, exportSnapshot()), 2000)
    })
  }, [projectKey, exportSnapshot])

  const handleSave = useCallback(() => {
    saveProject(projectKey, exportSnapshot())
    setSaved(true)
    toast({ title: 'Saved', description: 'Project saved successfully.' })
    setTimeout(() => setSaved(false), 2000)
  }, [projectKey, exportSnapshot, toast])

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/editor/${projectKey}`)
      .then(() => toast({ title: 'Link copied' }))
  }, [projectKey, toast])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      const map: Record<string, Tool> = { v:'select', w:'wall', r:'room', d:'door', n:'window', m:'measure' }
      if (map[e.key.toLowerCase()]) setTool(map[e.key.toLowerCase()])
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected()
      if (e.key === 'Escape') setTool('select')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setTool, deleteSelected])

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f6f6f4' }}>
      <header className="p5d-header px-3 flex-shrink-0" style={{ position: "relative" }}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Link to="/" className="flex items-center gap-1 text-xs text-[#888] hover:text-[#333] transition-colors flex-shrink-0">
            <ChevronLeft size={14} />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1eaedb' }}>
              <Box size={14} color="#fff" />
            </div>
          </Link>
          <div className="w-px h-5 bg-[#e4e4e4] flex-shrink-0" />
          <input value={projectName} onChange={e => setProjectName(e.target.value)}
            className="text-sm font-semibold text-[#333] bg-transparent border-none outline-none hover:bg-[#f0f0ee] focus:bg-[#f0f0ee] px-2 py-1 rounded-md min-w-0 max-w-[160px] truncate"
            style={{ fontFamily: 'inherit' }} />
          <FloorSelector />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <ViewSwitch viewMode={viewMode} onChange={setViewMode} />
        </div>

        <div className="flex items-center gap-1 flex-1 justify-end">
          <IconBtn icon={Undo2} label="Undo" shortcut="Ctrl+Z" />
          <IconBtn icon={Redo2} label="Redo" shortcut="Ctrl+Y" />
          <div className="w-px h-5 bg-[#e4e4e4] mx-1" />
          <div className="relative">
            <div className="group relative">
              <button className={`p5d-icon-btn ${renderDropOpen ? 'active' : ''}`} onClick={() => setRenderDropOpen(o => !o)}>
                <Camera size={16} />
              </button>
              {!renderDropOpen && <span className="p5d-tooltip">Render</span>}
            </div>
            {renderDropOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-48 bg-white border border-[#e4e4e4] rounded-lg shadow-float z-50 py-1 panel-slide-in">
                {[
                  { label: 'Realistic Render', icon: Image,     action: () => { setViewMode('render'); setRenderDropOpen(false) } },
                  { label: '3D Walkthrough',    icon: Footprints,action: () => { setViewMode('walkthrough'); setRenderDropOpen(false) } },
                  { label: 'Export PNG',        icon: Download,  action: () => setRenderDropOpen(false) },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[#333] hover:bg-[#f0f0ee] transition-colors">
                    <item.icon size={14} className="text-[#888]" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <IconBtn icon={Copy}       label="Duplicate" />
          <IconBtn icon={Share2}     label="Share"    onClick={handleShare} />
          <IconBtn icon={HelpCircle} label="Help" />
          <IconBtn icon={Settings}   label="Settings" />
          <div className="w-px h-5 bg-[#e4e4e4] mx-1" />
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 h-8 rounded-md text-xs font-semibold transition-all active:scale-[0.97]"
            style={{ background: saved ? '#68b631' : '#1eaedb', color: '#fff' }}>
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col items-center py-2 gap-0.5 flex-shrink-0 z-10"
          style={{ width:'var(--p5d-toolbar-w)', background:'#fff', borderRight:'1px solid #e4e4e4', boxShadow:'1px 0 4px rgba(0,0,0,0.04)' }}>
          {TOOLS.map(tool => (
            <ToolBtn key={tool.id} tool={tool} active={activeTool === tool.id} onClick={() => setTool(tool.id)} />
          ))}
          <div className="w-6 h-px bg-[#e4e4e4] my-1.5" />
          <div className="group relative w-full flex justify-center">
            <button onClick={() => setSmartWizardOpen(true)} className="p5d-tool-btn" style={{ color:'#1eaedb' }}>
              <Wand2 size={17} />
            </button>
            <span className="p5d-tooltip">Smart Wizard</span>
          </div>
          <div className="group relative w-full flex justify-center">
            <button onClick={() => setAIDesignOpen(true)} className="p5d-tool-btn" style={{ color:'#68b631' }}>
              <Sparkles size={17} />
            </button>
            <span className="p5d-tooltip">AI Design</span>
          </div>
          <div className="w-6 h-px bg-[#e4e4e4] my-1.5" />
          <div className="group relative w-full flex justify-center">
            <button onClick={() => setShowFurniture(f => !f)} className={`p5d-tool-btn ${showFurniture ? 'active' : ''}`}>
              <Grip size={17} />
            </button>
            <span className="p5d-tooltip">Furniture Library</span>
          </div>
        </div>

        {showFurniture && (viewMode === '2d' || viewMode === '3d') && (
          <div className="panel-slide-in flex-shrink-0" style={{ width:'var(--p5d-panel-w)' }}>
            <FurnitureLibrary />
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          {viewMode === '2d'          && <Canvas2D />}
          {viewMode === '3d'          && <Canvas3D />}
          {viewMode === 'walkthrough' && <WalkthroughView />}
          {viewMode === 'render'      && <RenderView />}
          {viewMode === '2d' && (
            <div className="absolute bottom-5 right-5 flex flex-col overflow-hidden"
              style={{ background:'#fff', border:'1px solid #e4e4e4', borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
              <button onClick={() => setZoom(zoom + 0.15)} className="p-2 hover:bg-[#f0f0ee] transition-colors flex items-center justify-center">
                <ZoomIn size={15} color="#555" />
              </button>
              <div className="px-3 py-1 text-center border-y border-[#e4e4e4]"
                style={{ fontSize:10, color:'#888', fontVariantNumeric:'tabular-nums' }}>
                {Math.round(zoom * 100)}%
              </div>
              <button onClick={() => setZoom(zoom - 0.15)} className="p-2 hover:bg-[#f0f0ee] transition-colors flex items-center justify-center">
                <ZoomOut size={15} color="#555" />
              </button>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ background:'rgba(255,255,255,0.88)', border:'1px solid #e4e4e4', borderRadius:20,
                     padding:'4px 14px', fontSize:10, color:'#888', backdropFilter:'blur(4px)' }}>
            {viewMode === '2d' ? 'Scroll to zoom · Alt+drag to pan · Click to select' : 'Drag to orbit · Scroll to zoom · Right-drag to pan'}
          </div>
        </div>
        <PropertiesPanel />
      </div>

      <SmartWizard       open={smartWizardOpen} onOpenChange={setSmartWizardOpen} />
      <AIDesignGenerator open={aiDesignOpen}    onOpenChange={setAIDesignOpen} />
      {renderDropOpen && <div className="fixed inset-0 z-40" onClick={() => setRenderDropOpen(false)} />}
    </div>
  )
}
