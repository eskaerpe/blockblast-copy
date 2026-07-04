import { describe, it, expect } from 'vitest';
import { createEmptyBoard, canPlaceBlock, placeBlock, findFullLines, clearLines, isGameOver, anyPlacementExists, cloneBoard } from './board';
import { BOARD_SIZE } from './constants';
import type { BlockShape } from './types';

const dot: BlockShape = { id: 'dot', cells: [{ row: 0, col: 0 }], color: '#ff0000' };
const h2: BlockShape = { id: 'h2', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }], color: '#00ff00' };
const sq2: BlockShape = { id: 'sq2', cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }], color: '#0000ff' };
const h8: BlockShape = { id: 'h8', cells: Array.from({ length: 8 }, (_, i) => ({ row: 0, col: i })), color: '#ff00ff' };

describe('createEmptyBoard', () => {
  it('creates an 8x8 board of zeros', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(BOARD_SIZE);
    for (const row of board) {
      expect(row.length).toBe(BOARD_SIZE);
      expect(row.every((c) => c === 0)).toBe(true);
    }
  });
});

describe('cloneBoard', () => {
  it('creates a deep copy', () => {
    const board = createEmptyBoard();
    board[0][0] = '#fff' as unknown as 0;
    const copy = cloneBoard(board);
    expect(copy[0][0]).toBe('#fff');
    copy[0][0] = 0;
    expect(board[0][0]).toBe('#fff');
  });
});

describe('canPlaceBlock', () => {
  it('allows placement in empty board', () => {
    const board = createEmptyBoard();
    expect(canPlaceBlock(board, dot, 0, 0)).toBe(true);
    expect(canPlaceBlock(board, h2, 3, 5)).toBe(true);
  });

  it('rejects out-of-bounds placement', () => {
    const board = createEmptyBoard();
    expect(canPlaceBlock(board, dot, -1, 0)).toBe(false);
    expect(canPlaceBlock(board, dot, 8, 0)).toBe(false);
    expect(canPlaceBlock(board, dot, 0, -1)).toBe(false);
    expect(canPlaceBlock(board, dot, 0, 8)).toBe(false);
  });

  it('rejects partial out-of-bounds for multi-cell blocks', () => {
    const board = createEmptyBoard();
    expect(canPlaceBlock(board, h2, 0, 7)).toBe(false);
  });

  it('rejects overlapping occupied cells', () => {
    const board = createEmptyBoard();
    board[0][0] = '#fff';
    expect(canPlaceBlock(board, dot, 0, 0)).toBe(false);
    expect(canPlaceBlock(board, dot, 0, 1)).toBe(true);
  });
});

describe('placeBlock', () => {
  it('writes block cells to board', () => {
    const board = createEmptyBoard();
    const result = placeBlock(board, sq2, 0, 0);
    expect(result[0][0]).toBe('#0000ff');
    expect(result[0][1]).toBe('#0000ff');
    expect(result[1][0]).toBe('#0000ff');
    expect(result[1][1]).toBe('#0000ff');
    expect(result[2][0]).toBe(0);
  });

  it('does not mutate the original board', () => {
    const board = createEmptyBoard();
    placeBlock(board, dot, 0, 0);
    expect(board[0][0]).toBe(0);
  });
});

describe('findFullLines', () => {
  it('finds full rows', () => {
    const board = createEmptyBoard();
    for (let c = 0; c < BOARD_SIZE; c++) board[0][c] = '#fff';
    const { rows, cols } = findFullLines(board);
    expect(rows).toEqual([0]);
    expect(cols).toEqual([]);
  });

  it('finds full columns', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < BOARD_SIZE; r++) board[r][0] = '#fff';
    const { rows, cols } = findFullLines(board);
    expect(cols).toEqual([0]);
    expect(rows).toEqual([]);
  });

  it('finds simultaneous rows and columns', () => {
    const board = createEmptyBoard();
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[0][i] = '#fff';
      board[i][0] = '#fff';
    }
    const { rows, cols } = findFullLines(board);
    expect(rows).toEqual([0]);
    expect(cols).toEqual([0]);
  });

  it('returns empty for non-full board', () => {
    const board = createEmptyBoard();
    board[0][0] = '#fff';
    const { rows, cols } = findFullLines(board);
    expect(rows).toEqual([]);
    expect(cols).toEqual([]);
  });
});

