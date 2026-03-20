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

  const {
    activeTool, walls, placedItems, selectedId,
    snapToGrid, gridSize, zoom,
    addWall, setSelected, updateItem,
  } = useEditorStore()

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
    const x = snap(pos.x / zoom)
    const y = snap(pos.y / zoom)

    if (activeTool === 'wall') {
      setIsDrawing(true)
      setDrawStart({ x, y })
    } else if (activeTool === 'select') {
      // Clicked on empty space
      if (e.target === stage || e.target.attrs?.name === 'grid') {
        setSelected(null)
      }
    }
  }, [activeTool, zoom, snapToGrid, gridSize])

  const handleMouseMove = useCallback((e: any) => {
    const pos = e.target.getStage()?.getPointerPosition()
    if (!pos) return
    setMousePos({ x: snap(pos.x / zoom), y: snap(pos.y / zoom) })
  }, [zoom, snapToGrid, gridSize])

  const handleMouseUp = useCallback(() => {
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Grid */}
        <Layer listening={false}>{gridLines}</Layer>

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
        </Layer>

        {/* Placed Items */}
        <Layer>
          {placedItems.map((item) => {
            const isSelected = selectedId === item.id
            const pixelW = item.width * SCALE
            const pixelH = item.height * SCALE
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
