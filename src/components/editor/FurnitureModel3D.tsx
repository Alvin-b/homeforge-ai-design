import React, { Suspense, useRef, Component, type ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { PlacedItem } from '@/store/useEditorStore'

const SCALE = 50

// ── GLB loader ────────────────────────────────────────────────────
function GLBModel({ url, w, h, d }: { url: string; w: number; h: number; d: number }) {
  const { scene } = useGLTF(url)
  const clone = scene.clone()
  const box = new THREE.Box3().setFromObject(clone)
  const size = new THREE.Vector3()
  box.getSize(size)
  const s = Math.min(w / (size.x || 1), h / (size.y || 1), d / (size.z || 1))
  clone.scale.setScalar(s)
  const box2 = new THREE.Box3().setFromObject(clone)
  const center = new THREE.Vector3()
  box2.getCenter(center)
  clone.position.sub(center)
  clone.position.y += (box2.max.y - box2.min.y) / 2
  clone.traverse((c: any) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true } })
  return <primitive object={clone} />
}

class GLBBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

// ── Material helper ───────────────────────────────────────────────
function M({ color, roughness = 0.7, metalness = 0 }: { color: string; roughness?: number; metalness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
}

// ── HIGH QUALITY PROCEDURAL MODELS ───────────────────────────────

function Sofa({ w, h, d, color = '#c8b89a' }: { w: number; h: number; d: number; color?: string }) {
  const legH = h * 0.12, legR = 0.025
  const seatY = legH + h * 0.18
  const backH = h * 0.55
  return (
    <group>
      {/* Legs */}
      {[[-w*0.44,-d*0.38],[w*0.44,-d*0.38],[-w*0.44,d*0.38],[w*0.44,d*0.38]].map(([x,z],i) => (
        <mesh key={i} position={[x, legH/2, z]} castShadow>
          <cylinderGeometry args={[legR, legR*1.2, legH, 8]} />
          <M color="#3d2b1f" roughness={0.4} />
        </mesh>
      ))}
      {/* Seat cushion base */}
      <mesh position={[0, seatY, d*0.04]} castShadow receiveShadow>
        <boxGeometry args={[w*0.96, h*0.15, d*0.78]} />
        <M color={color} roughness={0.88} />
      </mesh>
      {/* Seat cushion top (slightly rounded look via scale) */}
      <mesh position={[0, seatY + h*0.09, d*0.04]} castShadow>
        <boxGeometry args={[w*0.94, h*0.08, d*0.76]} />
        <M color={color} roughness={0.92} />
      </mesh>
      {/* Individual seat cushion dividers */}
      <mesh position={[0, seatY + h*0.1, d*0.04]}>
        <boxGeometry args={[0.012, h*0.08, d*0.76]} />
        <M color={`${color}88`} roughness={0.95} />
      </mesh>
      {/* Back cushion */}
      <mesh position={[0, seatY + h*0.24, -d*0.34]} castShadow>
        <boxGeometry args={[w*0.92, backH*0.72, d*0.2]} />
        <M color={color} roughness={0.9} />
      </mesh>
      {/* Back frame */}
      <mesh position={[0, seatY + backH*0.4, -d*0.42]} castShadow>
        <boxGeometry args={[w*0.96, backH, d*0.08]} />
        <M color={color} roughness={0.85} />
      </mesh>
      {/* Armrests */}
      {[-1, 1].map((s, i) => (
        <group key={i} position={[s*(w/2 - w*0.045), 0, 0]}>
          <mesh position={[0, seatY + h*0.22, 0]} castShadow>
            <boxGeometry args={[w*0.09, h*0.3, d*0.88]} />
            <M color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0, seatY + h*0.38, 0]} castShadow>
            <boxGeometry args={[w*0.1, h*0.045, d*0.88]} />
            <M color={color} roughness={0.82} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bed({ w, h, d, color = '#8b6914' }: { w: number; h: number; d: number; color?: string }) {
  const frameH = h * 0.38
  const matH  = h * 0.16
  return (
    <group>
      {/* Bed frame */}
      <mesh position={[0, frameH/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.08, frameH, d + 0.06]} />
        <M color={color} roughness={0.5} metalness={0.02} />
      </mesh>
      {/* Slats */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, frameH - 0.02, -d*0.38 + (d*0.76/(4))*i]} castShadow>
          <boxGeometry args={[w - 0.06, 0.025, 0.06]} />
          <M color="#c8a87a" roughness={0.6} />
        </mesh>
      ))}
      {/* Mattress */}
      <mesh position={[0, frameH + matH/2, 0]} castShadow>
        <boxGeometry args={[w - 0.04, matH, d - 0.04]} />
        <M color="#f0ece4" roughness={0.95} />
      </mesh>
      {/* Mattress piping edge */}
      <mesh position={[0, frameH + matH, 0]}>
        <boxGeometry args={[w - 0.04, 0.012, d - 0.04]} />
        <M color="#ddd8ce" roughness={0.9} />
      </mesh>
      {/* Duvet / cover */}
      <mesh position={[0, frameH + matH + 0.04, d*0.08]} castShadow>
        <boxGeometry args={[w - 0.06, 0.06, d * 0.72]} />
        <M color="#e8e4de" roughness={0.95} />
      </mesh>
      {/* Pillows */}
      {[-(w*0.26), w*0.26].map((px, i) => (
        <mesh key={i} position={[px, frameH + matH + 0.06, -d*0.34]} castShadow>
          <boxGeometry args={[w*0.38, 0.1, 0.28]} />
          <M color="#faf8f4" roughness={0.95} />
        </mesh>
      ))}
      {/* Headboard */}
      <mesh position={[0, frameH + h*0.72, -d/2 - 0.04]} castShadow>
        <boxGeometry args={[w + 0.08, h*1.45, 0.07]} />
        <M color={color} roughness={0.48} />
      </mesh>
      {/* Headboard panel detail */}
      <mesh position={[0, frameH + h*0.72, -d/2 - 0.02]}>
        <boxGeometry args={[w*0.78, h*1.05, 0.025]} />
        <M color={`${color}cc`} roughness={0.55} />
      </mesh>
    </group>
  )
}

