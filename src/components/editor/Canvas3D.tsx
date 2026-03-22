import React, { Component, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, PerspectiveCamera, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { AlertTriangle, ExternalLink, Compass } from 'lucide-react'
import FurnitureItem3D from '@/components/editor/FurnitureModel3D'

type WebGLErrorBoundaryProps = {
  children: ReactNode
  onError: () => void
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function WebGLFallback({ liteModeAttempted = false }: { liteModeAttempted?: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center max-w-sm px-6">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-display font-semibold text-foreground">3D View Unavailable</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {liteModeAttempted
            ? 'WebGL failed even in low-power mode in this sandboxed preview.'
            : "WebGL isn't available in this sandboxed preview."}{' '}
          Click <strong>"Open in new tab"</strong> (top-right of the preview) to test the full 3D view in your browser.
        </p>
        <button
          onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-accent hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="font-medium">Open in new tab to use 3D</span>
        </button>
      </div>
    </div>
  )
}

const SCALE = 50
type RenderQuality = 'full' | 'lite' | 'unsupported'

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

// Removed old FurnitureItem3D — now imported from FurnitureModel3D

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

function Scene({ quality = 'full' }: { quality?: RenderQuality }) {
  const { walls, placedItems, rooms } = useEditorStore()
  const isLite = quality === 'lite'

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
        castShadow={!isLite}
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

      {!isLite && (
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
      )}

      {walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} />
      ))}

      {placedItems.map((item) => (
        <FurnitureItem3D key={item.id} item={item} />
      ))}

      {!isLite && <Environment preset="apartment" />}
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
  const [quality, setQuality] = useState<RenderQuality>('full')
  const [retrySeed, setRetrySeed] = useState(0)

  const supportsWebGL = useMemo(() => {
    if (typeof document === 'undefined') return true
    const probe = document.createElement('canvas')
    return Boolean(
      probe.getContext('webgl2') ||
      probe.getContext('webgl') ||
      probe.getContext('experimental-webgl')
    )
  }, [])

  useEffect(() => {
    if (!supportsWebGL) setQuality('unsupported')
  }, [supportsWebGL])

  const handleWebGLError = () => {
    setRetrySeed((prev) => prev + 1)
    setQuality((prev) => (prev === 'full' ? 'lite' : 'unsupported'))
  }

  if (quality === 'unsupported') {
    return <WebGLFallback liteModeAttempted />
  }

  const isLite = quality === 'lite'

  return (
    <div className="w-full h-full bg-muted relative">
      <WebGLErrorBoundary key={`webgl-${quality}-${retrySeed}`} onError={handleWebGLError}>
        <Canvas
          shadows={!isLite}
          dpr={isLite ? [1, 1.25] : [1, 2]}
          fallback={<CanvasLoading />}
          gl={{
            failIfMajorPerformanceCaveat: false,
            antialias: !isLite,
            alpha: false,
            stencil: false,
            depth: true,
            powerPreference: isLite ? 'low-power' : 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#f8f9ff'), 1)
          }}
        >
          <Scene quality={quality} />
        </Canvas>
      </WebGLErrorBoundary>

      {isLite && (
        <div className="absolute top-3 left-3 rounded-md border border-border bg-card/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
          Low-power 3D mode enabled
        </div>
      )}

      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground">
        <Compass className="w-3 h-3" />
        <span>Orbit: drag · Zoom: scroll · Pan: right-drag</span>
      </div>
    </div>
  )
}
