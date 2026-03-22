import React, { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Sky, ContactShadows, GizmoHelper, GizmoViewport } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { Sun, Camera, AlertTriangle, Maximize2 } from 'lucide-react'
import FurnitureItem3D from '@/components/editor/FurnitureModel3D'

// ── Error boundary ────────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.err ? null : this.props.children }
}

const SCALE = 50

// ── Wall ─────────────────────────────────────────────────────────
function Wall3D({ wall }: { wall: any }) {
  const dx = wall.x2 - wall.x1, dy = wall.y2 - wall.y1
  const len = Math.sqrt(dx * dx + dy * dy) / SCALE
  const angle = Math.atan2(dy, dx)
  const cx = (wall.x1 + wall.x2) / 2 / SCALE
  const cz = (wall.y1 + wall.y2) / 2 / SCALE
  const wh = wall.height || 2.7
  const th = (wall.thickness || 15) / SCALE
  return (
    <mesh position={[cx, wh / 2, cz]} rotation={[0, -angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[len, wh, th]} />
      <meshStandardMaterial color="#f0ece6" roughness={0.88} />
    </mesh>
  )
}

// ── Room floor ────────────────────────────────────────────────────
function RoomFloor({ room }: { room: any }) {
  if (!room.points || room.points.length < 3) return null
  const shape = new THREE.Shape()
  shape.moveTo(room.points[0].x / SCALE, room.points[0].y / SCALE)
  room.points.slice(1).forEach((p: any) => shape.lineTo(p.x / SCALE, p.y / SCALE))
  shape.closePath()
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={new THREE.ShapeGeometry(shape)} attach="geometry" />
      <meshStandardMaterial color={room.floorColor || '#f5f2ec'} roughness={0.9} />
    </mesh>
  )
}

