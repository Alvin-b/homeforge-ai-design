import React, { Suspense, Component, type ReactNode } from 'react'
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

// ── Material shorthand ────────────────────────────────────────────
function M({ color, r = 0.7, m = 0, t = false, side = THREE.FrontSide }: {
  color: string; r?: number; m?: number; t?: boolean; side?: THREE.Side
}) {
  return <meshStandardMaterial color={color} roughness={r} metalness={m} transparent={t} opacity={t ? 0.35 : 1} side={side} />
}

// ══════════════════════════════════════════════════════════════════
//  SOFA FAMILY
// ══════════════════════════════════════════════════════════════════
function Sofa({ w, h, d, color = '#c8b89a' }: { w:number; h:number; d:number; color?:string }) {
  const legH = h*0.12, seatY = legH+h*0.18, backH = h*0.55
  return (
    <group>
      {[[-w*.44,-d*.38],[w*.44,-d*.38],[-w*.44,d*.38],[w*.44,d*.38]].map(([x,z],i) => (
        <mesh key={i} position={[x,legH/2,z]} castShadow>
          <cylinderGeometry args={[.025,.032,legH,8]}/>
          <M color="#3d2b1f" r={0.4}/>
        </mesh>
      ))}
      <mesh position={[0,seatY,d*.04]} castShadow receiveShadow>
        <boxGeometry args={[w*.96,h*.15,d*.78]}/>
        <M color={color} r={0.88}/>
      </mesh>
      <mesh position={[0,seatY+h*.09,d*.04]} castShadow>
        <boxGeometry args={[w*.94,h*.08,d*.76]}/>
        <M color={color} r={0.92}/>
      </mesh>
      <mesh position={[0,seatY+h*.09,d*.04]}>
        <boxGeometry args={[.012,h*.08,d*.76]}/>
        <M color={color} r={0.95}/>
      </mesh>
      <mesh position={[0,seatY+h*.24,-d*.34]} castShadow>
        <boxGeometry args={[w*.92,backH*.72,d*.2]}/>
        <M color={color} r={0.9}/>
      </mesh>
      <mesh position={[0,seatY+backH*.4,-d*.42]} castShadow>
        <boxGeometry args={[w*.96,backH,d*.08]}/>
        <M color={color} r={0.85}/>
      </mesh>
      {[-1,1].map((s,i)=>(
        <group key={i} position={[s*(w/2-w*.045),0,0]}>
          <mesh position={[0,seatY+h*.22,0]} castShadow>
            <boxGeometry args={[w*.09,h*.3,d*.88]}/><M color={color} r={0.85}/>
          </mesh>
          <mesh position={[0,seatY+h*.38,0]} castShadow>
            <boxGeometry args={[w*.1,h*.045,d*.88]}/><M color={color} r={0.82}/>
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Armchair({ w, h, d, color = '#9c7a6b' }: { w:number; h:number; d:number; color?:string }) {
  const seatY = h*0.42
  return (
    <group>
      {[[-w*.38,-d*.38],[w*.38,-d*.38],[-w*.38,d*.38],[w*.38,d*.38]].map(([x,z],i) => (
        <mesh key={i} position={[x,seatY*.25,z]} castShadow>
          <cylinderGeometry args={[.022,.028,seatY*.5,8]}/><M color="#3d2b1f" r={0.4}/>
        </mesh>
      ))}
      <mesh position={[0,seatY,0]} castShadow receiveShadow>
        <boxGeometry args={[w*.88,.1,d*.84]}/><M color={color} r={0.88}/>
      </mesh>
      <mesh position={[0,seatY+h*.28,-d*.38]} castShadow>
        <boxGeometry args={[w*.88,h*.5,d*.16]}/><M color={color} r={0.88}/>
      </mesh>
      {[-1,1].map((s,i)=>(
        <mesh key={i} position={[s*(w/2-w*.055),seatY+h*.16,0]} castShadow>
          <boxGeometry args={[w*.11,h*.26,d*.82]}/><M color={color} r={0.85}/>
        </mesh>
      ))}
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  BED FAMILY
// ══════════════════════════════════════════════════════════════════
function Bed({ w, h, d, color = '#8b6914' }: { w:number; h:number; d:number; color?:string }) {
  const fH = h*.38, mH = h*.16
  return (
    <group>
      <mesh position={[0,fH/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w+.08,fH,d+.06]}/><M color={color} r={0.5} m={0.02}/>
      </mesh>
      {Array.from({length:5}).map((_,i)=>(
        <mesh key={i} position={[0,fH-.02,-d*.38+(d*.76/4)*i]} castShadow>
          <boxGeometry args={[w-.06,.025,.06]}/><M color="#c8a87a" r={0.6}/>
        </mesh>
      ))}
      <mesh position={[0,fH+mH/2,0]} castShadow>
        <boxGeometry args={[w-.04,mH,d-.04]}/><M color="#f0ece4" r={0.95}/>
      </mesh>
      <mesh position={[0,fH+mH+.04,d*.08]} castShadow>
        <boxGeometry args={[w-.06,.06,d*.72]}/><M color="#e8e4de" r={0.95}/>
      </mesh>
      {[-(w*.26),w*.26].map((px,i)=>(
        <mesh key={i} position={[px,fH+mH+.06,-d*.34]} castShadow>
          <boxGeometry args={[w*.38,.1,.28]}/><M color="#faf8f4" r={0.95}/>
        </mesh>
      ))}
      <mesh position={[0,fH+h*.72,-d/2-.04]} castShadow>
        <boxGeometry args={[w+.08,h*1.45,.07]}/><M color={color} r={0.48}/>
      </mesh>
      <mesh position={[0,fH+h*.72,-d/2-.02]}>
        <boxGeometry args={[w*.78,h*1.05,.025]}/><M color={color} r={0.55}/>
      </mesh>
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  TABLE FAMILY
// ══════════════════════════════════════════════════════════════════
function DiningTable({ w, h, d, color = '#8b6334' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h-.02,0]} castShadow receiveShadow>
        <boxGeometry args={[w,.04,d]}/><M color={color} r={0.45} m={0.02}/>
      </mesh>
      {[-d/2+.03,d/2-.03].map((z,i)=>(
        <mesh key={i} position={[0,h-.08,z]} castShadow>
          <boxGeometry args={[w-.12,.1,.025]}/><M color={color} r={0.5}/>
        </mesh>
      ))}
      {[-w/2+.03,w/2-.03].map((x,i)=>(
        <mesh key={i} position={[x,h-.08,0]} castShadow>
          <boxGeometry args={[.025,.1,d-.12]}/><M color={color} r={0.5}/>
        </mesh>
      ))}
      {[[-w*.44,-d*.4],[w*.44,-d*.4],[-w*.44,d*.4],[w*.44,d*.4]].map(([x,z],i)=>(
        <mesh key={i} position={[x,(h-.12)/2,z]} castShadow>
          <cylinderGeometry args={[.024,.032,h-.12,8]}/><M color={color} r={0.45}/>
        </mesh>
      ))}
    </group>
  )
}

function CoffeeTable({ w, h, d, color = '#8b6334' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h-.025,0]} castShadow receiveShadow>
        <boxGeometry args={[w,.05,d]}/><M color={color} r={0.42}/>
      </mesh>
      <mesh position={[0,h*.28,0]} castShadow>
        <boxGeometry args={[w*.82,.028,d*.82]}/><M color={color} r={0.5}/>
      </mesh>
      {[[-w*.42,-d*.38],[w*.42,-d*.38],[-w*.42,d*.38],[w*.42,d*.38]].map(([x,z],i)=>(
        <mesh key={i} position={[x,(h-.05)/2,z]} castShadow>
          <cylinderGeometry args={[.012,.012,h-.05,6]}/><M color="#4a4a4a" r={0.2} m={0.85}/>
        </mesh>
      ))}
    </group>
  )
}

function Chair({ w, h, d, color = '#8b6334' }: { w:number; h:number; d:number; color?:string }) {
  const seatY = h*.47
  return (
    <group>
      {[-w*.36,w*.36].map((x,i)=>(
        <mesh key={i} position={[x,seatY/2,d*.32]} castShadow>
          <cylinderGeometry args={[.016,.02,seatY,8]}/><M color={color} r={0.45}/>
        </mesh>
      ))}
      {[-w*.36,w*.36].map((x,i)=>(
        <mesh key={i} position={[x,(seatY+h*.5)/2,-d*.32]} castShadow>
          <cylinderGeometry args={[.016,.02,seatY+h*.5,8]}/><M color={color} r={0.45}/>
        </mesh>
      ))}
      <mesh position={[0,seatY,0]} castShadow receiveShadow>
        <boxGeometry args={[w*.88,.036,d*.84]}/><M color={color} r={0.5}/>
      </mesh>
      <mesh position={[0,seatY+.025,0]} castShadow>
        <boxGeometry args={[w*.84,.04,d*.8]}/><M color="#c8b49a" r={0.9}/>
      </mesh>
      <mesh position={[0,seatY+h*.48,-d*.32]} castShadow>
        <boxGeometry args={[w*.84,.032,.028]}/><M color={color} r={0.45}/>
      </mesh>
      <mesh position={[0,seatY+h*.3,-d*.32]} castShadow>
        <boxGeometry args={[w*.32,h*.44,.016]}/><M color={color} r={0.48}/>
      </mesh>
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  STORAGE
// ══════════════════════════════════════════════════════════════════
function Wardrobe({ w, h, d, color = '#c8bca8' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h,d]}/><M color={color} r={0.55}/>
      </mesh>
      {[-w/4,w/4].map((x,i)=>(
        <group key={i}>
          <mesh position={[x,h/2,d/2+.003]}>
            <boxGeometry args={[w/2-.018,h-.024,.006]}/><M color={color} r={0.5}/>
          </mesh>
          <mesh position={[x,h/2,d/2+.007]}>
            <boxGeometry args={[w/2-.08,h-.12,.004]}/><M color={color} r={0.52}/>
          </mesh>
          <mesh position={[x+(i===0?w*.18:-w*.18),h*.5,d/2+.018]} castShadow>
            <boxGeometry args={[.012,.1,.016]}/><M color="#c0b090" r={0.3} m={0.5}/>
          </mesh>
        </group>
      ))}
      <mesh position={[0,h/2,d/2+.001]}>
        <boxGeometry args={[.014,h,.008]}/><M color="#8a7a6a" r={0.5}/>
      </mesh>
    </group>
  )
}

function Bookshelf({ w, h, d, color = '#a08060' }: { w:number; h:number; d:number; color?:string }) {
  const pt = .022, shelves = Math.max(3,Math.floor(h/.32))
  return (
    <group>
      {[-w/2+pt/2,w/2-pt/2].map((x,i)=>(
        <mesh key={i} position={[x,h/2,0]} castShadow>
          <boxGeometry args={[pt,h,d]}/><M color={color} r={0.5}/>
        </mesh>
      ))}
      <mesh position={[0,h/2,-d/2+.008]}>
        <boxGeometry args={[w-pt*2,h,.015]}/><M color={color} r={0.6}/>
      </mesh>
      {Array.from({length:shelves+1}).map((_,i)=>(
        <mesh key={i} position={[0,(i/shelves)*(h-pt)+pt/2,0]} castShadow>
          <boxGeometry args={[w-pt*2,pt,d-.01]}/><M color={color} r={0.5}/>
        </mesh>
      ))}
      {Array.from({length:shelves-1}).map((_,i)=>(
        <mesh key={i} position={[-w*.2,((i+1)/shelves)*(h-pt)+pt+.06,0]} castShadow>
          <boxGeometry args={[w*.08,.12,d*.5]}/><M color={i%2===0?'#4a6a8a':'#8a4a4a'} r={0.7}/>
        </mesh>
      ))}
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  TV & MEDIA
// ══════════════════════════════════════════════════════════════════
function TV({ w, h, d }: { w:number; h:number; d:number }) {
  const screenW = w*.96, screenH = h*.9
  return (
    <group>
      {/* Bezel */}
      <mesh position={[0,h/2,0]} castShadow>
        <boxGeometry args={[w,h,d*.8]}/><M color="#111" r={0.3} m={0.5}/>
      </mesh>
      {/* Screen */}
      <mesh position={[0,h/2,d*.41]}>
        <boxGeometry args={[screenW,screenH,.004]}/>
        <meshStandardMaterial color="#0a1a2a" roughness={0.05} metalness={0.1} emissive="#0a1a2a" emissiveIntensity={0.3}/>
      </mesh>
      {/* Screen glow */}
      <mesh position={[0,h/2,d*.42]}>
        <boxGeometry args={[screenW*.96,screenH*.95,.002]}/>
        <meshStandardMaterial color="#1a3a5a" roughness={0.02} emissive="#2060a0" emissiveIntensity={0.15}/>
      </mesh>
      {/* Stand */}
      <mesh position={[0,.04,0]} castShadow>
        <boxGeometry args={[w*.22,.08,d*.6]}/><M color="#111" r={0.3} m={0.5}/>
      </mesh>
      <mesh position={[0,.01,0]}>
        <boxGeometry args={[w*.35,.02,d*.7]}/><M color="#0a0a0a" r={0.2} m={0.6}/>
      </mesh>
    </group>
  )
}

function TVStand({ w, h, d, color = '#2a2020' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h,d]}/><M color={color} r={0.4}/>
      </mesh>
      {[-w*.27,w*.27].map((x,i)=>(
        <group key={i}>
          <mesh position={[x,h*.38,d/2+.004]}>
            <boxGeometry args={[w*.38,h*.62,.007]}/><M color={color} r={0.38}/>
          </mesh>
          <mesh position={[x+(i===0?w*.14:-w*.14),h*.38,d/2+.017]}>
            <boxGeometry args={[.01,.06,.012]}/><M color="#aaa" r={0.2} m={0.8}/>
          </mesh>
        </group>
      ))}
      {[[-w*.44,-d*.38],[w*.44,-d*.38],[-w*.44,d*.38],[w*.44,d*.38]].map(([x,z],i)=>(
        <mesh key={i} position={[x,-h*.04,z]} castShadow>
          <cylinderGeometry args={[.022,.022,h*.08,6]}/><M color="#1a1a1a" r={0.3} m={0.6}/>
        </mesh>
      ))}
    </group>
  )
}

function Fireplace({ w, h, d, color = '#4a3830' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Main surround */}
      <mesh position={[0,h/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h,d]}/><M color={color} r={0.7}/>
      </mesh>
      {/* Firebox opening */}
      <mesh position={[0,h*.35,d/2+.005]}>
        <boxGeometry args={[w*.62,h*.5,.01]}/><M color="#1a0a0a" r={0.95}/>
      </mesh>
      {/* Fire glow */}
      <mesh position={[0,h*.28,d*.4]}>
        <boxGeometry args={[w*.55,h*.35,.02]}/>
        <meshStandardMaterial color="#ff4400" roughness={0.9} emissive="#ff2200" emissiveIntensity={0.8} transparent opacity={0.9}/>
      </mesh>
      <mesh position={[0,h*.32,d*.4]}>
        <boxGeometry args={[w*.35,h*.22,.02]}/>
        <meshStandardMaterial color="#ff8800" roughness={0.9} emissive="#ff6600" emissiveIntensity={0.9} transparent opacity={0.8}/>
      </mesh>
      {/* Mantle shelf */}
      <mesh position={[0,h+.015,0]} castShadow>
        <boxGeometry args={[w+.06,.03,d+.04]}/><M color={color} r={0.5}/>
      </mesh>
      {/* Fire light */}
      <pointLight position={[0,h*.3,d*.3]} intensity={1.2} distance={4} color="#ff6600" castShadow={false}/>
    </group>
  )
}

function Speaker({ w, h, d }: { w:number; h:number; d:number }) {
  return (
    <group>
      <mesh position={[0,h/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h,d]}/><M color="#1a1a1a" r={0.3} m={0.2}/>
      </mesh>
      {/* Drivers */}
      {[h*.72,h*.45].map((y,i)=>(
        <mesh key={i} position={[0,y,d/2+.004]}>
          <cylinderGeometry args={[i===0?w*.22:w*.14,.001,w*.22*.1,16]}/>
          <meshStandardMaterial color="#333" roughness={0.2} metalness={0.6}/>
        </mesh>
      ))}
      <mesh position={[0,h*.2,d/2+.004]}>
        <cylinderGeometry args={[w*.1,.001,w*.04,12]}/>
        <meshStandardMaterial color="#444" roughness={0.2} metalness={0.5}/>
      </mesh>
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  KITCHEN
// ══════════════════════════════════════════════════════════════════
function Fridge({ w, h, d, color = '#e8e8e8' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h,d]}/><M color={color} r={0.25} m={0.3}/>
      </mesh>
      {/* Door division */}
      <mesh position={[0,h*.38,d/2+.002]}>
        <boxGeometry args={[w-.01,.012,.004]}/><M color="#ccc" r={0.2} m={0.5}/>
      </mesh>
      {/* Handles */}
      {[h*.65,h*.22].map((y,i)=>(
        <mesh key={i} position={[w*.35,y,d/2+.03]} castShadow>
          <boxGeometry args={[.016,.2,.02]}/><M color="#aaa" r={0.1} m={0.9}/>
        </mesh>
      ))}
      {/* Logo area */}
      <mesh position={[0,h*.52,d/2+.002]}>
        <boxGeometry args={[w*.3,.04,.003]}/><M color="#ddd" r={0.3} m={0.4}/>
      </mesh>
    </group>
  )
}

function KitchenCounter({ w, h, d, color = '#e0dbd0' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Cabinet body */}
      <mesh position={[0,(h-.04)/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h-.04,d]}/><M color={color} r={0.55}/>
      </mesh>
      {/* Countertop */}
      <mesh position={[0,h-.02,0]} castShadow>
        <boxGeometry args={[w,.04,d]}/><M color="#d0ccc0" r={0.35} m={0.1}/>
      </mesh>
      {/* Door lines */}
      {Array.from({length:Math.max(1,Math.floor(w/.45))}).map((_,i)=>{
        const x = -w/2 + .225 + i*.45
        return (
          <mesh key={i} position={[x,(h*.4),d/2+.003]}>
            <boxGeometry args={[.01,h*.6,.004]}/><M color="#bbb4a8" r={0.5}/>
          </mesh>
        )
      })}
      {/* Handles */}
      {Array.from({length:Math.max(1,Math.floor(w/.45))}).map((_,i)=>{
        const x = -w/2 + .225 + i*.45
        return (
          <mesh key={i} position={[x,h*.38,d/2+.018]} castShadow>
            <boxGeometry args={[.1,.01,.014]}/><M color="#aaa" r={0.2} m={0.7}/>
          </mesh>
        )
      })}
      {/* Toe kick */}
      <mesh position={[0,.05,d/2-.02]}>
        <boxGeometry args={[w,.1,d*.08]}/><M color="#999890" r={0.6}/>
      </mesh>
    </group>
  )
}

function KitchenSink({ w, h, d, color = '#c8d0d0' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,(h-.04)/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h-.04,d]}/><M color="#e0dbd0" r={0.55}/>
      </mesh>
      {/* Countertop */}
      <mesh position={[0,h-.02,0]}>
        <boxGeometry args={[w,.04,d]}/><M color="#c8c0b0" r={0.3} m={0.15}/>
      </mesh>
      {/* Basin */}
      <mesh position={[0,h-.05,0]}>
        <boxGeometry args={[w*.6,.06,d*.65]}/><M color={color} r={0.2} m={0.3}/>
      </mesh>
      {/* Faucet */}
      <mesh position={[0,h+.06,d*.1]} castShadow>
        <cylinderGeometry args={[.012,.012,.08,8]}/><M color="#aaa" r={0.1} m={0.9}/>
      </mesh>
      <mesh position={[0,h+.1,-.04]} castShadow>
        <cylinderGeometry args={[.01,.01,.1,8]}/><M color="#aaa" r={0.1} m={0.9}/>
      </mesh>
    </group>
  )
}

function Oven({ w, h, d, color = '#222' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h,d]}/><M color={color} r={0.25} m={0.4}/>
      </mesh>
      {/* Door */}
      <mesh position={[0,h*.32,d/2+.004]}>
        <boxGeometry args={[w*.88,h*.5,.008]}/><M color="#1a1a1a" r={0.15} m={0.5}/>
      </mesh>
      {/* Door window */}
      <mesh position={[0,h*.32,d/2+.01]}>
        <boxGeometry args={[w*.5,h*.28,.004]}/><M color="#1a2a1a" r={0.05} m={0.1}/>
      </mesh>
      {/* Burners */}
      {[[-w*.22,-d*.25],[w*.22,-d*.25],[-w*.22,d*.15],[w*.22,d*.15]].map(([x,z],i)=>(
        <mesh key={i} position={[x,h+.005,z]}>
          <cylinderGeometry args={[w*.14,.001,w*.04,20]}/><M color="#333" r={0.2} m={0.5}/>
        </mesh>
      ))}
      {/* Control knobs */}
      {[-w*.3,-w*.1,w*.1,w*.3].map((x,i)=>(
        <mesh key={i} position={[x,h*.8,d/2+.015]} castShadow>
          <cylinderGeometry args={[.018,.018,.02,12]}/><M color="#555" r={0.2} m={0.4}/>
        </mesh>
      ))}
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  BATHROOM
// ══════════════════════════════════════════════════════════════════
function Bathtub({ w, h, d, color = '#f5f5f0' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Outer shell */}
      <mesh position={[0,h*.4,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h*.8,d]}/><M color={color} r={0.2} m={0.05}/>
      </mesh>
      {/* Inner basin */}
      <mesh position={[0,h*.52,0]}>
        <boxGeometry args={[w*.88,h*.55,d*.84]}/><M color="#e8f4f8" r={0.1} m={0.1}/>
      </mesh>
      {/* Rim */}
      <mesh position={[0,h*.82,0]}>
        <boxGeometry args={[w+.01,.03,d+.01]}/><M color={color} r={0.15} m={0.1}/>
      </mesh>
      {/* Faucet */}
      <mesh position={[0,h*.9,-d*.38]} castShadow>
        <cylinderGeometry args={[.014,.014,.06,8]}/><M color="#c0c0b8" r={0.1} m={0.9}/>
      </mesh>
      {/* Feet */}
      {[[-w*.4,-d*.4],[w*.4,-d*.4],[-w*.4,d*.4],[w*.4,d*.4]].map(([x,z],i)=>(
        <mesh key={i} position={[x,.04,z]} castShadow>
          <sphereGeometry args={[.04,8,6]}/><M color="#c0c0b0" r={0.2} m={0.6}/>
        </mesh>
      ))}
    </group>
  )
}

