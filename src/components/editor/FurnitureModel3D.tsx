import React from 'react'
import * as THREE from 'three'
import type { PlacedItem } from '@/store/useEditorStore'

const SCALE = 50

// ─── Realistic Materials ────────────────────────────────────────────
const materials = {
  darkWood: { color: '#3d2b1f', roughness: 0.45, metalness: 0.05 },
  medWood: { color: '#6b4226', roughness: 0.5, metalness: 0.05 },
  lightWood: { color: '#c19a6b', roughness: 0.55, metalness: 0.03 },
  oak: { color: '#b08d57', roughness: 0.5, metalness: 0.04 },
  walnut: { color: '#5c3317', roughness: 0.4, metalness: 0.05 },
  fabric: { color: '#8b8589', roughness: 0.92, metalness: 0 },
  fabricDark: { color: '#4a4a4a', roughness: 0.9, metalness: 0 },
  fabricBeige: { color: '#c2b280', roughness: 0.9, metalness: 0 },
  leather: { color: '#654321', roughness: 0.6, metalness: 0.05 },
  leatherDark: { color: '#2c1b0e', roughness: 0.55, metalness: 0.08 },
  mattress: { color: '#f5f0e8', roughness: 0.95, metalness: 0 },
  pillow: { color: '#e8e4de', roughness: 0.95, metalness: 0 },
  chrome: { color: '#c0c0c0', roughness: 0.15, metalness: 0.9 },
  brushedMetal: { color: '#a8a8a8', roughness: 0.3, metalness: 0.85 },
  blackMetal: { color: '#1a1a1a', roughness: 0.25, metalness: 0.8 },
  stainless: { color: '#d4d4d4', roughness: 0.2, metalness: 0.9 },
  glass: { color: '#e8f4f8', roughness: 0.05, metalness: 0.1 },
  ceramic: { color: '#faf8f5', roughness: 0.3, metalness: 0.05 },
  marble: { color: '#f0ece3', roughness: 0.25, metalness: 0.08 },
  concrete: { color: '#b0b0b0', roughness: 0.85, metalness: 0 },
  greenery: { color: '#2d5a27', roughness: 0.85, metalness: 0 },
  terracotta: { color: '#c04000', roughness: 0.75, metalness: 0 },
  lampShade: { color: '#f5e6d3', roughness: 0.9, metalness: 0 },
  brass: { color: '#b5a642', roughness: 0.3, metalness: 0.85 },
}

function M(mat: { color: string; roughness: number; metalness: number }, overrideColor?: string) {
  return (
    <meshStandardMaterial
      color={overrideColor || mat.color}
      roughness={mat.roughness}
      metalness={mat.metalness}
    />
  )
}

function MTransparent(mat: { color: string; roughness: number; metalness: number }, opacity: number) {
  return (
    <meshStandardMaterial
      color={mat.color}
      roughness={mat.roughness}
      metalness={mat.metalness}
      transparent
      opacity={opacity}
    />
  )
}