// ── Custom camera controller ──────────────────────────────────────
// Gives P5D-style controls:
//   Left-drag  = orbit (rotate around target, locked to above ground)
//   Right-drag = pan   (move target horizontally, NOT vertically)
//   Scroll     = zoom
function SceneControls({ quality }: { quality: string }) {
  const { camera, gl } = useThree()
  const target   = useRef(new THREE.Vector3(0, 0, 0))
  const isDrag   = useRef(false)
  const isPan    = useRef(false)
  const lastXY   = useRef({ x: 0, y: 0 })
  // Spherical coords
  const theta    = useRef(Math.PI / 4)   // horizontal angle
  const phi      = useRef(Math.PI / 4)   // vertical angle (from top)
  const radius   = useRef(14)

  const PHI_MIN  = 0.12                  // never go underground
  const PHI_MAX  = Math.PI / 2 - 0.05   // max tilt (almost horizontal)

  const syncCamera = () => {
    const r = radius.current
    const t = theta.current
    const p = phi.current
    camera.position.set(
      target.current.x + r * Math.sin(p) * Math.sin(t),
      target.current.y + r * Math.cos(p),
      target.current.z + r * Math.sin(p) * Math.cos(t)
    )
    camera.lookAt(target.current)
  }

  useEffect(() => {
    syncCamera()

    const el = gl.domElement

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { isDrag.current = true }
      if (e.button === 2) { isPan.current  = true }
      lastXY.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastXY.current.x
      const dy = e.clientY - lastXY.current.y
      lastXY.current = { x: e.clientX, y: e.clientY }

      if (isDrag.current) {
        // Orbit — rotate around target
        theta.current -= dx * 0.008
        phi.current    = Math.max(PHI_MIN, Math.min(PHI_MAX, phi.current + dy * 0.006))
        syncCamera()
      }

      if (isPan.current) {
        // Pan — move target horizontally in world space (no vertical drift)
        const panSpeed = radius.current * 0.0014
        // Right vector (perpendicular to view, horizontal only)
        const right = new THREE.Vector3(
          Math.cos(theta.current),
          0,
          -Math.sin(theta.current)
        ).normalize()
        // Forward vector (horizontal only, no Y component)
        const forward = new THREE.Vector3(
          -Math.sin(theta.current),
          0,
          -Math.cos(theta.current)
        ).normalize()
        target.current.addScaledVector(right, -dx * panSpeed)
        target.current.addScaledVector(forward, dy * panSpeed)
        syncCamera()
      }
    }

    const onMouseUp = () => { isDrag.current = false; isPan.current = false }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      radius.current = Math.max(2, Math.min(60, radius.current + e.deltaY * 0.012))
      syncCamera()
    }

    const onContextMenu = (e: Event) => e.preventDefault()

    // Touch support
    let lastTouchDist = 0
    let lastTouchX = 0, lastTouchY = 0
    let touchCount = 0

    const onTouchStart = (e: TouchEvent) => {
      touchCount = e.touches.length
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX
        lastTouchY = e.touches[0].clientY
        isDrag.current = true
      }
      if (e.touches.length === 2) {
        isDrag.current = false
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        lastTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 1 && isDrag.current) {
        const dx = e.touches[0].clientX - lastTouchX
        const dy = e.touches[0].clientY - lastTouchY
        lastTouchX = e.touches[0].clientX
        lastTouchY = e.touches[0].clientY
        theta.current -= dx * 0.008
        phi.current = Math.max(PHI_MIN, Math.min(PHI_MAX, phi.current + dy * 0.006))
        syncCamera()
      }
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2
        // Pinch zoom
        radius.current = Math.max(2, Math.min(60, radius.current * (lastTouchDist / dist)))
        // Two-finger pan
        const dx = cx - lastTouchX, dy = cy - lastTouchY
        const panSpeed = radius.current * 0.002
        const right = new THREE.Vector3(Math.cos(theta.current), 0, -Math.sin(theta.current))
        const forward = new THREE.Vector3(-Math.sin(theta.current), 0, -Math.cos(theta.current))
        target.current.addScaledVector(right, -dx * panSpeed)
        target.current.addScaledVector(forward, dy * panSpeed)
        lastTouchDist = dist
        lastTouchX = cx; lastTouchY = cy
        syncCamera()
      }
    }

    const onTouchEnd = () => { isDrag.current = false }

    el.addEventListener('mousedown',   onMouseDown)
    el.addEventListener('mousemove',   onMouseMove)
    el.addEventListener('mouseup',     onMouseUp)
    el.addEventListener('wheel',       onWheel, { passive: false })
    el.addEventListener('contextmenu', onContextMenu)
    el.addEventListener('touchstart',  onTouchStart, { passive: false })
    el.addEventListener('touchmove',   onTouchMove,  { passive: false })
    el.addEventListener('touchend',    onTouchEnd)

    return () => {
      el.removeEventListener('mousedown',   onMouseDown)
      el.removeEventListener('mousemove',   onMouseMove)
      el.removeEventListener('mouseup',     onMouseUp)
      el.removeEventListener('wheel',       onWheel)
      el.removeEventListener('contextmenu', onContextMenu)
      el.removeEventListener('touchstart',  onTouchStart)
      el.removeEventListener('touchmove',   onTouchMove)
      el.removeEventListener('touchend',    onTouchEnd)
    }
  }, [camera, gl])

  return null
}

// ── Ground plane ──────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#eae8e3" roughness={0.95} />
    </mesh>
  )
}