function Toilet({ w, h, d, color = '#f8f8f4' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Bowl base */}
      <mesh position={[0,h*.22,d*.08]} castShadow receiveShadow>
        <boxGeometry args={[w,h*.44,d*.72]}/><M color={color} r={0.2} m={0.05}/>
      </mesh>
      {/* Bowl inner */}
      <mesh position={[0,h*.38,d*.08]}>
        <boxGeometry args={[w*.72,h*.12,d*.55]}/><M color="#dff0f5" r={0.05} m={0.05}/>
      </mesh>
      {/* Seat */}
      <mesh position={[0,h*.45,d*.08]} castShadow>
        <boxGeometry args={[w*.88,.025,d*.68]}/><M color={color} r={0.2}/>
      </mesh>
      {/* Tank */}
      <mesh position={[0,h*.72,-d*.32]} castShadow>
        <boxGeometry args={[w*.78,h*.44,d*.28]}/><M color={color} r={0.2}/>
      </mesh>
      <mesh position={[0,h*.95,-d*.32]} castShadow>
        <boxGeometry args={[w*.8,.02,d*.3]}/><M color={color} r={0.15}/>
      </mesh>
    </group>
  )
}

function ShowerCubicle({ w, h, d }: { w:number; h:number; d:number }) {
  return (
    <group>
      {/* Base tray */}
      <mesh position={[0,.04,0]} castShadow receiveShadow>
        <boxGeometry args={[w,.08,d]}/><M color="#e8e8e0" r={0.3} m={0.1}/>
      </mesh>
      {/* Glass walls */}
      {[
        [w/2,.0,[.02,h,d]],
        [-w/2,.0,[.02,h,d]],
        [0,.0,[w,h,.02]],
      ].map(([x,y,dims],i)=>(
        <mesh key={i} position={[x as number,h/2,y as number]} castShadow>
          <boxGeometry args={dims as [number,number,number]}/>
          <meshStandardMaterial color="#c8d8e8" roughness={0.05} metalness={0.0} transparent opacity={0.3} side={THREE.DoubleSide}/>
        </mesh>
      ))}
      {/* Frame */}
      {[w/2,-w/2].map((x,i)=>(
        <mesh key={i} position={[x,h/2,0]} castShadow>
          <boxGeometry args={[.025,h,d+.025]}/><M color="#c0c0b8" r={0.2} m={0.7}/>
        </mesh>
      ))}
      {/* Shower head */}
      <mesh position={[0,h*.9,d*.3]} castShadow>
        <cylinderGeometry args={[.06,.06,.012,16]}/><M color="#bbb" r={0.15} m={0.8}/>
      </mesh>
      <mesh position={[0,h*.9+.06,d*.3]}>
        <cylinderGeometry args={[.012,.012,.12,8]}/><M color="#ccc" r={0.15} m={0.8}/>
      </mesh>
    </group>
  )
}

