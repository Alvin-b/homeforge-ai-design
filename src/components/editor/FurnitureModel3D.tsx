import React, { Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { FURNITURE_ITEMS } from '@/types/furniture'
import type { PlacedItem } from '@/store/useEditorStore'

const SCALE = 50

/** Try to load .glb model; fall back to procedural box */
function GLBModel({ url, targetWidth, targetHeight, targetDepth, color }: {
  url: string
  targetWidth: number
  targetHeight: number
  targetDepth: number
  color?: string
}) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    // compute bounding box to normalize scale
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const sx = targetWidth / Math.max(size.x, 0.01)
    const sy = targetHeight / Math.max(size.y, 0.01)
    const sz = targetDepth / Math.max(size.z, 0.01)
    const s = Math.min(sx, sy, sz)
    c.scale.setScalar(s)
    // center on origin
    const newBox = new THREE.Box3().setFromObject(c)
    const center = newBox.getCenter(new THREE.Vector3())
    c.position.sub(center)
    c.position.y += newBox.getSize(new THREE.Vector3()).y / 2
    if (color) {
      c.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.6,
          })
        }
      })
    }
    return c
  }, [scene, targetWidth, targetHeight, targetDepth, color])

  return <primitive object={cloned} />
}

/** Procedural fallback — shaped boxes per category */
function ProceduralFurniture({ item, w, h, d }: {
  item: PlacedItem; w: number; h: number; d: number
}) {
  const cat = (item.furnitureId || '').split('-')[0]
  const color = item.color || getCategoryColor(cat)

  if (cat === 'sofa' || cat === 'chair') {
    return (
      <group>
        {/* Seat */}
        <mesh position={[0, h * 0.25, 0]} castShadow>
          <boxGeometry args={[w, h * 0.3, d]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, h * 0.55, -d * 0.4]} castShadow>
          <boxGeometry args={[w, h * 0.5, d * 0.15]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Legs */}
        {[[-w * 0.4, 0.05, -d * 0.35], [w * 0.4, 0.05, -d * 0.35],
          [-w * 0.4, 0.05, d * 0.35], [w * 0.4, 0.05, d * 0.35]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#333" roughness={0.8} />
          </mesh>
        ))}
      </group>
    )
  }

  if (cat === 'bed') {
    return (
      <group>
        {/* Mattress */}
        <mesh position={[0, h * 0.6, 0]} castShadow>
          <boxGeometry args={[w, h * 0.25, d]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.9} />
        </mesh>
        {/* Frame */}
        <mesh position={[0, h * 0.25, 0]} castShadow>
          <boxGeometry args={[w * 1.05, h * 0.3, d * 1.02]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
        {/* Headboard */}
        <mesh position={[0, h * 0.8, -d * 0.48]} castShadow>
          <boxGeometry args={[w, h * 0.6, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>
    )
  }

  if (cat === 'table' || cat === 'desk') {
    return (
      <group>
        {/* Tabletop */}
        <mesh position={[0, h - 0.02, 0]} castShadow>
          <boxGeometry args={[w, 0.04, d]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        {/* Legs */}
        {[[-w * 0.42, h / 2 - 0.02, -d * 0.42], [w * 0.42, h / 2 - 0.02, -d * 0.42],
          [-w * 0.42, h / 2 - 0.02, d * 0.42], [w * 0.42, h / 2 - 0.02, d * 0.42]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.04, h - 0.04, 0.04]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        ))}
      </group>
    )
  }

  if (cat === 'storage') {
    const shelves = Math.max(2, Math.floor(h / 0.4))
    return (
      <group>
        {/* Outer frame */}
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} roughness={0.6} transparent opacity={0.95} />
        </mesh>
        {/* Shelves */}
        {Array.from({ length: shelves }).map((_, i) => (
          <mesh key={i} position={[0, (i + 1) * (h / (shelves + 1)), 0]} castShadow>
            <boxGeometry args={[w * 0.92, 0.02, d * 0.92]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        ))}
      </group>
    )
  }

  if (cat === 'light') {
    return (
      <group>
        {/* Pole */}
        <mesh position={[0, h * 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, h * 0.8, 8]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Shade */}
        <mesh position={[0, h * 0.85, 0]}>
          <coneGeometry args={[0.15, 0.2, 12]} />
          <meshStandardMaterial color="#f5e6d3" roughness={0.9} transparent opacity={0.85} />
        </mesh>
        {/* Base */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Light glow */}
        <pointLight position={[0, h * 0.8, 0]} intensity={0.3} distance={3} color="#fff5e6" />
      </group>
    )
  }

  if (cat === 'bath') {
    return (
      <group>
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
    )
  }

  if (cat === 'kitchen') {
    return (
      <group>
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, h * 0.5, d * 0.52]} castShadow>
          <boxGeometry args={[w * 0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    )
  }

  if (cat === 'decor') {
    if (item.furnitureId.includes('plant') || item.furnitureId === 'decor-1') {
      return (
        <group>
          {/* Pot */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.24, 12]} />
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </mesh>
          {/* Plant */}
          <mesh position={[0, h * 0.5, 0]}>
            <sphereGeometry args={[w * 0.6, 8, 8]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
          </mesh>
        </group>
      )
    }
    // Rug
    return (
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
    )
  }

  // Generic fallback
  return (
    <mesh position={[0, h / 2, 0]} castShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

function getCategoryColor(cat: string): string {
  switch (cat) {
    case 'sofa': return '#8b7355'
    case 'bed': return '#c9a86c'
    case 'table': case 'desk': return '#5c4033'
    case 'chair': return '#6b5344'
    case 'storage': return '#a0845c'
    case 'kitchen': return '#d0d0d0'
    case 'bath': return '#ffffff'
    case 'decor': return '#7c9a5e'
    case 'light': return '#e8d8c4'
    default: return '#93a3c0'
  }
}

/** Main 3D furniture component — tries .glb, falls back to procedural */
export default function FurnitureItem3D({ item }: { item: PlacedItem }) {
  const x = item.x / SCALE
  const z = item.y / SCALE
  const rot = -(item.rotation * Math.PI) / 180

  // Find furniture definition
  const def = FURNITURE_ITEMS.find(f => f.id === item.furnitureId)
  const w = item.width
  const h = item.height
  const d = item.depth

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {def?.modelUrl ? (
        <Suspense fallback={
          <ProceduralFurniture item={item} w={w} h={h} d={d} />
        }>
          <GLBModel
            url={def.modelUrl}
            targetWidth={w}
            targetHeight={h}
            targetDepth={d}
            color={item.color}
          />
        </Suspense>
      ) : (
        <ProceduralFurniture item={item} w={w} h={h} d={d} />
      )}
    </group>
  )
}
