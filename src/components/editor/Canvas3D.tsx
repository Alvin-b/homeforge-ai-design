import React, { useMemo, useState, useEffect, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { AlertTriangle } from 'lucide-react'

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
      <div className="text-center max-w-sm">
        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-display font-semibold text-foreground">3D View Unavailable</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Your browser or device doesn't support WebGL. Try using a modern browser with hardware acceleration enabled.
        </p>
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
    <mesh position={[cx, height / 2, cy]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color="#e5e7eb" />
    </mesh>
  )
}

function FurnitureItem3D({ item }: { item: any }) {
  const x = item.x / SCALE
  const z = item.y / SCALE
  const w = item.width
  const h = item.height * 0.6
  const d = (item.height || 0.5)

  return (
    <mesh position={[x, h / 2, z]} rotation={[0, -(item.rotation * Math.PI) / 180, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#a3bffa" />
    </mesh>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f5f5f0" />
    </mesh>
  )
}

function Scene() {
  const { walls, placedItems } = useEditorStore()

  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={50}
      />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Ground />
      
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

      <Environment preset="apartment" />
    </>
  )
}

export default function Canvas3DView() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebglSupported(!!gl)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (webglSupported === null) return null
  if (!webglSupported) return <WebGLFallback />

  return (
    <WebGLErrorBoundary>
      <div className="w-full h-full bg-muted">
        <Canvas shadows>
          <Scene />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  )
}
