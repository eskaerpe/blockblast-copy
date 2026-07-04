import type { BlockShape } from './types';

export const BOARD_SIZE = 8;
export const DOCK_SIZE = 3;

export const SCORE_PER_CELL = 1;
export const LINE_CLEAR_BONUS = 10;
export const COMBO_MULTIPLIER_STEP = 0.5;

export const COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
] as const;

const C = (row: number, col: number) => ({ row, col });

const SHAPES: Omit<BlockShape, 'color'>[] = [
  { id: 'dot', cells: [C(0, 0)] },
  { id: 'h2', cells: [C(0, 0), C(0, 1)] },
  { id: 'v2', cells: [C(0, 0), C(1, 0)] },
  { id: 'h3', cells: [C(0, 0), C(0, 1), C(0, 2)] },
  { id: 'v3', cells: [C(0, 0), C(1, 0), C(2, 0)] },
  { id: 'sq2', cells: [C(0, 0), C(0, 1), C(1, 0), C(1, 1)] },
  { id: 'sq3', cells: [C(0, 0), C(0, 1), C(0, 2), C(1, 0), C(1, 1), C(1, 2), C(2, 0), C(2, 1), C(2, 2)] },
  { id: 'l3', cells: [C(0, 0), C(1, 0), C(2, 0), C(2, 1)] },
  { id: 'l3r', cells: [C(0, 1), C(1, 1), C(2, 1), C(2, 0)] },
  { id: 'l3u', cells: [C(0, 0), C(0, 1), C(1, 0), C(2, 0)] },
  { id: 'l3ur', cells: [C(0, 0), C(0, 1), C(1, 1), C(2, 1)] },
  { id: 'l2a', cells: [C(0, 0), C(1, 0), C(1, 1)] },
  { id: 'l2b', cells: [C(0, 1), C(1, 1), C(1, 0)] },
  { id: 'l2c', cells: [C(0, 0), C(0, 1), C(1, 1)] },
  { id: 'l2d', cells: [C(0, 0), C(0, 1), C(1, 0)] },
  { id: 't4', cells: [C(0, 0), C(0, 1), C(0, 2), C(1, 1)] },
  { id: 't4r', cells: [C(0, 0), C(1, 0), C(2, 0), C(1, 1)] },
  { id: 't4d', cells: [C(1, 0), C(1, 1), C(1, 2), C(0, 1)] },
  { id: 't4l', cells: [C(0, 1), C(1, 1), C(2, 1), C(1, 0)] },
  { id: 'z4h', cells: [C(0, 0), C(0, 1), C(1, 1), C(1, 2)] },
  { id: 'z4v', cells: [C(0, 1), C(1, 1), C(1, 0), C(2, 0)] },
  { id: 'z4hr', cells: [C(0, 1), C(0, 2), C(1, 0), C(1, 1)] },
  { id: 'z4vr', cells: [C(0, 0), C(1, 0), C(1, 1), C(2, 1)] },
  { id: 'h4', cells: [C(0, 0), C(0, 1), C(0, 2), C(0, 3)] },
  { id: 'v4', cells: [C(0, 0), C(1, 0), C(2, 0), C(3, 0)] },
  { id: 'h5', cells: [C(0, 0), C(0, 1), C(0, 2), C(0, 3), C(0, 4)] },
  { id: 'v5', cells: [C(0, 0), C(1, 0), C(2, 0), C(3, 0), C(4, 0)] },
  { id: 'plus', cells: [C(0, 1), C(1, 0), C(1, 1), C(1, 2), C(2, 1)] },
  { id: 'u', cells: [C(0, 0), C(0, 1), C(0, 2), C(1, 0), C(1, 2)] },
  { id: 'bigl', cells: [C(0, 0), C(1, 0), C(2, 0), C(3, 0), C(3, 1)] },
  { id: 'biglr', cells: [C(0, 1), C(1, 1), C(2, 1), C(3, 1), C(3, 0)] },
];

export const ALL_SHAPES = SHAPES;

export function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function createBlock(shapeIdx: number): BlockShape {
  const shape = SHAPES[shapeIdx];
  return {
    ...shape,
    color: randomColor(),
  };
}
