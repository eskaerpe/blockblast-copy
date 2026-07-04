# Decisions Log

Architecture and design decisions for the TechBlast Clone project.

---

## Tech Stack

| Decision | Rationale |
|---|---|
| **React + TypeScript** | Component-based UI, type-safe game state, good drag-drop ecosystem |
| **Vite** | Fast builds, small bundles, sub-second dev startup |
| **Tailwind CSS** | Utility-first, rapid mobile-first responsive layout |
| **@dnd-kit** | Best React DnD library for touch+mouse, supports activation constraints |
| **Zustand** | Lightweight state management, no boilerplate, great TS support |
| **Vitest** | Fast unit testing, Vite-native, compatible with TS path aliases |

---

## PRD Open Questions (resolved 2026-07-04)

| # | Decision | Reasoning |
|---|---|---|
| 1 | **Dock fairness: YES** | Before committing a new dock set, verify at least one block has a valid placement. Regenerate if not. Prevents "unfair" game-overs. |
| 2 | **Flat difficulty: no curve** | Block weighting stays constant for the whole session. Keeps the game predictable and casual — players improve, the game doesn't escalate. |
| 3 | **Combo resets immediately** | A single non-clearing placement drops the combo multiplier back to 1. Rewards consistent clearing chains. |
| 4 | **Keyboard a11y → fast-follow** | Not hard v1. Mouse/touch drag-and-drop is the primary interaction for launch. Keyboard operability ships in v1.1. |
| 5 | **No analytics in v1** | Fully offline, no network calls after initial load. Analytics deferred to v2 if needed. |

---

## Architecture Decisions

| Decision | Details |
|---|---|
| **Single Zustand store** | One `useGameStore` handles board, dock, score, combo, game-over. LocalStorage sync via Zustand middleware. |
| **Shape constants in static file** | All block shapes, colors, scoring values in `src/game/constants.ts`. Not procedurally generated. |
| **Board state as `(0 \| string)[]`** | Each cell is `0` (empty) or a color key. Board is an 8×8 flat array (`board[row * 8 + col]`). |
| **Placement validation is pure function** | `canPlaceBlock(board, block, row, col)` is pure — easy to test, easy to call from DnD handlers and game-over checks. |
| **CSS transitions for clear anim** | Line-clear animation via CSS transitions on cell background, not JS-driven keyframes, for GPU performance. |
| **Web Audio API for sound** | Lightweight, no external library, fully offline. Short audio buffers for placement, line-clear, game-over. |
| **localStorage fallback** | Wrapped in try/catch — if any write fails, the game continues with in-memory state only. No crashes. |
