import React, { Component, useEffect, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Sky, ContactShadows, GizmoHelper, GizmoViewport } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { Sun, Grid3x3, Camera, AlertTriangle } from 'lucide-react'
import FurnitureItem3D from '@/components/editor/FurnitureModel3D'

class ErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.err ? null : this.props.children }
}

const SCALE = 50

function Wall3D({ wall }: { wall: any }) {
  const dx = wall.x2 - wall.x1, dy = wall.y2 - wall.y1
  const len = Math.sqrt(dx*dx + dy*dy) / SCALE
  const angle = Math.atan2(dy, dx)
  const cx = (wall.x1 + wall.x2) / 2 / SCALE
  const cz = (wall.y1 + wall.y2) / 2 / SCALE
  const wh = wall.height || 2.7
  const th = (wall.thickness || 15) / SCALE
  return (
    <mesh position={[cx, wh/2, cz]} rotation={[0, -angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[len, wh, th]} />
      <meshStandardMaterial color="#e8e6e1" roughness={0.85} />
    </mesh>
  )
}

function RoomFloor({ room }: { room: any }) {
  if (!room.points || room.points.length < 3) return null
  const shape = new THREE.Shape()
  shape.moveTo(room.points[0].x / SCALE, room.points[0].y / SCALE)
  room.points.slice(1).forEach((p: any) => shape.lineTo(p.x / SCALE, p.y / SCALE))
  shape.closePath()
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
      <primitive object={new THREE.ShapeGeometry(shape)} attach="geometry" />
      <meshStandardMaterial color={room.floorColor || '#f5f3ee'} roughness={0.9} />
    </mesh>
  )
}

function Scene({ quality, showGrid, showSky }: { quality: string; showGrid: boolean; showSky: boolean }) {
  const { walls, placedItems, rooms } = useEditorStore()
  const lite = quality === 'lite'
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 12, 14]} fov={50} />
      <OrbitControls enableDamping dampingFactor={0.06} maxPolarAngle={Math.PI * 0.85} minDistance={1} maxDistance={80} enablePan={true} panSpeed={0.8} />
      <ambientLight intensity={lite ? 0.8 : 0.45} />
      <directionalLight position={[12, 18, 8]} intensity={1.4} castShadow={!lite}
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-far={60} shadow-camera-left={-25} shadow-camera-right={25}
        shadow-camera-top={25} shadow-camera-bottom={-25} />
      <directionalLight position={[-8, 10, -5]} intensity={0.4} />
      <hemisphereLight args={['#c8d8f0', '#d8c8a8', 0.5]} />
      {showSky ? <Sky sunPosition={[100, 20, 100]} /> : <color attach="background" args={['#f0eee9']} />}
      {!lite && <Environment preset="apartment" />}
      {!lite && <ContactShadows position={[0,0,0]} opacity={0.3} scale={30} blur={1.5} far={8} />}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#eae8e3" roughness={0.95} />
      </mesh>
      {rooms.map((r: any) => <RoomFloor key={r.id} room={r} />)}
      {walls.map((w: any) => <Wall3D key={w.id} wall={w} />)}
      {placedItems.map((item: any) => <FurnitureItem3D key={item.id} item={item} />)}
      {/* Grid removed - uses inverse() not supported in WebGL1 */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport axisColors={['#e05555', '#50c878', '#5588e0']} labelColor="white" />
      </GizmoHelper>
    </>
  )
}

export default function Canvas3DView() {
  const [quality, setQuality] = useState('full')
  const [seed, setSeed] = useState(0)
  const [ready, setReady] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showSky, setShowSky] = useState(false)

  useEffect(() => { setReady(true) }, [])

  const onError = () => {
    setSeed(s => s + 1)
    setQuality(q => q === 'full' ? 'lite' : 'broken')
  }

  if (!ready) return (
    <div className="w-full h-full flex items-center justify-center bg-[#f0eee9]">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (quality === 'broken') return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center px-6">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-semibold mb-1">WebGL Unavailable</p>
        <p className="text-xs text-muted-foreground mb-4">Your browser or GPU doesn't support WebGL.</p>
        <button onClick={() => window.open(window.location.href, '_blank')}
          className="px-3 py-2 rounded-lg border border-border bg-card text-xs hover:bg-muted">
          Try in new tab
        </button>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full relative" style={{ background: '#f0eee9' }}>
      <ErrorBoundary key={`${quality}-${seed}`} onError={onError}>
        <Canvas shadows={quality !== 'lite'} dpr={[1, 1.5]}
          gl={{
          failIfMajorPerformanceCaveat: false,
          antialias: quality !== 'lite',
          powerPreference: 'low-power',
          alpha: false,
        }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#f0eee9'), 1)
            if (quality !== 'lite') {
              gl.shadowMap.enabled = true
              gl.shadowMap.type = THREE.PCFSoftShadowMap
            }
          }}>
          <Scene quality={quality} showGrid={showGrid} showSky={showSky} />
        </Canvas>
      </ErrorBoundary>

      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {[
          { icon: Grid3x3, active: showGrid, toggle: () => setShowGrid(g => !g), title: 'Grid' },
          { icon: Sun, active: showSky, toggle: () => setShowSky(s => !s), title: 'Sky' },
        ].map(({ icon: Icon, active, toggle, title }) => (
          <button key={title} onClick={toggle} title={title}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
              active ? 'bg-accent text-accent-foreground border-accent' : 'bg-card/80 backdrop-blur-sm border-border text-muted-foreground hover:bg-card'
            }`}>
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <button onClick={() => setQuality(q => q === 'full' ? 'lite' : 'full')} title="Toggle quality"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border text-muted-foreground hover:bg-card">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-4 py-1.5 text-[10px] text-muted-foreground pointer-events-none">
        Drag · Scroll to zoom · Right-drag to pan
      </div>
    </div>
  )
}