function BathroomSink({ w, h, d, color = '#f0f0ec' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Vanity base */}
      <mesh position={[0,(h*.7)/2,0]} castShadow receiveShadow>
        <boxGeometry args={[w,h*.7,d]}/><M color="#e8e0d0" r={0.55}/>
      </mesh>
      {/* Counter */}
      <mesh position={[0,h*.7,0]} castShadow>
        <boxGeometry args={[w+.01,.04,d+.01]}/><M color="#d0c8b8" r={0.3} m={0.1}/>
      </mesh>
      {/* Basin */}
      <mesh position={[0,h*.74,0]}>
        <boxGeometry args={[w*.6,.06,d*.65]}/><M color={color} r={0.15} m={0.1}/>
      </mesh>
      {/* Faucet */}
      <mesh position={[0,h*.84,d*.05]} castShadow>
        <cylinderGeometry args={[.012,.012,.06,8]}/><M color="#aaa" r={0.1} m={0.9}/>
      </mesh>
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  OFFICE
// ══════════════════════════════════════════════════════════════════
function Desk({ w, h, d, color = '#b8a888' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,h-.02,0]} castShadow receiveShadow>
        <boxGeometry args={[w,.04,d]}/><M color={color} r={0.45}/>
      </mesh>
      {[-w/2+.025,w/2-.025].map((x,i)=>(
        <mesh key={i} position={[x,(h-.04)/2,0]} castShadow>
          <boxGeometry args={[.05,h-.04,d]}/><M color={color} r={0.48}/>
        </mesh>
      ))}
      <mesh position={[w*.28,h*.28,0]}>
        <boxGeometry args={[w*.3,h*.44,d*.88]}/><M color={color} r={0.5}/>
      </mesh>
      {[.38,.22,.06].map((y,i)=>(
        <mesh key={i} position={[w*.28,h*y,d*.44+.012]}>
          <boxGeometry args={[w*.26,.01,.008]}/><M color="#888" r={0.3} m={0.6}/>
        </mesh>
      ))}
    </group>
  )
}

