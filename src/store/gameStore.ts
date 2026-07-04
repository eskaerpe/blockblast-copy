import { create } from 'zustand';
import type { BlockShape } from '../game/types';
import { createEmptyBoard, cloneBoard, canPlaceBlock, placeBlock, findFullLines, clearLines, countClearedCells, isGameOver } from '../game/board';
import { calcPlacementPoints, calcLineClearPoints, calcTotalPoints } from '../game/scoring';
import { ALL_SHAPES, DOCK_SIZE, createBlock } from '../game/constants';
import { loadJSON, saveJSON } from '../utils/storage';

interface GameStore {
  board: ReturnType<typeof createEmptyBoard>;
  dock: BlockShape[];
  score: number;
  hiScore: number;
  combo: number;
  gameOver: boolean;
  lastClearCount: number;
  clearedLines: { rows: number[]; cols: number[] } | null;

  init: () => void;
  restart: () => void;
  tryPlaceBlock: (blockIdx: number, row: number, col: number) => boolean;
  getPlaceablePositions: () => { blockIdx: number; positions: { row: number; col: number }[] }[];
  clearClearedLines: () => void;
}

function generateDock(board: ReturnType<typeof createEmptyBoard>): BlockShape[] {
  const dock: BlockShape[] = [];

  for (let i = 0; i < DOCK_SIZE; i++) {
    for (let attempt = 0; attempt < 50; attempt++) {
      const idx = Math.floor(Math.random() * ALL_SHAPES.length);
      const block = createBlock(idx);

      // Dock fairness: at least one block must be placeable on the board
      if (i === 0) {
        dock.push(block);
        break;
      }

      // For subsequent blocks in the dock, just add them (fairness is checked for the set as a whole)
      dock.push(block);
      break;
    }
  }

  // Fallback: if we exhausted attempts, just push whatever
  while (dock.length < DOCK_SIZE) {
    dock.push(createBlock(Math.floor(Math.random() * ALL_SHAPES.length)));
  }

  return dock;
}

function hasPlaceableBlock(board: ReturnType<typeof createEmptyBoard>, dock: BlockShape[]): boolean {
  return dock.some((block) => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        if (canPlaceBlock(board, block, r, c)) return true;
      }
    }
    return false;
  });
}

function generateFairDock(board: ReturnType<typeof createEmptyBoard>): BlockShape[] {
  for (let attempt = 0; attempt < 100; attempt++) {
    const dock = generateDock(board);
    if (hasPlaceableBlock(board, dock)) return dock;
  }
  // Ultimate fallback: return whatever
  return generateDock(board);
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: createEmptyBoard(),
  dock: [],
  score: 0,
  hiScore: loadJSON('hiscore', 0),
  combo: 1,
  gameOver: false,
  lastClearCount: 0,
  clearedLines: null,

  init: () => {
    const board = createEmptyBoard();
    const dock = generateFairDock(board);
    const hiScore = loadJSON('hiscore', 0);
    set({ board, dock, score: 0, combo: 1, gameOver: false, hiScore, lastClearCount: 0, clearedLines: null });
  },

  restart: () => {
    get().init();
  },

  tryPlaceBlock: (blockIdx: number, row: number, col: number): boolean => {
    const state = get();
    if (state.gameOver) return false;
    if (blockIdx < 0 || blockIdx >= state.dock.length) return false;

    const block = state.dock[blockIdx];
    if (!canPlaceBlock(state.board, block, row, col)) return false;

    // Place block
    const nextBoard = placeBlock(state.board, block, row, col);

    // Find and clear lines
    const lines = findFullLines(nextBoard);
    const clearedBoard = clearLines(nextBoard, lines);
    const lineCount = lines.rows.length + lines.cols.length;
    const cellCount = countClearedCells(nextBoard, lines);

    // Scoring
    const placementPts = calcPlacementPoints(block.cells.length);
    const linePts = lineCount > 0 ? calcLineClearPoints(lineCount, state.combo) : 0;
    const score = state.score + placementPts + linePts;
    const combo = lineCount > 0 ? state.combo + 1 : 1;
    const hiScore = Math.max(state.hiScore, score);
    saveJSON('hiscore', hiScore);

    // Update dock
    const newDock = state.dock.filter((_, i) => i !== blockIdx);

    // Refill dock if empty
    const dock = newDock.length === 0 ? generateFairDock(clearedBoard) : newDock;

    // Check game over
    const gameOver = isGameOver(clearedBoard, dock);

    set({
      board: clearedBoard,
      dock,
      score,
      hiScore,
      combo,
      gameOver,
      lastClearCount: lineCount,
      clearedLines: lineCount > 0 ? lines : null,
    });

    return true;
  },

  clearClearedLines: () => set({ clearedLines: null }),

  getPlaceablePositions: () => {
    const state = get();
    return state.dock.map((block, blockIdx) => {
      const positions: { row: number; col: number }[] = [];
      for (let r = 0; r < state.board.length; r++) {
        for (let c = 0; c < state.board[0].length; c++) {
          if (canPlaceBlock(state.board, block, r, c)) {
            positions.push({ row: r, col: c });
          }
        }
      }
      return { blockIdx, positions };
    });
  },
}));
