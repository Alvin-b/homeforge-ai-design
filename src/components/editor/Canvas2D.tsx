import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Stage, Layer, Line, Rect, Text, Group, Circle } from 'react-konva'
import { useEditorStore } from '@/store/useEditorStore'
import { v4 as uuidv4 } from 'uuid'

const SCALE = 50 // pixels per meter

export default function Canvas2D() {
  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [roomStart, setRoomStart] = useState<{ x: number; y: number } | null>(null)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  
  const [isPanning, setIsPanning] = useState(false)
  const lastPanRef = useRef({ x: 0, y: 0 })

  const {
    activeTool, walls, placedItems, selectedId, doors, windows, rooms,
    snapToGrid, gridSize, zoom,
    addWall, addRoom, addDoor, addWindow, setSelected, updateItem,
  } = useEditorStore()

  useEffect(() => {
    if (activeTool !== 'room') setRoomStart(null)
  }, [activeTool])

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const snap = (val: number) => snapToGrid ? Math.round(val / gridSize) * gridSize : val

  const handleMouseDown = useCallback((e: any) => {
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    if (!pos) return
    const x = snap(pos.x / zoom - stagePos.x / zoom)
    const y = snap(pos.y / zoom - stagePos.y / zoom)

    if (e.evt.button === 1 || (e.evt.button === 0 && e.evt.altKey)) {
      setIsPanning(true)
      lastPanRef.current = { x: pos.x, y: pos.y }
      return
    }

    if (activeTool === 'wall') {
      setIsDrawing(true)
      setDrawStart({ x, y })
    } else if (activeTool === 'room') {
      if (!roomStart) {
        setRoomStart({ x, y })
      } else {
        const w = Math.abs(x - roomStart.x)
        const h = Math.abs(y - roomStart.y)
        if (w > 20 && h > 20) {
          const x1 = Math.min(roomStart.x, x)
          const y1 = Math.min(roomStart.y, y)
          const wallT = 8
          addWall({ id: uuidv4(), x1, y1, x2: x1 + w, y2: y1, thickness: wallT, color: '#374151', height: 2.7 })
          addWall({ id: uuidv4(), x1: x1 + w, y1, x2: x1 + w, y2: y1 + h, thickness: wallT, color: '#374151', height: 2.7 })
          addWall({ id: uuidv4(), x1: x1 + w, y1: y1 + h, x2: x1, y2: y1 + h, thickness: wallT, color: '#374151', height: 2.7 })
          addWall({ id: uuidv4(), x1, y1: y1 + h, x2: x1, y2: y1, thickness: wallT, color: '#374151', height: 2.7 })
          addRoom({ id: uuidv4(), name: 'Room', type: 'living', points: [{ x: x1, y: y1 }, { x: x1 + w, y: y1 }, { x: x1 + w, y: y1 + h }, { x: x1, y: y1 + h }], floorColor: '#f3f4f6', wallColor: '#e5e7eb', ceilingHeight: 2.7 })
        }
        setRoomStart(null)
      }
    } else if (activeTool === 'door' || activeTool === 'window') {
      const hitWall = walls.find((wall) => {
        const dx = wall.x2 - wall.x1
        const dy = wall.y2 - wall.y1
        const len = Math.sqrt(dx * dx + dy * dy)
        const nx = -dy / len
        const ny = dx / len
        const dist = Math.abs((x - wall.x1) * nx + (y - wall.y1) * ny)
        const along = ((x - wall.x1) * dx + (y - wall.y1) * dy) / (len * len)
        return dist < 15 && along >= 0 && along <= 1
      })
      if (hitWall) {
        const posAlong = 0.5
        if (activeTool === 'door') {
          addDoor({ id: uuidv4(), wallId: hitWall.id, position: posAlong, width: 0.9, opensInward: true })
        } else {
          addWindow({ id: uuidv4(), wallId: hitWall.id, position: posAlong, width: 1.2, sillHeight: 1.0 })
        }
      }
    } else if (activeTool === 'select') {
      if (e.target === stage || e.target.attrs?.name === 'grid') {
        setSelected(null)
      }
    }
  }, [activeTool, zoom, snapToGrid, gridSize, roomStart, walls, addWall, addRoom, addDoor, addWindow, setSelected, stagePos])

  const handleMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage()
    const pos = stage?.getPointerPosition()
    if (!pos) return

    if (isPanning) {
      setStagePos((p) => ({
        x: p.x + (pos.x - lastPanRef.current.x),
        y: p.y + (pos.y - lastPanRef.current.y),
      }))
      lastPanRef.current = { x: pos.x, y: pos.y }
      return
    }

    const x = snap((pos.x - stagePos.x) / zoom)
    const y = snap((pos.y - stagePos.y) / zoom)
    setMousePos({ x, y })
  }, [zoom, snapToGrid, gridSize, isPanning, stagePos])

  const handleMouseUp = useCallback((e: any) => {
    if (e.evt?.button === 1 || (e.evt?.button === 0 && e.evt?.altKey)) {
      setIsPanning(false)
    }
    if (activeTool === 'wall' && isDrawing && drawStart) {
      const dx = mousePos.x - drawStart.x
      const dy = mousePos.y - drawStart.y
      const length = Math.sqrt(dx * dx + dy * dy)

      if (length > 10) {
        addWall({
          id: uuidv4(),
          x1: drawStart.x, y1: drawStart.y,
          x2: mousePos.x, y2: mousePos.y,
          thickness: 8,
          color: '#374151',
          height: 2.7,
        })
      }
      setIsDrawing(false)
      setDrawStart(null)
    }
  }, [activeTool, isDrawing, drawStart, mousePos])

  // Grid lines
  const gridLines: React.ReactNode[] = []
  const W = stageSize.width / zoom + 200
  const H = stageSize.height / zoom + 200
  for (let x = 0; x < W; x += gridSize) {
    gridLines.push(
      <Line key={`gv-${x}`} points={[x, 0, x, H]} stroke="#e5e7eb" strokeWidth={0.5} name="grid" />
    )
  }
  for (let y = 0; y < H; y += gridSize) {
    gridLines.push(
      <Line key={`gh-${y}`} points={[0, y, W, y]} stroke="#e5e7eb" strokeWidth={0.5} name="grid" />
    )
  }

  const wallLength = isDrawing && drawStart
    ? (Math.sqrt(Math.pow(mousePos.x - drawStart.x, 2) + Math.pow(mousePos.y - drawStart.y, 2)) / SCALE).toFixed(2)
    : null

  return (
    <div ref={containerRef} className="w-full h-full bg-white relative cursor-crosshair">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={stagePos.x}
        y={stagePos.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsPanning(false)}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Grid */}
        <Layer listening={false}>{gridLines}</Layer>

        {/* Room fills */}
        {rooms.map((room) =>
          room.points.length >= 3 ? (
            <Line
              key={room.id}
              points={room.points.flatMap((p) => [p.x, p.y])}
              closed
              fill={room.floorColor}
              stroke="transparent"
              listening={false}
            />
          ) : null
        )}

        {/* Walls */}
        <Layer>
          {walls.map((wall) => {
            const isSelected = selectedId === wall.id
            return (
              <Group key={wall.id}>
                <Line
                  points={[wall.x1, wall.y1, wall.x2, wall.y2]}
                  stroke={isSelected ? '#3b82f6' : wall.color}
                  strokeWidth={wall.thickness}
                  lineCap="round"
                  hitStrokeWidth={16}
                  onClick={() => setSelected(wall.id)}
                  onTap={() => setSelected(wall.id)}
                />
                {isSelected && (
                  <>
                    <Circle x={wall.x1} y={wall.y1} radius={5} fill="#3b82f6" />
                    <Circle x={wall.x2} y={wall.y2} radius={5} fill="#3b82f6" />
                  </>
                )}
                {/* Length label */}
                <Text
                  x={(wall.x1 + wall.x2) / 2 - 20}
                  y={(wall.y1 + wall.y2) / 2 - 18}
                  text={`${(Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)) / SCALE).toFixed(1)}m`}
                  fontSize={11}
                  fill="#6b7280"
                  fontFamily="Inter"
                />
              </Group>
            )
          })}

          {/* Doors */}
          {doors.map((door) => {
            const wall = walls.find((w) => w.id === door.wallId)
            if (!wall) return null
            const dx = wall.x2 - wall.x1
            const dy = wall.y2 - wall.y1
            const px = wall.x1 + dx * door.position
            const py = wall.y1 + dy * door.position
            const perp = Math.atan2(-dx, dy)
            const doorW = door.width * SCALE
            return (
              <Group key={door.id}>
                <Rect
                  x={px}
                  y={py}
                  width={doorW}
                  height={8}
                  offsetX={doorW / 2}
                  offsetY={4}
                  rotation={(perp * 180) / Math.PI}
                  fill="#8B4513"
                  stroke="#5D3A1A"
                  strokeWidth={1}
                />
              </Group>
            )
          })}

          {/* Windows */}
          {windows.map((win) => {
            const wall = walls.find((w) => w.id === win.wallId)
            if (!wall) return null
            const dx = wall.x2 - wall.x1
            const dy = wall.y2 - wall.y1
            const px = wall.x1 + dx * win.position
            const py = wall.y1 + dy * win.position
            const perp = Math.atan2(-dx, dy)
            const winW = win.width * SCALE
            return (
              <Group key={win.id}>
                <Rect
                  x={px}
                  y={py}
                  width={winW}
                  height={6}
                  offsetX={winW / 2}
                  offsetY={3}
                  rotation={(perp * 180) / Math.PI}
                  fill="#87CEEB"
                  stroke="#5F9EA0"
                  strokeWidth={1}
                />
              </Group>
            )
          })}

          {/* Live drawing preview */}
          {isDrawing && drawStart && (
            <>
              <Line
                points={[drawStart.x, drawStart.y, mousePos.x, mousePos.y]}
                stroke="#3b82f6"
                strokeWidth={8}
                lineCap="round"
                dash={[12, 6]}
              />
              <Circle x={drawStart.x} y={drawStart.y} radius={4} fill="#3b82f6" />
              <Circle x={mousePos.x} y={mousePos.y} radius={4} fill="#3b82f6" />
            </>
          )}

          {/* Room preview */}
          {activeTool === 'room' && roomStart && (
            <>
              <Line
                points={[roomStart.x, roomStart.y, mousePos.x, roomStart.y, mousePos.x, mousePos.y, roomStart.x, mousePos.y, roomStart.x, roomStart.y]}
                stroke="#3b82f6"
                strokeWidth={2}
                dash={[8, 4]}
                closed
              />
              <Circle x={roomStart.x} y={roomStart.y} radius={4} fill="#3b82f6" />
            </>
          )}
        </Layer>

        {/* Placed Items */}
        <Layer>
          {placedItems.map((item) => {
            const isSelected = selectedId === item.id
            const pixelW = item.width * SCALE
            const pixelH = (item.depth ?? item.height) * SCALE
            return (
              <Group
                key={item.id}
                x={item.x}
                y={item.y}
                rotation={item.rotation}
                draggable={activeTool === 'select'}
                onClick={() => setSelected(item.id)}
                onTap={() => setSelected(item.id)}
                onDragEnd={(e) => {
                  updateItem(item.id, {
                    x: snap(e.target.x()),
                    y: snap(e.target.y()),
                  })
                }}
              >
                <Rect
                  width={pixelW}
                  height={pixelH}
                  offsetX={pixelW / 2}
                  offsetY={pixelH / 2}
                  fill={isSelected ? '#dbeafe' : '#f3f4f6'}
                  stroke={isSelected ? '#3b82f6' : '#d1d5db'}
                  strokeWidth={isSelected ? 2 : 1}
                  cornerRadius={4}
                />
                <Text
                  text={item.emoji}
                  fontSize={Math.min(pixelW, pixelH) * 0.5}
                  width={pixelW}
                  height={pixelH}
                  offsetX={pixelW / 2}
                  offsetY={pixelH / 2}
                  align="center"
                  verticalAlign="middle"
                />
                <Text
                  text={item.name}
                  fontSize={9}
                  fill="#6b7280"
                  width={pixelW}
                  offsetX={pixelW / 2}
                  y={pixelH / 2 + 4}
                  align="center"
                  fontFamily="Inter"
                />
              </Group>
            )
          })}
        </Layer>
      </Stage>

      {/* Pan hint */}
      <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground pointer-events-none">
        Alt + drag to pan · Room: click two corners
      </div>

      {/* Measurement tooltip */}
      {wallLength && (
        <div
          className="absolute pointer-events-none bg-primary text-primary-foreground text-xs font-mono px-2 py-1 rounded-md shadow-lg"
          style={{
            left: mousePos.x * zoom + 16,
            top: mousePos.y * zoom - 8,
          }}
        >
          {wallLength}m
        </div>
      )}
    </div>
  )
}