// ─── Sofa ───────────────────────────────────────────────────────────
function Sofa3D({ w, h, d, color }: { w: number; h: number; d: number; color?: string }) {
  const seatH = h * 0.38
  const seatY = h * 0.28
  const backH = h * 0.55
  const backT = d * 0.18
  const armW = w * 0.08
  const armH = h * 0.5
  const legH = h * 0.1
  const legR = 0.025
  const fabricCol = color || materials.fabricBeige.color

  return (
    <group>
      {/* Seat cushion */}
      <mesh position={[0, seatY, d * 0.05]} castShadow>
        <boxGeometry args={[w * 0.88, seatH, d * 0.75]} />
        {M(materials.fabricBeige, fabricCol)}
      </mesh>
      {/* Seat cushion line details — two cushions */}
      <mesh position={[0, seatY + seatH / 2 + 0.005, d * 0.05]} castShadow>
        <boxGeometry args={[w * 0.01, 0.01, d * 0.7]} />
        {M(materials.fabricDark)}
      </mesh>

      {/* Backrest */}
      <mesh position={[0, seatY + seatH / 2 + backH / 2, -d * 0.38]} castShadow>
        <boxGeometry args={[w * 0.88, backH, backT]} />
        {M(materials.fabricBeige, fabricCol)}
      </mesh>
      {/* Back cushions — two pillows */}
      {[-w * 0.22, w * 0.22].map((px, i) => (
        <mesh key={i} position={[px, seatY + seatH / 2 + backH * 0.4, -d * 0.26]} castShadow>
          <boxGeometry args={[w * 0.38, backH * 0.65, backT * 0.6]} />
          {M(materials.fabricBeige, fabricCol)}
        </mesh>
      ))}

      {/* Left arm */}
      <mesh position={[-w / 2 + armW / 2, seatY + armH / 2, 0]} castShadow>
        <boxGeometry args={[armW, armH, d * 0.92]} />
        {M(materials.fabricBeige, fabricCol)}
      </mesh>
      {/* Right arm */}
      <mesh position={[w / 2 - armW / 2, seatY + armH / 2, 0]} castShadow>
        <boxGeometry args={[armW, armH, d * 0.92]} />
        {M(materials.fabricBeige, fabricCol)}
      </mesh>

      {/* Base frame */}
      <mesh position={[0, legH + 0.02, 0]} castShadow>
        <boxGeometry args={[w, 0.04, d]} />
        {M(materials.darkWood)}
      </mesh>

      {/* Legs — tapered wood */}
      {[
        [-w * 0.42, 0, -d * 0.4],
        [w * 0.42, 0, -d * 0.4],
        [-w * 0.42, 0, d * 0.4],
        [w * 0.42, 0, d * 0.4],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], legH / 2, pos[2]]} castShadow>
          <cylinderGeometry args={[legR, legR * 1.3, legH, 8]} />
          {M(materials.walnut)}
        </mesh>
      ))}
    </group>
  )
}

// ─── Chair ──────────────────────────────────────────────────────────
function Chair3D({ w, h, d, color }: { w: number; h: number; d: number; color?: string }) {
  const seatH = 0.04
  const seatY = h * 0.48
  const legH = seatY - seatH / 2
  const legR = 0.02
  const backH = h * 0.45
  const col = color || materials.oak.color

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, seatY, 0]} castShadow>
        <boxGeometry args={[w * 0.9, seatH, d * 0.85]} />
        {M(materials.oak, col)}
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, seatY + seatH / 2 + 0.015, 0]} castShadow>
        <boxGeometry args={[w * 0.82, 0.03, d * 0.78]} />
        {M(materials.fabric)}
      </mesh>

      {/* Back frame */}
      <mesh position={[0, seatY + backH / 2 + seatH / 2, -d * 0.4]} castShadow>
        <boxGeometry args={[w * 0.85, backH, 0.025]} />
        {M(materials.oak, col)}
      </mesh>
      {/* Back slats */}
      {[-w * 0.25, 0, w * 0.25].map((px, i) => (
        <mesh key={i} position={[px, seatY + backH * 0.3, -d * 0.38]} castShadow>
          <boxGeometry args={[w * 0.06, backH * 0.5, 0.015]} />
          {M(materials.oak, col)}
        </mesh>
      ))}

      {/* 4 legs — tapered */}
      {[
        [-w * 0.38, 0, -d * 0.35],
        [w * 0.38, 0, -d * 0.35],
        [-w * 0.38, 0, d * 0.35],
        [w * 0.38, 0, d * 0.35],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], legH / 2, pos[2]]} castShadow>
          <cylinderGeometry args={[legR * 0.7, legR, legH, 8]} />
          {M(materials.oak, col)}
        </mesh>
      ))}
    </group>
  )
}

