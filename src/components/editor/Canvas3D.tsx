import React, { Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, PerspectiveCamera, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { AlertTriangle, ExternalLink, Compass } from 'lucide-react'

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <WebGLFallback />
    return this.props.children
  }
}

function WebGLFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center max-w-sm px-6">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-display font-semibold text-foreground">3D View Unavailable</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          WebGL isn't available in this sandboxed preview. Click <strong>"Open in new tab"</strong> (top-right of the preview) to test the full 3D view in your browser.
        </p>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-accent">
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="font-medium">Open in new tab to use 3D</span>
        </div>
      </div>
    </div>
  )
}

const SCALE = 50

function Wall3D({ wall }: { wall: any }) {
  const dx = wall.x2 - wall.x1
  const dy = wall.y2 - wall.y1
  const length = Math.sqrt(dx * dx + dy * dy) / SCALE
  const angle = Math.atan2(dy, dx)
  const cx = (wall.x1 + wall.x2) / 2 / SCALE
  const cy = (wall.y1 + wall.y2) / 2 / SCALE
  const height = wall.height || 2.7
  const thickness = wall.thickness / SCALE

  return (
    <mesh position={[cx, height / 2, cy]} rotation={[0, -angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color="#d4d4d8" roughness={0.8} />
    </mesh>
  )
}

function FurnitureItem3D({ item }: { item: any }) {
  const x = item.x / SCALE
  const z = item.y / SCALE
  const w = item.width
  const d = item.depth ?? item.height ?? 0.5
  const h = (item.height ?? 0.8)
  const rot = -(item.rotation * Math.PI) / 180
  const cat = (item.furnitureId || '').split('-')[0]

  const color = item.color || (cat === 'sofa' ? '#8b7355' : cat === 'bed' ? '#c9a86c' : cat === 'table' ? '#5c4033' : cat === 'chair' ? '#6b5344' : '#93a3c0')

  return (
    <group position={[x, h / 2, z]} rotation={[0, rot, 0]}>
      <mesh castShadow>
        <boxGeometry args={[w * 0.98, h * 0.98, d * 0.98]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0ec" />
    </mesh>
  )
}

function CompassIndicator() {
  return (
    <Html position={[0, 0.1, 0]} center style={{ pointerEvents: 'none' }}>
      <div className="flex flex-col items-center opacity-40">
        <span className="text-[10px] font-bold text-red-500">N</span>
        <div className="w-px h-3 bg-red-400" />
      </div>
    </Html>
  )
}

function RoomFloor3D({ room }: { room: any }) {
  if (room.points.length < 3) return null
  const points = room.points.map((p: { x: number; y: number }) => [p.x / SCALE, 0, p.y / SCALE] as [number, number, number])
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][2])
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][2])
  }
  shape.closePath()
  const geom = new THREE.ShapeGeometry(shape)
  return (
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geom} attach="geometry" />
      <meshStandardMaterial color={room.floorColor || '#f3f4f6'} roughness={0.9} />
    </mesh>
  )
}

function Stair3D({ stair }: { stair: any }) {
  const x = stair.x / SCALE
  const z = stair.y / SCALE
  return (
    <mesh position={[x, 0.5, z]} rotation={[0, -(stair.direction * Math.PI) / 180, 0]} castShadow>
      <boxGeometry args={[stair.width, 0.3, stair.depth]} />
      <meshStandardMaterial color="#8b5cf6" roughness={0.6} />
    </mesh>
  )
}

function Scene() {
  const { walls, placedItems, rooms, stairs } = useEditorStore()

  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={50}
      />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#b1c4e0', '#e8dcc8', 0.4]} />

      <Ground />
      {rooms.map((room) => (
        <RoomFloor3D key={room.id} room={room} />
      ))}
      <CompassIndicator />

      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#d4d4d8"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#a1a1aa"
        fadeDistance={50}
        infiniteGrid
      />

      {walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} />
      ))}

      {placedItems.map((item) => (
        <FurnitureItem3D key={item.id} item={item} />
      ))}
      {stairs.map((s) => <Stair3D key={s.id} stair={s} />)}

      <Environment preset="apartment" />
    </>
  )
}

function CanvasLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Loading 3D…</p>
      </div>
    </div>
  )
}

export default function Canvas3DView() {
  return (
    <WebGLErrorBoundary>
      <div className="w-full h-full bg-muted relative">
        <Canvas
          shadows
          fallback={<CanvasLoading />}
          gl={{ failIfMajorPerformanceCaveat: false, antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#f8f9ff'), 1)
          }}
        >
          <Scene />
        </Canvas>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground">
          <Compass className="w-3 h-3" />
          <span>Orbit: drag · Zoom: scroll · Pan: right-drag</span>
        </div>
      </div>
    </WebGLErrorBoundary>
  )
}
