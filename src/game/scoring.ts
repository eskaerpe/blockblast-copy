import { SCORE_PER_CELL, LINE_CLEAR_BONUS, COMBO_MULTIPLIER_STEP } from './constants';

export function calcPlacementPoints(cellCount: number): number {
  return cellCount * SCORE_PER_CELL;
}

export function calcLineClearPoints(lineCount: number, combo: number): number {
  const multiplier = 1 + (combo - 1) * COMBO_MULTIPLIER_STEP;
  return Math.floor(lineCount * LINE_CLEAR_BONUS * multiplier);
}

export function calcTotalPoints(cellCount: number, lineCount: number, combo: number): number {
  return calcPlacementPoints(cellCount) + calcLineClearPoints(lineCount, combo);
}
