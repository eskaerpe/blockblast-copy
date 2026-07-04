# Changelog

All notable changes to the TechBlast Clone project.

---

## [Unreleased]

### Added
- Project scaffold: Vite, React 19, TypeScript, Tailwind CSS
- 32 polyomino block shapes with random weighted generation
- 8x8 board with simultaneous row + column clearing
- Scoring engine with combo multiplier system
- Drag-and-drop via @dnd-kit (mouse + touch with activation threshold)
- Hover preview with valid/invalid cell highlighting
- Dock fairness: generation ensures at least one block is always placeable
- Game-over detection and restart flow
- Dark/light theme toggle (persisted via localStorage)
- Sound effects via Web Audio API (placement, clear, combo, game-over)
- Line-clear cell animation and combo pop animation
- Mobile-first responsive layout with safe area insets
- localStorage wrapper with graceful degradation
- Error boundary for isolated failure handling
- 24 unit tests for board logic and scoring engine