// ─── Bed ────────────────────────────────────────────────────────────
function Bed3D({ w, h, d, color }: { w: number; h: number; d: number; color?: string }) {
  const frameH = h * 0.35
  const mattH = h * 0.3
  const headH = h * 1.4
  const headT = 0.06
  const legH = h * 0.15
  const frameCol = color || materials.walnut.color

  return (
    <group>
      {/* Bed frame */}
      <mesh position={[0, legH + frameH / 2, 0]} castShadow>
        <boxGeometry args={[w + 0.06, frameH, d + 0.04]} />
        {M(materials.walnut, frameCol)}
      </mesh>

      {/* Mattress */}
      <mesh position={[0, legH + frameH + mattH / 2, 0]} castShadow>
        <boxGeometry args={[w - 0.04, mattH, d - 0.04]} />
        {M(materials.mattress)}
      </mesh>

      {/* Sheet/cover on bottom 2/3 of mattress */}
      <mesh position={[0, legH + frameH + mattH + 0.01, d * 0.12]} castShadow>
        <boxGeometry args={[w - 0.06, 0.02, d * 0.65]} />
        {M(materials.fabric)}
      </mesh>

      {/* Pillows */}
      {[-(w * 0.28), w * 0.28].map((px, i) => (
        <mesh key={i} position={[px, legH + frameH + mattH + 0.04, -d * 0.35]} castShadow>
          <boxGeometry args={[w * 0.35, 0.08, 0.3]} />
          {M(materials.pillow)}
        </mesh>
      ))}

      {/* Headboard */}
      <mesh position={[0, legH + headH / 2, -d / 2 - headT / 2]} castShadow>
        <boxGeometry args={[w + 0.06, headH, headT]} />
        {M(materials.walnut, frameCol)}
      </mesh>
      {/* Headboard panel inset */}
      <mesh position={[0, legH + headH * 0.5, -d / 2 - headT / 2 + 0.005]} castShadow>
        <boxGeometry args={[w - 0.1, headH * 0.7, 0.02]} />
        {M(materials.medWood, frameCol)}
      </mesh>

      {/* Legs */}
      {[
        [-w * 0.45, 0, -d * 0.45],
        [w * 0.45, 0, -d * 0.45],
        [-w * 0.45, 0, d * 0.45],
        [w * 0.45, 0, d * 0.45],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], legH / 2, pos[2]]} castShadow>
          <boxGeometry args={[0.06, legH, 0.06]} />
          {M(materials.walnut, frameCol)}
        </mesh>
      ))}
    </group>
  )
}

// ─── Table / Desk ───────────────────────────────────────────────────
function Table3D({ w, h, d, color }: { w: number; h: number; d: number; color?: string }) {
  const topH = 0.04
  const topY = h - topH / 2
  const legH = h - topH
  const legW = 0.045
  const col = color || materials.oak.color

  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, topY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topH, d]} />
        {M(materials.oak, col)}
      </mesh>
      {/* Tabletop edge bevel */}
      <mesh position={[0, topY - topH / 2 - 0.005, 0]} castShadow>
        <boxGeometry args={[w - 0.02, 0.01, d - 0.02]} />
        {M(materials.medWood, col)}
      </mesh>

      {/* Apron — front/back */}
      {[-d * 0.42, d * 0.42].map((pz, i) => (
        <mesh key={`fb${i}`} position={[0, topY - topH / 2 - 0.04, pz]} castShadow>
          <boxGeometry args={[w * 0.85, 0.06, 0.02]} />
          {M(materials.oak, col)}
        </mesh>
      ))}
      {/* Apron — sides */}
      {[-w * 0.45, w * 0.45].map((px, i) => (
        <mesh key={`lr${i}`} position={[px, topY - topH / 2 - 0.04, 0]} castShadow>
          <boxGeometry args={[0.02, 0.06, d * 0.75]} />
          {M(materials.oak, col)}
        </mesh>
      ))}

      {/* 4 legs — tapered */}
      {[
        [-w * 0.44, 0, -d * 0.42],
        [w * 0.44, 0, -d * 0.42],
        [-w * 0.44, 0, d * 0.42],
        [w * 0.44, 0, d * 0.42],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], legH / 2, pos[2]]} castShadow>
          <boxGeometry args={[legW, legH, legW]} />
          {M(materials.oak, col)}
        </mesh>
      ))}
    </group>
  )
}

