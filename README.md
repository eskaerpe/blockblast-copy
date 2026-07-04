# TechBlast

A casual, client-side puzzle game inspired by Block Blast. Drag polyomino blocks onto an 8x8 grid, fill rows and columns to clear them, and chase high scores. No accounts, no servers, fully offline.

## Play

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — the game loads instantly and is ready to play.

## How to Play

1. Drag a block from the dock onto the board.
2. Place it anywhere its shape fits — green highlight means valid, red means it won't fit.
3. Fill an entire row or column to clear it and score bonus points.
4. Clear lines on consecutive placements to build a combo multiplier.
5. The game ends when none of the 3 blocks in the dock can be placed.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 |
| State | Zustand 5 |
| Drag & Drop | @dnd-kit/core 6 |
| Testing | Vitest 3 |

## Project Structure

```
src/
├── game/
│   ├── board.ts          # Board logic: placement, clearing, game-over
│   ├── board.test.ts     # Board unit tests
│   ├── scoring.ts        # Scoring engine with combo multiplier
│   ├── scoring.test.ts   # Scoring unit tests
│   ├── constants.ts      # Shapes, colors, board size, scoring values
│   └── types.ts          # Shared TypeScript types
├── store/
│   ├── gameStore.ts      # Zustand game state (board, dock, score, combo)
│   └── themeStore.ts     # Theme & audio preferences
├── components/
│   ├── Game.tsx          # Main game: DndContext + score header + layout
│   ├── Board.tsx         # 8x8 grid with droppable cells
│   ├── Dock.tsx          # 3 draggable blocks
│   ├── BlockOverlay.tsx  # Drag preview overlay
│   ├── GameOver.tsx      # Game-over modal with scores
│   ├── Settings.tsx      # Theme & audio toggles
│   └── ErrorBoundary.tsx # Application error boundary
├── hooks/
│   └── useSound.ts       # Web Audio API sound effects
├── utils/
│   └── storage.ts        # localStorage wrapper with fallback
├── main.tsx
└── index.css
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm test` | Run all unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Features

- **30 block shapes** — 32 polyomino variants from 1-cell dots to 5-cell L/T/Z/U shapes
- **Dock fairness** — block generation ensures at least one block is always placeable
- **Combo system** — consecutive line clears multiply the bonus (resets on non-clear)
- **Dark/light theme** — persisted in localStorage, respects system preference
- **Sound effects** — synthesized via Web Audio API (toggle on/off)
- **Mobile-first** — touch drag with activation delay, safe area insets, 100dvh viewport
- **Fully offline** — no network calls after initial page load
- **Error boundary** — isolated failures never blank the screen

## Design Decisions

See [DECISIONS.md](DECISIONS.md) for the full architecture log, including answers to all PRD open questions.

## License

MIT
