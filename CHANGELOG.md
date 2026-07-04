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
- Hover preview with valid/invalid cell highlighting (separate overlay layer)
- Real cursor-to-grid coordinate tracking via clientX/Y + delta accumulation
- Dock fairness: generation ensures at least one block is always placeable
- Game-over detection and restart flow
- Dark/light theme toggle (persisted via localStorage)
- Sound effects via Web Audio API (placement, clear, combo, game-over)
- Transition-based line-clear animation (interruptible, GPU-only, under 300ms)
- Combo pop animation with custom easings
- Mobile-first responsive layout with safe area insets
- localStorage wrapper with graceful degradation
- Error boundary for isolated failure handling
- 29 unit tests for board logic and scoring engine (including E2E row-clear tests)

### Fixed
- Row/col swap in drag coordinate parsing
- Drag preview ghosting (preview trails persisting after drag end)
- State-view desync after line clear (board version key for forced remount)
- Drag overlay sizing mismatch (dock-scale vs board-scale on drag start)
- Cursor pivot offset (block now centers on cursor via anchor offset)
- Hover animations gated for touch devices (no hover on tap)
- `prefers-reduced-motion` support
- Button hover transitions use explicit `ease-out` custom curves
