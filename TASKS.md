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

- [ ] Dock component (3 blocks)
- [ ] Weighted random block generator
- [ ] Dock fairness check (at least one block is placeable)
- [ ] Dock refresh on all-3-placed
- [ ] Edge case: board truly full

## Phase 4 — Drag & Drop

- [ ] @dnd-kit DndContext + mouse + touch sensors
- [ ] Dock blocks as `useDraggable`
- [ ] Board cells as `useDroppable`
- [ ] Drag overlay (block shape follows pointer)
- [ ] Hover preview (valid/invalid highlight)
- [ ] Invalid drop → block returns to dock

## Phase 5 — Game Flow & UI

- [ ] Game-over overlay (final score, hi-score, restart)
- [ ] Restart action
- [ ] Settings panel (theme toggle, audio toggle)
- [ ] Persist theme, audio, hi-score to localStorage
- [ ] Responsive layout (mobile-first portrait)

## Phase 6 — Polish

- [ ] CSS transitions: placement flash, line-clear animation
- [ ] Sound effects (Web Audio API)
- [ ] Viewport handling (mobile address bar resize)
- [ ] Performance: `chrome-devtools` trace (60fps drag)
- [ ] Mobile viewport testing via `chrome-devtools`
- [ ] Animation audit via `review-animations` skill
- [ ] Visual design review via `frontend-design` skill
- [ ] Cross-browser smoke test