// ─── Storage (Bookshelf / Wardrobe) ─────────────────────────────────
function Storage3D({ w, h, d, color, furnitureId }: { w: number; h: number; d: number; color?: string; furnitureId: string }) {
  const isWardrobe = furnitureId.includes('wardrobe') || furnitureId === 'storage-2'
  const col = color || materials.walnut.color
  const panelT = 0.025

  if (isWardrobe) {
    return (
      <group>
        {/* Main body */}
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          {M(materials.walnut, col)}
        </mesh>
        {/* Door split line */}
        <mesh position={[0, h / 2, d / 2 + 0.001]} castShadow>
          <boxGeometry args={[0.01, h * 0.92, 0.002]} />
          {M(materials.darkWood)}
        </mesh>
        {/* Handles */}
        {[-0.04, 0.04].map((px, i) => (
          <mesh key={i} position={[px, h * 0.5, d / 2 + 0.015]} castShadow>
            <boxGeometry args={[0.01, 0.1, 0.015]} />
            {M(materials.chrome)}
          </mesh>
        ))}
        {/* Crown molding */}
        <mesh position={[0, h + 0.01, 0]} castShadow>
          <boxGeometry args={[w + 0.03, 0.025, d + 0.02]} />
          {M(materials.walnut, col)}
        </mesh>
        {/* Base */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <boxGeometry args={[w - 0.02, 0.06, d - 0.02]} />
          {M(materials.darkWood)}
        </mesh>
      </group>
    )
  }

  // Bookshelf
  const shelves = Math.max(3, Math.floor(h / 0.35))
  return (
    <group>
      {/* Left panel */}
      <mesh position={[-w / 2 + panelT / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[panelT, h, d]} />
        {M(materials.walnut, col)}
      </mesh>
      {/* Right panel */}
      <mesh position={[w / 2 - panelT / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[panelT, h, d]} />
        {M(materials.walnut, col)}
      </mesh>
      {/* Back panel */}
      <mesh position={[0, h / 2, -d / 2 + 0.008]} castShadow>
        <boxGeometry args={[w - panelT * 2, h, 0.015]} />
        {M(materials.medWood, col)}
      </mesh>
      {/* Shelves */}
      {Array.from({ length: shelves + 1 }).map((_, i) => {
        const y = (i / shelves) * (h - panelT) + panelT / 2
        return (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[w - panelT * 2, panelT, d - 0.01]} />
            {M(materials.walnut, col)}
          </mesh>
        )
      })}
      {/* Top cap */}
      <mesh position={[0, h + 0.008, 0]} castShadow>
        <boxGeometry args={[w + 0.015, 0.015, d + 0.01]} />
        {M(materials.walnut, col)}
      </mesh>
    </group>
  )
}

// ─── Kitchen ────────────────────────────────────────────────────────
function Kitchen3D({ w, h, d, color, furnitureId }: { w: number; h: number; d: number; color?: string; furnitureId: string }) {
  const isFridge = furnitureId.includes('fridge') || furnitureId === 'kitchen-2'
  const col = color || materials.stainless.color

  if (isFridge) {
    return (
      <group>
        {/* Main body */}
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          {M(materials.stainless, col)}
        </mesh>
        {/* Top door */}
        <mesh position={[0, h * 0.72, d / 2 + 0.003]}>
          <boxGeometry args={[w - 0.04, h * 0.42, 0.005]} />
          {M(materials.stainless, col)}
        </mesh>
        {/* Bottom door */}
        <mesh position={[0, h * 0.28, d / 2 + 0.003]}>
          <boxGeometry args={[w - 0.04, h * 0.42, 0.005]} />
          {M(materials.stainless, col)}
        </mesh>
        {/* Handle top */}
        <mesh position={[w * 0.35, h * 0.65, d / 2 + 0.02]} castShadow>
          <boxGeometry args={[0.02, 0.2, 0.025]} />
          {M(materials.chrome)}
        </mesh>
        {/* Handle bottom */}
        <mesh position={[w * 0.35, h * 0.35, d / 2 + 0.02]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.025]} />
          {M(materials.chrome)}
        </mesh>
        {/* Gap line */}
        <mesh position={[0, h * 0.5, d / 2 + 0.006]}>
          <boxGeometry args={[w - 0.03, 0.01, 0.001]} />
          {M(materials.blackMetal)}
        </mesh>
      </group>
    )
  }

  // Kitchen island/cabinet
  return (
    <group>
      {/* Body */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        {M(materials.ceramic, col)}
      </mesh>
      {/* Countertop */}
      <mesh position={[0, h + 0.015, 0]} castShadow>
        <boxGeometry args={[w + 0.03, 0.03, d + 0.02]} />
        {M(materials.marble)}
      </mesh>
      {/* Drawer lines */}
      {[0.3, 0.55, 0.8].map((ratio, i) => (
        <mesh key={i} position={[0, h * ratio, d / 2 + 0.002]}>
          <boxGeometry args={[w * 0.9, 0.008, 0.002]} />
          {M(materials.blackMetal)}
        </mesh>
      ))}
      {/* Handles */}
      {[0.42, 0.67].map((ratio, i) => (
        <mesh key={i} position={[0, h * ratio, d / 2 + 0.015]} castShadow>
          <boxGeometry args={[w * 0.2, 0.015, 0.015]} />
          {M(materials.chrome)}
        </mesh>
      ))}
    </group>
  )
}

// ─── Bathroom ───────────────────────────────────────────────────────
function Bath3D({ w, h, d, furnitureId }: { w: number; h: number; d: number; furnitureId: string }) {
  const isToilet = furnitureId.includes('toilet')

  if (isToilet) {
    return (
      <group>
        {/* Base/bowl */}
        <mesh position={[0, h * 0.25, d * 0.05]} castShadow>
          <cylinderGeometry args={[w * 0.4, w * 0.35, h * 0.5, 16]} />
          {M(materials.ceramic)}
        </mesh>
        {/* Tank */}
        <mesh position={[0, h * 0.5, -d * 0.32]} castShadow>
          <boxGeometry args={[w * 0.7, h * 0.55, d * 0.25]} />
          {M(materials.ceramic)}
        </mesh>
        {/* Seat */}
        <mesh position={[0, h * 0.5, d * 0.05]} castShadow>
          <cylinderGeometry args={[w * 0.38, w * 0.38, 0.03, 16]} />
          {M(materials.ceramic)}
        </mesh>
        {/* Lid */}
        <mesh position={[0, h * 0.52, d * 0.05]} castShadow>
          <cylinderGeometry args={[w * 0.36, w * 0.36, 0.02, 16]} />
          {M(materials.ceramic)}
        </mesh>
        {/* Flush button */}
        <mesh position={[0, h * 0.8, -d * 0.32]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.015, 12]} />
          {M(materials.chrome)}
        </mesh>
      </group>
    )
  }

  // Bathtub
  return (
    <group>
      {/* Outer shell */}
      <mesh position={[0, h * 0.4, 0]} castShadow>
        <boxGeometry args={[w, h * 0.8, d]} />
        {M(materials.ceramic)}
      </mesh>
      {/* Inner cavity (darker to simulate depth) */}
      <mesh position={[0, h * 0.5, 0]}>
        <boxGeometry args={[w - 0.08, h * 0.5, d - 0.08]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, h * 0.8, 0]} castShadow>
        <boxGeometry args={[w + 0.02, 0.04, d + 0.02]} />
        {M(materials.ceramic)}
      </mesh>
      {/* Faucet */}
      <mesh position={[0, h * 0.9, -d * 0.4]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, h * 0.2, 8]} />
        {M(materials.chrome)}
      </mesh>
      <mesh position={[0, h, -d * 0.35]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} rotation={[Math.PI / 2, 0, 0]} />
        {M(materials.chrome)}
      </mesh>
    </group>
  )
}

