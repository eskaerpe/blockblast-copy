# Tasks

Status: ⬜ pending | 🚧 in progress | ✅ done

---

## Phase 1 — Foundation

- [x] Scaffold Vite + React + TypeScript + Tailwind
- [x] Install Zustand, @dnd-kit, Vitest
- [x] Define game constants (`src/game/constants.ts`)
- [x] localStorage wrapper with fallback handling
- [x] Error boundary component
- [x] Dark/light theme system (CSS variables + Tailwind `dark` class)

## Phase 2 — Core Board & Logic

- [x] Board grid type + Zustand store
- [x] Static polyomino shape definitions
- [x] Placement validator (`canPlaceBlock`)
- [x] `canPlaceBlock()` for game-over + dock fairness checks
- [x] Line clearing (rows + columns, simultaneous)
- [x] Scoring engine (cell points + line-clear bonus × combo)
- [x] Combo tracking (reset on non-clear)
- [x] Game-over detection
- [x] Unit tests: placement, clearing, scoring, game-over (24 tests passing)

## Phase 3 — Dock & Block Generation

- [x] Dock component (3 blocks)
- [x] Weighted random block generator
- [x] Dock fairness check (at least one block is placeable)
- [x] Dock refresh on all-3-placed
- [x] Edge case: board truly full

## Phase 4 — Drag & Drop

- [x] @dnd-kit DndContext + mouse + touch sensors
- [x] Dock blocks as `useDraggable`
- [x] Board cells as `useDroppable`
- [x] Drag overlay (block shape follows pointer)
- [x] Hover preview (valid/invalid highlight)
- [x] Invalid drop → block returns to dock

## Phase 5 — Game Flow & UI

- [x] Game-over overlay (final score, hi-score, restart)
- [x] Restart action
- [x] Settings panel (theme toggle, audio toggle)
- [x] Persist theme, audio, hi-score to localStorage
- [x] Responsive layout (mobile-first portrait)

## Phase 6 — Polish

- [x] CSS transitions: placement flash, line-clear animation (transition-based, no keyframes)
- [x] Sound effects (Web Audio API: place, clear, combo, game-over)
- [x] Viewport handling (100dvh, safe-area-inset)
- [x] Animation audit: switch to CSS transitions, gated hover, prefers-reduced-motion, explicit easings
- [x] Visual design: dark sci-fi palette, custom easing curves, cohesive motion personality
- [ ] Cross-browser smoke test (user to verify)
