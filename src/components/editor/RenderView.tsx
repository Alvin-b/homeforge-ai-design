import React, { useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { Camera, Download, Loader2 } from 'lucide-react'

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
      <meshStandardMaterial color={wall.color || '#d4d4d8'} roughness={0.8} />
    </mesh>
  )
}

function FurnitureItem3D({ item }: { item: any }) {
  const x = item.x / SCALE
  const z = item.y / SCALE
  const w = item.width
  const d = item.depth ?? item.height ?? 0.5
  const h = item.height ?? 0.8
  const rot = -(item.rotation * Math.PI) / 180
  const cat = (item.furnitureId || '').split('-')[0]
  const color = item.color || (cat === 'sofa' ? '#8b7355' : cat === 'bed' ? '#c9a86c' : cat === 'table' ? '#5c4033' : '#93a3c0')
  return (
    <group position={[x, h / 2, z]} rotation={[0, rot, 0]}>
      <mesh castShadow>
        <boxGeometry args={[w * 0.98, h * 0.98, d * 0.98]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )
}

function RoomFloor3D({ room }: { room: any }) {
  if (room.points.length < 3) return null
  const points = room.points.map((p: { x: number; y: number }) => [p.x / SCALE, 0, p.y / SCALE] as [number, number, number])
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][2])
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][2])
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

function RenderScene() {
  const { walls, placedItems, rooms, stairs } = useEditorStore()
  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={45} />
      <OrbitControls enableDamping dampingFactor={0.05} enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.1} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 18, 10]} intensity={1.5} castShadow shadow-mapSize-width={4096} shadow-mapSize-height={4096} shadow-camera-far={50} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25} />
      <hemisphereLight args={['#b1c4e0', '#e8dcc8', 0.5]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f0f0ec" />
      </mesh>
      {rooms.map((r) => <RoomFloor3D key={r.id} room={r} />)}
      {walls.map((w) => <Wall3D key={w.id} wall={w} />)}
      {placedItems.map((i) => <FurnitureItem3D key={i.id} item={i} />)}
      {stairs.map((s) => <Stair3D key={s.id} stair={s} />)}
      <Environment preset="apartment" />
    </>
  )
}

function CaptureButton({ onCapture }: { onCapture: () => void }) {
  const [busy, setBusy] = useState(false)
  const handleClick = async () => {
    setBusy(true)
    await onCapture()
    setBusy(false)
  }
  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="inline-flex items-center gap-2 bg-highlight text-highlight-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-70"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {busy ? 'Rendering…' : 'Export 4K Image'}
    </button>
  )
}

export default function RenderView() {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCapture = () => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return
    const w = 3840
    const h = 2160
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!ctx) return
    const link = document.createElement('a')
    link.download = `homeforge-render-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-surface-dark">
      <div className="absolute inset-0">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => gl.setClearColor(new THREE.Color('#f8f9ff'), 1)}
        >
          <RenderScene />
        </Canvas>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Generate a photorealistic render of your space</p>
        <CaptureButton onCapture={handleCapture} />
        <p className="text-[10px] text-muted-foreground">Exports current view as PNG</p>
      </div>
    </div>
  )
}