function OfficeChair({ w, h, d, color = '#222' }: { w:number; h:number; d:number; color?:string }) {
  const seatY = h*.38
  return (
    <group>
      {/* 5-star base */}
      {Array.from({length:5}).map((_,i)=>{
        const a = (i/5)*Math.PI*2
        return (
          <mesh key={i} position={[Math.cos(a)*w*.38,h*.08,Math.sin(a)*d*.38]} castShadow>
            <boxGeometry args={[w*.35,.025,.04]}/><M color="#1a1a1a" r={0.3} m={0.6}/>
          </mesh>
        )
      })}
      {/* Cylinder stem */}
      <mesh position={[0,seatY*.5,0]}>
        <cylinderGeometry args={[.025,.02,seatY*.8,8]}/><M color="#333" r={0.2} m={0.7}/>
      </mesh>
      {/* Seat */}
      <mesh position={[0,seatY,0]} castShadow>
        <boxGeometry args={[w*.82,.1,d*.82]}/><M color={color} r={0.5}/>
      </mesh>
      {/* Back */}
      <mesh position={[0,seatY+h*.28,-d*.32]} castShadow>
        <boxGeometry args={[w*.78,h*.48,d*.12]}/><M color={color} r={0.5}/>
      </mesh>
      {/* Back support */}
      <mesh position={[0,seatY+h*.2,-d*.38]} castShadow>
        <boxGeometry args={[.04,h*.38,.04]}/><M color="#333" r={0.25} m={0.5}/>
      </mesh>
      {/* Armrests */}
      {[-1,1].map((s,i)=>(
        <group key={i} position={[s*w*.34,0,0]}>
          <mesh position={[0,seatY+h*.12,-d*.06]} castShadow>
            <boxGeometry args={[.04,h*.18,.04]}/><M color="#333" r={0.3} m={0.5}/>
          </mesh>
          <mesh position={[0,seatY+h*.22,d*.04]} castShadow>
            <boxGeometry args={[.08,.022,d*.4]}/><M color="#555" r={0.5}/>
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Monitor({ w, h, d, color = '#111' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Screen panel */}
      <mesh position={[0,h*.62,0]} castShadow>
        <boxGeometry args={[w,h*.7,d*.5]}/><M color={color} r={0.3} m={0.4}/>
      </mesh>
      {/* Screen */}
      <mesh position={[0,h*.62,d*.26]}>
        <boxGeometry args={[w*.92,h*.62,.004]}/>
        <meshStandardMaterial color="#0a1520" roughness={0.02} emissive="#102040" emissiveIntensity={0.4}/>
      </mesh>
      {/* Stand neck */}
      <mesh position={[0,h*.22,0]}>
        <cylinderGeometry args={[.02,.02,h*.3,8]}/><M color="#222" r={0.3} m={0.5}/>
      </mesh>
      {/* Stand base */}
      <mesh position={[0,.03,0]}>
        <boxGeometry args={[w*.5,.025,d*.8]}/><M color="#1a1a1a" r={0.3} m={0.5}/>
      </mesh>
    </group>
  )
}

// ══════════════════════════════════════════════════════════════════
//  DECOR
// ══════════════════════════════════════════════════════════════════
function FloorLamp({ w, h }: { w:number; h:number }) {
  return (
    <group>
      <mesh position={[0,.025,0]} castShadow>
        <cylinderGeometry args={[w*.35,w*.4,.05,16]}/><M color="#c8b878" r={0.25} m={0.7}/>
      </mesh>
      <mesh position={[0,h*.44,0]} castShadow>
        <cylinderGeometry args={[.014,.018,h*.82,8]}/><M color="#c8b878" r={0.25} m={0.7}/>
      </mesh>
      <mesh position={[0,h*.88,0]}>
        <cylinderGeometry args={[w*.18,w*.48,h*.22,16,1,true]}/>
        <meshStandardMaterial color="#f5e8d0" roughness={0.9} side={THREE.DoubleSide}/>
      </mesh>
      <pointLight position={[0,h*.86,0]} intensity={0.8} distance={6} color="#fff5e0" castShadow={false}/>
    </group>
  )
}

function Plant({ w, h, d }: { w:number; h:number; d:number }) {
  return (
    <group>
      <mesh position={[0,h*.12,0]} castShadow>
        <cylinderGeometry args={[w*.3,w*.22,h*.24,12]}/><M color="#b05a30" r={0.75}/>
      </mesh>
      <mesh position={[0,h*.245,0]}>
        <cylinderGeometry args={[w*.29,w*.29,.015,12]}/><M color="#3a2a18" r={0.95}/>
      </mesh>
      <mesh position={[0,h*.58,0]}>
        <sphereGeometry args={[w*.44,12,10]}/><M color="#2d6a22" r={0.88}/>
      </mesh>
      {[[w*.2,h*.52,w*.15],[-w*.18,h*.65,-w*.1],[w*.08,h*.72,-w*.18]].map(([x,y,z],i)=>(
        <mesh key={i} position={[x,y,z]}>
          <sphereGeometry args={[w*(.24+i*.04),10,8]}/><M color={i%2===0?'#3a7a2a':'#256a1e'} r={0.9}/>
        </mesh>
      ))}
    </group>
  )
}

function Rug({ w, h, d, color = '#8a7060' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      <mesh position={[0,.005,0]} receiveShadow>
        <boxGeometry args={[w,.01,d]}/><M color={color} r={0.98}/>
      </mesh>
      {/* Pattern border */}
      <mesh position={[0,.012,0]}>
        <boxGeometry args={[w*.94,.008,d*.94]}/>
        <meshStandardMaterial color={color} roughness={0.98} transparent opacity={0.6}/>
      </mesh>
    </group>
  )
}

function WallMirror({ w, h, d, color = '#c0c8d0' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0,h/2,0]} castShadow>
        <boxGeometry args={[w,h,d*3]}/><M color="#8a7a6a" r={0.4} m={0.1}/>
      </mesh>
      {/* Mirror glass */}
      <mesh position={[0,h/2,d*.5]}>
        <boxGeometry args={[w*.9,h*.9,.003]}/>
        <meshStandardMaterial color={color} roughness={0.02} metalness={0.9} envMapIntensity={1}/>
      </mesh>
    </group>
  )
}

function Door({ w, h, d, color = '#8a7060' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[-w/2+.04,h/2,0]} castShadow>
        <boxGeometry args={[.08,h,.12]}/><M color={color} r={0.5}/>
      </mesh>
      <mesh position={[0,h-.04,0]} castShadow>
        <boxGeometry args={[w,.08,.12]}/><M color={color} r={0.5}/>
      </mesh>
      {/* Door panel */}
      <mesh position={[w*.1,h/2-.04,0]} castShadow>
        <boxGeometry args={[w*.8,h*.96,d]}/><M color={color} r={0.48}/>
      </mesh>
      {/* Panels */}
      {[h*.68,h*.32].map((y,i)=>(
        <mesh key={i} position={[w*.1,y,d*.55]}>
          <boxGeometry args={[w*.55,h*.22,.008]}/><M color={color} r={0.5}/>
        </mesh>
      ))}
      {/* Handle */}
      <mesh position={[w*.34,h*.52,d*.6]} castShadow>
        <cylinderGeometry args={[.015,.015,.12,8]}/><M color="#c0b090" r={0.2} m={0.7}/>
      </mesh>
    </group>
  )
}

function Curtain({ w, h, d, color = '#c8c0b0' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <group>
      {/* Curtain rod */}
      <mesh position={[0,h+.02,0]}>
        <cylinderGeometry args={[.015,.015,w+.1,8]} rotation-z={Math.PI/2 as never}/><M color="#888" r={0.2} m={0.7}/>
      </mesh>
      {/* Fabric panels */}
      {[-1,1].map((s,i)=>(
        <mesh key={i} position={[s*w*.25,h*.47,0]} castShadow>
          <boxGeometry args={[w*.48,h*.94,d]}/>
          <meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide}/>
        </mesh>
      ))}
    </group>
  )
}

