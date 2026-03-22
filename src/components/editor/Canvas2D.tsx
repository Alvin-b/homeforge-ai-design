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

  // ✅ Measurement states
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null)
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null)

  // ✅ Panning states
  const [isPanning, setIsPanning] = useState(false)
  const lastPanRef = useRef({ x: 0, y: 0 })

  const {
    activeTool, walls, placedItems, selectedId, doors, windows, rooms, stairs,
    snapToGrid, gridSize, zoom,
    addWall, addRoom, addDoor, addWindow, addStair, updateStair,
    setSelected, updateItem,
  } = useEditorStore()

  useEffect(() => {
    if (activeTool !== 'room') setRoomStart(null)
    if (activeTool !== 'measure') {
      setMeasureStart(null)
      setMeasureEnd(null)
    }
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

  const snap = (val: number) =>
    snapToGrid ? Math.round(val / gridSize) * gridSize : val

  const handleMouseDown = useCallback((e: any) => {
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    if (!pos) return

    const x = snap((pos.x - stagePos.x) / zoom)
    const y = snap((pos.y - stagePos.y) / zoom)

    // PAN
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

          addRoom({
            id: uuidv4(),
            name: 'Room',
            type: 'living',
            points: [
              { x: x1, y: y1 },
              { x: x1 + w, y: y1 },
              { x: x1 + w, y: y1 + h },
              { x: x1, y: y1 + h }
            ],
            floorColor: '#f3f4f6',
            wallColor: '#e5e7eb',
            ceilingHeight: 2.7
          })
        }

        setRoomStart(null)
      }

    } else if (activeTool === 'measure') {
      if (!measureStart) setMeasureStart({ x, y })
      else if (!measureEnd) setMeasureEnd({ x, y })
      else {
        setMeasureStart({ x, y })
        setMeasureEnd(null)
      }

    } else if (activeTool === 'stairs') {
      addStair({ id: uuidv4(), x, y, width: 1.2, depth: 2.5, direction: 0 })

    } else if (activeTool === 'select') {
      if (e.target === stage || e.target.attrs?.name === 'grid') {
        setSelected(null)
      }
    }
  }, [activeTool, zoom, stagePos, roomStart, measureStart, measureEnd])

  const handleMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage()
    const pos = stage?.getPointerPosition()
    if (!pos) return

    if (isPanning) {
      setStagePos((p) => ({
        x: p.x + (pos.x - lastPanRef.current.x),
        y: p.y + (pos.y - lastPanRef.current.y),
      }))
      lastPanRef.current = pos
      return
    }

    const x = snap((pos.x - stagePos.x) / zoom)
    const y = snap((pos.y - stagePos.y) / zoom)
    setMousePos({ x, y })

  }, [isPanning, zoom, stagePos])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)

    if (activeTool === 'wall' && isDrawing && drawStart) {
      const dx = mousePos.x - drawStart.x
      const dy = mousePos.y - drawStart.y
      const length = Math.sqrt(dx * dx + dy * dy)

      if (length > 10) {
        addWall({
          id: uuidv4(),
          x1: drawStart.x,
          y1: drawStart.y,
          x2: mousePos.x,
          y2: mousePos.y,
          thickness: 8,
          color: '#374151',
          height: 2.7,
        })
      }

      setIsDrawing(false)
      setDrawStart(null)
    }
  }, [activeTool, isDrawing, drawStart, mousePos])

  return (
    <div ref={containerRef} className="w-full h-full bg-white relative">
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
      >
        <Layer>
          {/* Drawing preview */}
          {isDrawing && drawStart && (
            <Line
              points={[drawStart.x, drawStart.y, mousePos.x, mousePos.y]}
              stroke="#3b82f6"
              strokeWidth={8}
              dash={[10, 5]}
            />
          )}

          {/* Measure tool */}
          {measureStart && (
            <Line
              points={
                measureEnd
                  ? [measureStart.x, measureStart.y, measureEnd.x, measureEnd.y]
                  : [measureStart.x, measureStart.y, mousePos.x, mousePos.y]
              }
              stroke="#10b981"
              strokeWidth={2}
              dash={[6, 4]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}