function DiningTable({ w, h, d, color = '#8b6334' }: { w: number; h: number; d: number; color?: string }) {
  const topT = 0.04
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, h - topT/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topT, d]} />
        <M color={color} roughness={0.45} metalness={0.02} />
      </mesh>
      {/* Apron front/back */}
      {[-d/2 + 0.03, d/2 - 0.03].map((z, i) => (
        <mesh key={i} position={[0, h - topT - 0.06, z]} castShadow>
          <boxGeometry args={[w - 0.12, 0.1, 0.025]} />
          <M color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Apron sides */}
      {[-w/2 + 0.03, w/2 - 0.03].map((x, i) => (
        <mesh key={i} position={[x, h - topT - 0.06, 0]} castShadow>
          <boxGeometry args={[0.025, 0.1, d - 0.12]} />
          <M color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Legs - tapered */}
      {[[-w*0.44,-d*0.4],[w*0.44,-d*0.4],[-w*0.44,d*0.4],[w*0.44,d*0.4]].map(([x,z],i) => (
        <mesh key={i} position={[x, (h-topT-0.1)/2, z]} castShadow>
          <cylinderGeometry args={[0.024, 0.032, h - topT - 0.1, 8]} />
          <M color={color} roughness={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Chair({ w, h, d, color = '#8b6334' }: { w: number; h: number; d: number; color?: string }) {
  const seatY = h * 0.47
  const legH  = seatY
  return (
    <group>
      {/* Front legs */}
      {[-w*0.36, w*0.36].map((x, i) => (
        <mesh key={i} position={[x, legH/2, d*0.32]} castShadow>
          <cylinderGeometry args={[0.016, 0.02, legH, 8]} />
          <M color={color} roughness={0.45} />
        </mesh>
      ))}
      {/* Back legs - taller for backrest */}
      {[-w*0.36, w*0.36].map((x, i) => (
        <mesh key={i} position={[x, (legH + h*0.5)/2, -d*0.32]} castShadow>
          <cylinderGeometry args={[0.016, 0.02, legH + h*0.5, 8]} />
          <M color={color} roughness={0.45} />
        </mesh>
      ))}
      {/* Seat */}
      <mesh position={[0, seatY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w*0.88, 0.036, d*0.84]} />
        <M color={color} roughness={0.5} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, seatY + 0.03, 0]} castShadow>
        <boxGeometry args={[w*0.84, 0.04, d*0.8]} />
        <M color="#c8b49a" roughness={0.9} />
      </mesh>
      {/* Back rail top */}
      <mesh position={[0, seatY + h*0.48, -d*0.32]} castShadow>
        <boxGeometry args={[w*0.84, 0.032, 0.028]} />
        <M color={color} roughness={0.45} />
      </mesh>
      {/* Back rail mid */}
      <mesh position={[0, seatY + h*0.26, -d*0.32]} castShadow>
        <boxGeometry args={[w*0.84, 0.022, 0.022]} />
        <M color={color} roughness={0.45} />
      </mesh>
      {/* Back splat */}
      <mesh position={[0, seatY + h*0.3, -d*0.32]} castShadow>
        <boxGeometry args={[w*0.32, h*0.44, 0.016]} />
        <M color={color} roughness={0.48} />
      </mesh>
      {/* Stretchers */}
      <mesh position={[0, legH*0.28, 0]} castShadow>
        <boxGeometry args={[w*0.72, 0.016, 0.014]} />
        <M color={color} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Wardrobe({ w, h, d, color = '#c8bca8' }: { w: number; h: number; d: number; color?: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <M color={color} roughness={0.55} />
      </mesh>
      {/* Door panels */}
      {[-w/4, w/4].map((x, i) => (
        <group key={i}>
          <mesh position={[x, h/2, d/2 + 0.002]}>
            <boxGeometry args={[w/2 - 0.018, h - 0.024, 0.006]} />
            <M color={`${color}ee`} roughness={0.5} />
          </mesh>
          {/* Door inset panel */}
          <mesh position={[x, h/2, d/2 + 0.006]}>
            <boxGeometry args={[w/2 - 0.08, h - 0.12, 0.004]} />
            <M color={`${color}cc`} roughness={0.52} />
          </mesh>
          {/* Handle */}
          <mesh position={[x + (i===0 ? w*0.18 : -w*0.18), h*0.5, d/2 + 0.018]} castShadow>
            <boxGeometry args={[0.012, 0.1, 0.016]} />
            <M color="#c0b090" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Center divider */}
      <mesh position={[0, h/2, d/2 + 0.001]}>
        <boxGeometry args={[0.014, h, 0.008]} />
        <M color="#8a7a6a" roughness={0.5} />
      </mesh>
      {/* Top/bottom trim */}
      {[h - 0.02, 0.02].map((y, i) => (
        <mesh key={i} position={[0, y, d/2 + 0.003]}>
          <boxGeometry args={[w + 0.01, 0.018, 0.01]} />
          <M color="#8a7a6a" roughness={0.45} />
        </mesh>
      ))}
      {/* Feet */}
      {[[-w*0.44, 0.04],[w*0.44, 0.04]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} castShadow>
          <boxGeometry args={[0.06, 0.08, d*0.7]} />
          <M color="#6a5a4a" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function Desk({ w, h, d, color = '#b8a888' }: { w: number; h: number; d: number; color?: string }) {
  return (
    <group>
      {/* Desktop */}
      <mesh position={[0, h - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.04, d]} />
        <M color={color} roughness={0.45} />
      </mesh>
      {/* Side panels */}
      {[-w/2 + 0.025, w/2 - 0.025].map((x, i) => (
        <mesh key={i} position={[x, (h-0.04)/2, 0]} castShadow>
          <boxGeometry args={[0.05, h - 0.04, d]} />
          <M color={color} roughness={0.48} />
        </mesh>
      ))}
      {/* Back panel */}
      <mesh position={[0, h*0.4, -d/2 + 0.02]} castShadow>
        <boxGeometry args={[w - 0.1, h*0.6, 0.018]} />
        <M color={color} roughness={0.5} />
      </mesh>
      {/* Drawer unit */}
      <mesh position={[w*0.28, h*0.28, 0]}>
        <boxGeometry args={[w*0.3, h*0.44, d*0.88]} />
        <M color={`${color}dd`} roughness={0.5} />
      </mesh>
      {[0.38, 0.22, 0.06].map((y, i) => (
        <mesh key={i} position={[w*0.28, h*y, d*0.44 + 0.012]}>
          <boxGeometry args={[w*0.26, 0.01, 0.008]} />
          <M color="#888" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function CoffeeTable({ w, h, d, color = '#8b6334' }: { w: number; h: number; d: number; color?: string }) {
  return (
    <group>
      <mesh position={[0, h - 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.05, d]} />
        <M color={color} roughness={0.42} />
      </mesh>
      {/* Lower shelf */}
      <mesh position={[0, h*0.28, 0]} castShadow>
        <boxGeometry args={[w*0.82, 0.028, d*0.82]} />
        <M color={color} roughness={0.5} />
      </mesh>
      {/* Legs - metal hairpin style */}
      {[[-w*0.42,-d*0.38],[w*0.42,-d*0.38],[-w*0.42,d*0.38],[w*0.42,d*0.38]].map(([x,z],i) => (
        <mesh key={i} position={[x, (h-0.05)/2, z]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, h - 0.05, 6]} />
          <M color="#4a4a4a" roughness={0.2} metalness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function Bookshelf({ w, h, d, color = '#a08060' }: { w: number; h: number; d: number; color?: string }) {
  const shelves = Math.max(3, Math.floor(h / 0.32))
  const pt = 0.022
  return (
    <group>
      {/* Side panels */}
      {[-w/2 + pt/2, w/2 - pt/2].map((x, i) => (
        <mesh key={i} position={[x, h/2, 0]} castShadow>
          <boxGeometry args={[pt, h, d]} />
          <M color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Back panel */}
      <mesh position={[0, h/2, -d/2 + 0.008]}>
        <boxGeometry args={[w - pt*2, h, 0.015]} />
        <M color={`${color}aa`} roughness={0.6} />
      </mesh>
      {/* Shelves */}
      {Array.from({ length: shelves + 1 }).map((_, i) => (
        <mesh key={i} position={[0, (i/shelves)*(h-pt) + pt/2, 0]} castShadow>
          <boxGeometry args={[w - pt*2, pt, d - 0.01]} />
          <M color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Decorative items on shelves */}
      {Array.from({ length: shelves - 1 }).map((_, i) => (
        <mesh key={i} position={[-w*0.2, ((i+1)/shelves)*(h-pt) + pt + 0.06, 0]} castShadow>
          <boxGeometry args={[w*0.08, 0.12, d*0.5]} />
          <M color={i%2===0 ? '#4a6a8a' : '#8a4a4a'} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Lamp({ w, h }: { w: number; h: number }) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.025, 0]} castShadow>
        <cylinderGeometry args={[w*0.35, w*0.4, 0.05, 16]} />
        <M color="#c8b878" roughness={0.25} metalness={0.7} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, h*0.44, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.018, h*0.82, 8]} />
        <M color="#c8b878" roughness={0.25} metalness={0.7} />
      </mesh>
      {/* Shade outer */}
      <mesh position={[0, h*0.88, 0]}>
        <cylinderGeometry args={[w*0.18, w*0.48, h*0.22, 16, 1, true]} />
        <meshStandardMaterial color="#f5e8d0" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Light source */}
      <pointLight position={[0, h*0.86, 0]} intensity={0.8} distance={6} color="#fff5e0" castShadow={false} />
    </group>
  )
}

function Plant({ w, h, d }: { w: number; h: number; d: number }) {
  return (
    <group>
      {/* Pot */}
      <mesh position={[0, h*0.12, 0]} castShadow>
        <cylinderGeometry args={[w*0.3, w*0.22, h*0.24, 12]} />
        <M color="#b05a30" roughness={0.75} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, h*0.245, 0]}>
        <cylinderGeometry args={[w*0.29, w*0.29, 0.015, 12]} />
        <M color="#3a2a18" roughness={0.95} />
      </mesh>
      {/* Main foliage */}
      <mesh position={[0, h*0.58, 0]}>
        <sphereGeometry args={[w*0.44, 12, 10]} />
        <M color="#2d6a22" roughness={0.88} />
      </mesh>
      {/* Secondary clusters */}
      {[[w*0.2, h*0.52, w*0.15],[- w*0.18, h*0.65, -w*0.1],[w*0.08, h*0.72, -w*0.18]].map(([x,y,z],i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[w*(0.24+i*0.04), 10, 8]} />
          <M color={i%2===0 ? '#3a7a2a' : '#256a1e'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function TVStand({ w, h, d, color = '#3a3028' }: { w: number; h: number; d: number; color?: string }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <M color={color} roughness={0.4} />
      </mesh>
      {/* Doors */}
      {[-w*0.27, w*0.27].map((x,i) => (
        <group key={i}>
          <mesh position={[x, h*0.38, d/2+0.003]}>
            <boxGeometry args={[w*0.38, h*0.62, 0.006]} />
            <M color={`${color}dd`} roughness={0.38} />
          </mesh>
          <mesh position={[x + (i===0?w*0.14:-w*0.14), h*0.38, d/2+0.016]}>
            <boxGeometry args={[0.01, 0.06, 0.012]} />
            <M color="#aaa" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Legs */}
      {[[-w*0.44,0],[w*0.44,0],[-w*0.44,0],[w*0.44,0]].map(([x],i) => (
        <mesh key={i} position={[x, -h*0.04, i<2?-d*0.38:d*0.38]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, h*0.08, 6]} />
          <M color="#1a1a1a" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Generic({ w, h, d, color = '#b8a888' }: { w: number; h: number; d: number; color?: string }) {
  return (
    <mesh position={[0, h/2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <M color={color} roughness={0.6} />
    </mesh>
  )
}

// ── Route to correct model ────────────────────────────────────────
function ProceduralModel({ category, furnitureId, w, h, d, color }: {
  category: string; furnitureId: string; w: number; h: number; d: number; color?: string
}) {
  const id = furnitureId.toLowerCase()
  if (id.includes('sofa') || category === 'sofa') return <Sofa w={w} h={h} d={d} color={color} />
  if (id.includes('bed') || category === 'bed') return <Bed w={w} h={h} d={d} color={color} />
  if (id.includes('wardrobe') || id.includes('closet')) return <Wardrobe w={w} h={h} d={d} color={color} />
  if (id.includes('desk') || category === 'desk') return <Desk w={w} h={h} d={d} color={color} />
  if (id.includes('bookshelf') || id.includes('shelf') || id.includes('bookcase')) return <Bookshelf w={w} h={h} d={d} color={color} />
  if (id.includes('coffee') || id.includes('ctable')) return <CoffeeTable w={w} h={h} d={d} color={color} />
  if (id.includes('dining') || id.includes('dtable') || category === 'table') return <DiningTable w={w} h={h} d={d} color={color} />
  if (id.includes('chair') || category === 'chair') return <Chair w={w} h={h} d={d} color={color} />
  if (id.includes('tvstand') || id.includes('tv-stand') || id.includes('media')) return <TVStand w={w} h={h} d={d} color={color} />
  if (id.includes('lamp') || id.includes('light') || category === 'light') return <Lamp w={w} h={h} />
  if (id.includes('plant') || id.includes('decor')) return <Plant w={w} h={h} d={d} />
  return <Generic w={w} h={h} d={d} color={color} />
}

function TryGLB({ glbUrl, w, h, d, color, category, furnitureId }: {
  glbUrl: string; w: number; h: number; d: number
  color?: string; category: string; furnitureId: string
}) {
  const fallback = <ProceduralModel category={category} furnitureId={furnitureId} w={w} h={h} d={d} color={color} />
  return (
    <GLBBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLBModel url={glbUrl} w={w} h={h} d={d} />
      </Suspense>
    </GLBBoundary>
  )
}

// ── Main export ───────────────────────────────────────────────────
export default function FurnitureItem3D({ item }: { item: PlacedItem }) {
  const x   = item.x / SCALE
  const z   = item.y / SCALE
  const rot = -(item.rotation * Math.PI) / 180
  const cat = (item.furnitureId || '').split('-')[0]
  const glbUrl = `/models/furniture/${item.furnitureId}.glb`
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <TryGLB
        glbUrl={glbUrl}
        category={cat}
        furnitureId={item.furnitureId}
        w={item.width}
        h={item.height}
        d={item.depth}
        color={item.color}
      />
    </group>
  )
}
