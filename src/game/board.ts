import type { Board, BlockShape } from './types';
import { BOARD_SIZE } from './constants';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function canPlaceBlock(board: Board, block: BlockShape, row: number, col: number): boolean {
  for (const cell of block.cells) {
    const r = row + cell.row;
    const c = col + cell.col;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
    if (board[r][c] !== 0) return false;
  }
  return true;
}

export function placeBlock(board: Board, block: BlockShape, row: number, col: number): Board {
  const next = cloneBoard(board);
  for (const cell of block.cells) {
    next[row + cell.row][col + cell.col] = block.color;
  }
  return next;
}

export function findFullLines(board: Board): { rows: number[]; cols: number[] } {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every((cell) => cell !== 0)) rows.push(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    if (board.every((row) => row[c] !== 0)) cols.push(c);
  }

  return { rows, cols };
}

export function clearLines(board: Board, lines: { rows: number[]; cols: number[] }): Board {
  const next = cloneBoard(board);
  for (const r of lines.rows) {
    for (let c = 0; c < BOARD_SIZE; c++) next[r][c] = 0;
  }
  for (const c of lines.cols) {
    for (let r = 0; r < BOARD_SIZE; r++) next[r][c] = 0;
  }
  return next;
}

export function countClearedCells(board: Board, lines: { rows: number[]; cols: number[] }): number {
  const cells = new Set<string>();
  for (const r of lines.rows) {
    for (let c = 0; c < BOARD_SIZE; c++) cells.add(`${r},${c}`);
  }
  for (const c of lines.cols) {
    for (let r = 0; r < BOARD_SIZE; r++) cells.add(`${r},${c}`);
  }
  return cells.size;
}

export function anyPlacementExists(board: Board, block: BlockShape): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canPlaceBlock(board, block, r, c)) return true;
    }
  }
  return false;
}

export function isGameOver(board: Board, dock: BlockShape[]): boolean {
  return dock.length > 0 && dock.every((block) => !anyPlacementExists(board, block));
}