// ─── Decor ──────────────────────────────────────────────────────────
function Decor3D({ w, h, d, furnitureId, color }: { w: number; h: number; d: number; furnitureId: string; color?: string }) {
  const isPlant = furnitureId.includes('plant') || furnitureId === 'decor-1'

  if (isPlant) {
    return (
      <group>
        {/* Pot */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[w * 0.32, w * 0.25, 0.2, 12]} />
          {M(materials.terracotta)}
        </mesh>
        {/* Pot rim */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[w * 0.34, w * 0.32, 0.03, 12]} />
          {M(materials.terracotta)}
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[w * 0.28, w * 0.28, 0.02, 12]} />
          <meshStandardMaterial color="#3d2b1f" roughness={0.95} metalness={0} />
        </mesh>
        {/* Main foliage — layered spheres */}
        <mesh position={[0, h * 0.55, 0]}>
          <sphereGeometry args={[w * 0.45, 12, 10]} />
          {M(materials.greenery)}
        </mesh>
        <mesh position={[w * 0.08, h * 0.65, w * 0.05]}>
          <sphereGeometry args={[w * 0.35, 10, 8]} />
          <meshStandardMaterial color="#3a7a33" roughness={0.85} metalness={0} />
        </mesh>
        <mesh position={[-w * 0.06, h * 0.48, -w * 0.04]}>
          <sphereGeometry args={[w * 0.3, 10, 8]} />
          <meshStandardMaterial color="#245a1e" roughness={0.88} metalness={0} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, h * 0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.02, h * 0.3, 6]} />
          <meshStandardMaterial color="#4a3520" roughness={0.8} metalness={0} />
        </mesh>
      </group>
    )
  }

  // Rug
  return (
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color || '#8b7355'} roughness={0.95} metalness={0} />
    </mesh>
  )
}

