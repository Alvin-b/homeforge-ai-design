# Planner 5D Feature Reference & HomeForge Implementation

Based on research of [Planner 5D](https://planner5d.com/), here's the feature mapping.

## Core Features

| Planner 5D Feature | HomeForge Status |
|--------------------|------------------|
| 2D Floor Plan | ✅ Draw walls, rooms, doors, windows |
| 3D View | ✅ Orbit, zoom, pan |
| 360° Walkthrough | ✅ First-person mode (WASD + mouse look) |
| 4K Renders | ✅ Export current view as PNG |
| Furniture Library (8K+) | ✅ 38 items, 10 categories |
| Room Tool | ✅ Draw room by two corners |
| Door/Window on walls | ✅ Click wall to add |
| Project Save/Load | ✅ localStorage, Share link |
| Templates | 🔶 Smart Wizard generates rooms |
| Floor/Ceiling/Wall materials | ⏳ Partial (room floor color) |

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
| Mood boards | ⏳ Not implemented |
| Shopping list / Budget widget | ⏳ Not implemented |
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
