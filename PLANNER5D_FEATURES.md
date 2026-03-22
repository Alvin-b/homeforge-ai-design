# Planner 5D Feature Reference & HomeForge Implementation

Based on research of [Planner 5D](https://planner5d.com/), here's the feature mapping.

## Core Features

| Planner 5D Feature | HomeForge Status |
|--------------------|------------------|
| 2D Floor Plan | ✅ Draw walls, rooms, doors, windows, stairs |
| 3D View | ✅ Orbit, zoom, pan |
| 360° Walkthrough | ✅ First-person mode (WASD + mouse look) |
| 4K Renders | ✅ Export current view as PNG |
| Furniture Library (8K+) | ✅ 38 items, 10 categories |
| Room Tool | ✅ Draw room by two corners |
| Door/Window on walls | ✅ Click wall to add |
| Stairs | ✅ Click to place, drag to move |
| Measurement Tool | ✅ Click two points for distance |
| Project Save/Load | ✅ localStorage, Share link |
| My Projects | ✅ Dashboard with project list |
| Templates | ✅ Blank, Living Room, Bedroom, Kitchen |
| Floor/Wall materials | ✅ Room properties: floor color, wall color |

## AI Features

| Planner 5D Feature | HomeForge Status |
|--------------------|------------------|
| Smart Wizard | ✅ Room shape → type → style → auto-furnish |
| AI Design Generator | ✅ Upload photo UI (placeholder - no backend) |
| AI Floor Plan Recognition | ⏳ Not implemented |
| Virtual staging | ⏳ Not implemented |

## Advanced

| Planner 5D Feature | HomeForge Status |
|--------------------|------------------|
| Mood boards | ✅ Collect inspiration images (localStorage) |
| Shopping list / Budget widget | ✅ Cost estimates from furniture |
| Import 3D models | ⏳ Not implemented |
| Export to CAD | ⏳ Not implemented |
| AR/VR | ⏳ Not implemented |
| Cross-device sync | ✅ localStorage (single device) |

## How to Use HomeForge

1. **2D**: Draw walls (W), rooms (R - two clicks), doors (D), windows (N). Alt+drag to pan.
2. **3D**: Switch view, orbit with mouse.
3. **360° Walkthrough**: Click 360° tab, then click canvas to enter. WASD to move, mouse to look, ESC to exit.
4. **Smart Wizard**: Wand icon → pick shape, room type, style → Generate.
5. **AI Design**: Sparkles icon → upload photo → Generate (UI only).
6. **Render**: Switch to Render → Export 4K Image.