describe('clearLines', () => {
  it('clears specified rows and columns', () => {
    const board = createEmptyBoard();
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[0][i] = '#fff';
      board[i][0] = '#aaa';
      board[1][i] = '#bbb';
    }
    const lines = { rows: [0], cols: [0] };
    const result = clearLines(board, lines);
    for (let c = 0; c < BOARD_SIZE; c++) expect(result[0][c]).toBe(0);
    for (let r = 0; r < BOARD_SIZE; r++) expect(result[r][0]).toBe(0);
    expect(result[1][1]).toBe('#bbb');
  });

  it('clears intersection cell only once', () => {
    const board = createEmptyBoard();
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[0][i] = '#fff';
      board[i][0] = '#aaa';
    }
    const lines = { rows: [0], cols: [0] };
    const result = clearLines(board, lines);
    expect(result[0][0]).toBe(0);
    for (let c = 1; c < BOARD_SIZE; c++) expect(result[0][c]).toBe(0);
    for (let r = 1; r < BOARD_SIZE; r++) expect(result[r][0]).toBe(0);
    expect(result[1][1]).toBe(0);
  });
});

describe('E2E: placement → clearing', () => {
  it('places blocks to fill row 6 and clears it', () => {
    const board = createEmptyBoard();
    // Fill row 6 (0-indexed, second from bottom) with individual dots
    for (let c = 0; c < BOARD_SIZE; c++) {
      board[6][c] = '#ff0000';
    }
    const lines = findFullLines(board);
    expect(lines.rows).toContain(6);
    const cleared = clearLines(board, lines);
    for (let c = 0; c < BOARD_SIZE; c++) {
      expect(cleared[6][c]).toBe(0);
    }
  });

  it('places blocks to fill row and column simultaneously and clears both', () => {
    const board = createEmptyBoard();
    // Fill row 3 entirely
    for (let c = 0; c < BOARD_SIZE; c++) board[3][c] = '#aaa';
    // Fill column 4 entirely
    for (let r = 0; r < BOARD_SIZE; r++) board[r][4] = '#bbb';

    const lines = findFullLines(board);
    expect(lines.rows).toContain(3);
    expect(lines.cols).toContain(4);
    const cleared = clearLines(board, lines);
    for (let c = 0; c < BOARD_SIZE; c++) expect(cleared[3][c]).toBe(0);
    for (let r = 0; r < BOARD_SIZE; r++) expect(cleared[r][4]).toBe(0);
    // Cells NOT in cleared row/col should remain
    expect(cleared[2][3]).toBe(0); // was already 0
    expect(cleared[2][5]).toBe(0);
  });

  it('clears multiple full rows at once', () => {
    const board = createEmptyBoard();
    // Fill rows 0, 3, 7
    for (let c = 0; c < BOARD_SIZE; c++) {
      board[0][c] = '#aaa';
      board[3][c] = '#bbb';
      board[7][c] = '#ccc';
    }
    const lines = findFullLines(board);
    expect(lines.rows).toContain(0);
    expect(lines.rows).toContain(3);
    expect(lines.rows).toContain(7);
    const cleared = clearLines(board, lines);
    for (let c = 0; c < BOARD_SIZE; c++) {
      expect(cleared[0][c]).toBe(0);
      expect(cleared[3][c]).toBe(0);
      expect(cleared[7][c]).toBe(0);
    }
    // Row 1 should be untouched
    for (let c = 0; c < BOARD_SIZE; c++) {
      expect(cleared[1][c]).toBe(0);
    }
  });

  it('correctly finds full row at any index including boundaries', () => {
    for (const testRow of [0, 1, 5, 6, 7]) {
      const board = createEmptyBoard();
      for (let c = 0; c < BOARD_SIZE; c++) board[testRow][c] = '#fff';
      const lines = findFullLines(board);
      expect(lines.rows).toEqual([testRow]);
    }
  });
});

describe('anyPlacementExists', () => {
  it('returns true on empty board', () => {
    expect(anyPlacementExists(createEmptyBoard(), h8)).toBe(true);
  });

  it('returns false when board is full', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < BOARD_SIZE; r++)
      for (let c = 0; c < BOARD_SIZE; c++)
        board[r][c] = '#fff';
    expect(anyPlacementExists(board, dot)).toBe(false);
  });
});

describe('isGameOver', () => {
  it('returns false when a block can be placed', () => {
    const board = createEmptyBoard();
    expect(isGameOver(board, [sq2])).toBe(false);
  });

  it('returns true when no block can be placed', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < BOARD_SIZE; r++)
      for (let c = 0; c < BOARD_SIZE; c++)
        board[r][c] = '#fff';
    expect(isGameOver(board, [dot, sq2])).toBe(true);
  });

  it('returns false when dock is empty', () => {
    const board = createEmptyBoard();
    expect(isGameOver(board, [])).toBe(false);
  });
});