function Generic({ w, h, d, color = '#b8a888' }: { w:number; h:number; d:number; color?:string }) {
  return (
    <mesh position={[0,h/2,0]} castShadow receiveShadow>
      <boxGeometry args={[w,h,d]}/><M color={color} r={0.6}/>
    </mesh>
  )
}

// ══════════════════════════════════════════════════════════════════
//  ROUTER
// ══════════════════════════════════════════════════════════════════
function ProceduralModel({ furnitureId, w, h, d, color }: {
  furnitureId: string; w: number; h: number; d: number; color?: string
}) {
  const id = furnitureId.toLowerCase()

  // Sofas
  if (id.includes('sofa')) return <Sofa w={w} h={h} d={d} color={color}/>
  if (id.includes('armchair') || id.includes('chair-arm') || id.includes('chair-accent')) return <Armchair w={w} h={h} d={d} color={color}/>
  if (id.includes('ottoman') || id.includes('bench')) return <Generic w={w} h={h} d={d} color={color||'#c0a878'}/>

  // Beds
  if (id.includes('bed')) return <Bed w={w} h={h} d={d} color={color}/>
  if (id.includes('wardrobe') || id.includes('closet')) return <Wardrobe w={w} h={h} d={d} color={color}/>
  if (id.includes('nightstand') || id.includes('dresser')) return <Generic w={w} h={h} d={d} color={color||'#a07850'}/>

  // Tables & chairs
  if (id.includes('table-dining') || id.includes('table-round') || id.includes('table-bar')) return <DiningTable w={w} h={h} d={d} color={color}/>
  if (id.includes('table-coffee') || id.includes('ctable')) return <CoffeeTable w={w} h={h} d={d} color={color}/>
  if (id.includes('chair-office')) return <OfficeChair w={w} h={h} d={d} color={color}/>
  if (id.includes('chair')) return <Chair w={w} h={h} d={d} color={color}/>

  // Storage
  if (id.includes('bookshelf') || id.includes('shelf-book') || id.includes('shelf-office')) return <Bookshelf w={w} h={h} d={d} color={color}/>
  if (id.includes('cabinet') || id.includes('sideboard') || id.includes('dresser')) return <Generic w={w} h={h} d={d} color={color||'#9a8060'}/>

  // TV & Media
  if (id.includes('tv-') && !id.includes('stand')) return <TV w={w} h={h} d={d}/>
  if (id.includes('tv-stand') || id.includes('cabinet-tv')) return <TVStand w={w} h={h} d={d} color={color}/>
  if (id.includes('fireplace')) return <Fireplace w={w} h={h} d={d} color={color}/>
  if (id.includes('speaker')) return <Speaker w={w} h={h} d={d}/>

  // Kitchen
  if (id.includes('fridge')) return <Fridge w={w} h={h} d={d} color={color}/>
  if (id.includes('oven') || id.includes('range')) return <Oven w={w} h={h} d={d}/>
  if (id.includes('counter') || id.includes('island')) return <KitchenCounter w={w} h={h} d={d} color={color}/>
  if (id.includes('sink-kitchen')) return <KitchenSink w={w} h={h} d={d}/>

  // Bathroom
  if (id.includes('bathtub') || id.includes('bath')) return <Bathtub w={w} h={h} d={d} color={color}/>
  if (id.includes('toilet')) return <Toilet w={w} h={h} d={d} color={color}/>
  if (id.includes('shower')) return <ShowerCubicle w={w} h={h} d={d}/>
  if (id.includes('sink-bath') || id.includes('vanity')) return <BathroomSink w={w} h={h} d={d} color={color}/>

  // Office
  if (id.includes('desk')) return <Desk w={w} h={h} d={d} color={color}/>
  if (id.includes('monitor')) return <Monitor w={w} h={h} d={d}/>

  // Decor
  if (id.includes('plant')) return <Plant w={w} h={h} d={d}/>
  if (id.includes('lamp')) return <FloorLamp w={w} h={h}/>
  if (id.includes('rug')) return <Rug w={w} h={h} d={d} color={color}/>
  if (id.includes('mirror')) return <WallMirror w={w} h={h} d={d}/>
  if (id.includes('curtain')) return <Curtain w={w} h={h} d={d} color={color}/>

  // Doors & windows
  if (id.includes('door')) return <Door w={w} h={h} d={d} color={color}/>

  return <Generic w={w} h={h} d={d} color={color}/>
}

function TryGLB({ glbUrl, furnitureId, w, h, d, color }: {
  glbUrl: string; furnitureId: string; w: number; h: number; d: number; color?: string
}) {
  const fallback = <ProceduralModel furnitureId={furnitureId} w={w} h={h} d={d} color={color}/>
  return (
    <GLBBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLBModel url={glbUrl} w={w} h={h} d={d}/>
      </Suspense>
    </GLBBoundary>
  )
}

// ── Main export ───────────────────────────────────────────────────
export default function FurnitureItem3D({ item }: { item: PlacedItem }) {
  const x   = item.x / SCALE
  const z   = item.y / SCALE
  const rot = -(item.rotation * Math.PI) / 180
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <TryGLB
        glbUrl={`/models/furniture/${item.furnitureId}.glb`}
        furnitureId={item.furnitureId}
        w={item.width}
        h={item.height}
        d={item.depth}
        color={item.color}
      />
    </group>
  )
}