// ── Grid lines (custom, no inverse() GLSL) ────────────────────────
function GridLines({ size = 40, divisions = 40 }: { size?: number; divisions?: number }) {
  const points: number[] = []
  const step = size / divisions
  const half = size / 2
  for (let i = 0; i <= divisions; i++) {
    const v = -half + i * step
    points.push(-half, 0, v,  half, 0, v)  // horizontal
    points.push(v, 0, -half,  v, 0,  half) // vertical
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  return (
    <lineSegments geometry={geo} position={[0, 0.002, 0]}>
      <lineBasicMaterial color="#c8c6c0" transparent opacity={0.45} />
    </lineSegments>
  )
}

// ── Main scene ────────────────────────────────────────────────────
function Scene({ quality, showGrid, showSky }: { quality: string; showGrid: boolean; showSky: boolean }) {
  const { walls, placedItems, rooms } = useEditorStore()
  const lite = quality === 'lite'
  return (
    <>
      <PerspectiveCamera makeDefault fov={50} near={0.1} far={500} />
      <SceneControls quality={quality} />

      {/* Lighting */}
      <ambientLight intensity={lite ? 0.9 : 0.55} />
      <directionalLight
        position={[12, 20, 10]} intensity={1.5}
        castShadow={!lite}
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-far={60}
        shadow-camera-left={-25} shadow-camera-right={25}
        shadow-camera-top={25}  shadow-camera-bottom={-25}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-8, 12, -6]} intensity={0.4} />
      <hemisphereLight args={['#c8d8f0', '#d8c8a8', 0.5]} />

      {showSky
        ? <Sky sunPosition={[100, 30, 100]} />
        : <color attach="background" args={['#eeecea']} />
      }
      {!lite && <Environment preset="apartment" />}
      {!lite && <ContactShadows position={[0, 0, 0]} opacity={0.25} scale={30} blur={1.5} far={6} />}

      {/* Ground */}
      <Ground />

      {/* Custom grid — no inverse() shader */}
      {showGrid && <GridLines size={40} divisions={40} />}

      {/* Scene content */}
      {rooms.map((r: any)       => <RoomFloor    key={r.id} room={r} />)}
      {walls.map((w: any)       => <Wall3D       key={w.id} wall={w} />)}
      {placedItems.map((i: any) => <FurnitureItem3D key={i.id} item={i} />)}

      {/* Axis gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport axisColors={['#e05555', '#50c878', '#5588e0']} labelColor="white" />
      </GizmoHelper>
    </>
  )
}

// ── Canvas wrapper ────────────────────────────────────────────────
export default function Canvas3DView() {
  const [quality,  setQuality]  = useState('full')
  const [seed,     setSeed]     = useState(0)
  const [ready,    setReady]    = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showSky,  setShowSky]  = useState(false)

  useEffect(() => { setReady(true) }, [])

  const onError = () => {
    setSeed(s => s + 1)
    setQuality(q => q === 'full' ? 'lite' : 'broken')
  }

  if (!ready) return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#eeecea' }}>
      <div className="w-8 h-8 border-2 border-[#1eaedb] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (quality === 'broken') return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center px-6">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-semibold mb-1">WebGL Unavailable</p>
        <p className="text-xs text-muted-foreground mb-4">
          Enable WebGL: Chrome → <code>chrome://flags/#ignore-gpu-blocklist</code> → Enabled
        </p>
        <button onClick={() => { setSeed(s => s+1); setQuality('lite') }}
          className="px-4 py-2 rounded-lg bg-[#1eaedb] text-white text-xs font-semibold">
          Retry in lite mode
        </button>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full relative" style={{ background: '#eeecea' }}>
      <ErrorBoundary key={`${quality}-${seed}`} onError={onError}>
        <Canvas
          shadows={quality === 'full'}
          dpr={quality === 'full' ? [1, 1.5] : 1}
          gl={{
            failIfMajorPerformanceCaveat: false,
            antialias: quality !== 'lite',
            powerPreference: 'low-power',
            alpha: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#eeecea'), 1)
            if (quality !== 'lite') {
              gl.shadowMap.enabled = true
              gl.shadowMap.type = THREE.PCFSoftShadowMap
            }
          }}
        >
          <Scene quality={quality} showGrid={showGrid} showSky={showSky} />
        </Canvas>
      </ErrorBoundary>

      {/* Toolbar overlay */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {[
          { icon: '⊞', active: showGrid, toggle: () => setShowGrid(g => !g), title: 'Grid' },
          { icon: '☀', active: showSky,  toggle: () => setShowSky(s => !s),  title: 'Sky' },
        ].map(({ icon, active, toggle, title }) => (
          <button key={title} onClick={toggle} title={title}
            className="w-8 h-8 rounded-lg flex items-center justify-center border text-sm transition-colors"
            style={{
              background: active ? '#1eaedb' : 'rgba(255,255,255,0.88)',
              color:      active ? '#fff'    : '#888',
              border:     `1px solid ${active ? '#1eaedb' : '#e4e4e4'}`,
            }}>
            {icon}
          </button>
        ))}
        <button onClick={() => setQuality(q => q === 'full' ? 'lite' : 'full')}
          title={`Quality: ${quality}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border transition-colors"
          style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid #e4e4e4', color: '#888' }}>
          {quality === 'full' ? '4K' : 'LT'}
        </button>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.88)', border: '1px solid #e4e4e4',
          borderRadius: 20, padding: '4px 16px', fontSize: 11, color: '#888',
          backdropFilter: 'blur(4px)', whiteSpace: 'nowrap',
        }}>
        Left-drag: rotate · Right-drag: pan · Scroll: zoom · Touch: pinch+pan
      </div>
    </div>
  )
}
