import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useEditorStore } from '@/store/useEditorStore'
import { Move } from 'lucide-react'

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

const moveSpeed = 4
const lookSpeed = 0.002

function WalkthroughCamera() {
  const { camera } = useThree()
  const moveRef = useRef({ forward: 0, backward: 0, left: 0, right: 0 })
  const velocityRef = useRef(new THREE.Vector3())
  const directionRef = useRef(new THREE.Vector3())
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const initRef = useRef(false)

  useEffect(() => {
    if (!initRef.current) {
      camera.position.set(5, 1.6, 5)
      camera.rotation.order = 'YXZ'
      eulerRef.current.setFromQuaternion(camera.quaternion)
      initRef.current = true
    }
  }, [camera])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveRef.current.forward = 1; break
        case 'KeyS': moveRef.current.backward = 1; break
        case 'KeyA': moveRef.current.left = 1; break
        case 'KeyD': moveRef.current.right = 1; break
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveRef.current.forward = 0; break
        case 'KeyS': moveRef.current.backward = 0; break
        case 'KeyA': moveRef.current.left = 0; break
        case 'KeyD': moveRef.current.right = 0; break
      }
    }
    let isPointerLocked = false
    const onPointerLock = () => { isPointerLocked = true }
    const onPointerUnlock = () => { isPointerLocked = false }
    const onMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return
      eulerRef.current.y -= e.movementX * lookSpeed
      eulerRef.current.x -= e.movementY * lookSpeed
      eulerRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, eulerRef.current.x))
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  useFrame((_, delta) => {
    const { forward, backward, left, right } = moveRef.current
    directionRef.current.set(right - left, 0, backward - forward).normalize()
    directionRef.current.applyEuler(eulerRef.current)
    velocityRef.current.copy(directionRef.current).multiplyScalar(moveSpeed * delta)
    camera.position.add(velocityRef.current)
    camera.rotation.order = 'YXZ'
    camera.rotation.y = eulerRef.current.y
    camera.rotation.x = eulerRef.current.x
  })

  return null
}

function Scene() {
  const { walls, placedItems, rooms } = useEditorStore()

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 18, 10]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <hemisphereLight args={['#b1c4e0', '#e8dcc8', 0.5]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f0f0ec" />
      </mesh>
      {rooms.map((r) => <RoomFloor3D key={r.id} room={r} />)}
      {walls.map((w) => <Wall3D key={w.id} wall={w} />)}
      {placedItems.map((i) => <FurnitureItem3D key={i.id} item={i} />)}
      <WalkthroughCamera />
      <Environment preset="apartment" />
    </>
  )
}

export default function WalkthroughView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [locked, setLocked] = useState(false)

  const handleClick = () => {
    containerRef.current?.requestPointerLock?.()
    setLocked(true)
  }

  useEffect(() => {
    const onChange = () => {
      setLocked(document.pointerLockElement === containerRef.current)
    }
    document.addEventListener('pointerlockchange', onChange)
    return () => document.removeEventListener('pointerlockchange', onChange)
  }, [])

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="w-full h-full cursor-crosshair bg-surface-dark"
>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(new THREE.Color('#f8f9ff'), 1)
        }}
      >
        <Scene />
      </Canvas>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-2 text-xs text-muted-foreground">
        <Move className="w-4 h-4" />
        <span>{locked ? 'WASD to move · Mouse to look · ESC to exit' : 'Click to enter 360° Walkthrough'}</span>
      </div>
    </div>
  )
}