// ─── Lighting ───────────────────────────────────────────────────────
function Light3D({ w, h, d }: { w: number; h: number; d: number }) {
  const isFloor = h > 1
  
  if (isFloor) {
    return (
      <group>
        {/* Base */}
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[w * 0.5, w * 0.55, 0.03, 16]} />
          {M(materials.brass)}
        </mesh>
        {/* Pole */}
        <mesh position={[0, h * 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.018, h * 0.8, 8]} />
          {M(materials.brass)}
        </mesh>
        {/* Shade - truncated cone */}
        <mesh position={[0, h * 0.88, 0]}>
          <cylinderGeometry args={[w * 0.15, w * 0.5, h * 0.2, 16, 1, true]} />
          {M(materials.lampShade)}
        </mesh>
        {/* Shade top cap */}
        <mesh position={[0, h * 0.98, 0]}>
          <cylinderGeometry args={[w * 0.15, w * 0.15, 0.01, 16]} />
          {M(materials.lampShade)}
        </mesh>
        {/* Light glow */}
        <pointLight position={[0, h * 0.85, 0]} intensity={0.5} distance={4} color="#fff5e0" />
      </group>
    )
  }

  // Table lamp
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[w * 0.35, w * 0.4, 0.04, 12]} />
        {M(materials.brass)}
      </mesh>
      {/* Stem */}
      <mesh position={[0, h * 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.015, h * 0.5, 8]} />
        {M(materials.brass)}
      </mesh>
      {/* Shade */}
      <mesh position={[0, h * 0.75, 0]}>
        <cylinderGeometry args={[w * 0.2, w * 0.55, h * 0.4, 16, 1, true]} />
        {M(materials.lampShade)}
      </mesh>
      <pointLight position={[0, h * 0.7, 0]} intensity={0.3} distance={2.5} color="#fff5e0" />
    </group>
  )
}

// ─── Generic Fallback ───────────────────────────────────────────────
function GenericFurniture({ w, h, d, color }: { w: number; h: number; d: number; color?: string }) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        {M(materials.oak, color)}
      </mesh>
      <mesh position={[0, h / 2, d / 2 + 0.001]}>
        <boxGeometry args={[w - 0.04, h - 0.04, 0.002]} />
        {M(materials.medWood, color)}
      </mesh>
    </group>
  )
}

// ─── Main Export ────────────────────────────────────────────────────
export default function FurnitureItem3D({ item }: { item: PlacedItem }) {
  const x = item.x / SCALE
  const z = item.y / SCALE
  const rot = -(item.rotation * Math.PI) / 180
  const w = item.width
  const h = item.height
  const d = item.depth
  const cat = (item.furnitureId || '').split('-')[0]

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {cat === 'sofa' && <Sofa3D w={w} h={h} d={d} color={item.color} />}
      {cat === 'chair' && <Chair3D w={w} h={h} d={d} color={item.color} />}
      {cat === 'bed' && <Bed3D w={w} h={h} d={d} color={item.color} />}
      {(cat === 'table' || cat === 'desk') && <Table3D w={w} h={h} d={d} color={item.color} />}
      {cat === 'storage' && <Storage3D w={w} h={h} d={d} color={item.color} furnitureId={item.furnitureId} />}
      {cat === 'kitchen' && <Kitchen3D w={w} h={h} d={d} color={item.color} furnitureId={item.furnitureId} />}
      {cat === 'bath' && <Bath3D w={w} h={h} d={d} furnitureId={item.furnitureId} />}
      {cat === 'decor' && <Decor3D w={w} h={h} d={d} furnitureId={item.furnitureId} color={item.color} />}
      {cat === 'light' && <Light3D w={w} h={h} d={d} />}
      {!['sofa', 'chair', 'bed', 'table', 'desk', 'storage', 'kitchen', 'bath', 'decor', 'light'].includes(cat) && (
        <GenericFurniture w={w} h={h} d={d} color={item.color} />
      )}
    </group>
  )
}
