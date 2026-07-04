import { describe, it, expect } from 'vitest';
import { calcPlacementPoints, calcLineClearPoints, calcTotalPoints } from './scoring';

describe('calcPlacementPoints', () => {
  it('scores 1 point per cell', () => {
    expect(calcPlacementPoints(0)).toBe(0);
    expect(calcPlacementPoints(1)).toBe(1);
    expect(calcPlacementPoints(4)).toBe(4);
    expect(calcPlacementPoints(9)).toBe(9);
  });
});

describe('calcLineClearPoints', () => {
  it('scores 10 per line at combo 1', () => {
    expect(calcLineClearPoints(1, 1)).toBe(10);
    expect(calcLineClearPoints(2, 1)).toBe(20);
  });

  it('scales with combo multiplier', () => {
    // combo 1: 1 + (1-1)*0.5 = 1.0 -> 10
    expect(calcLineClearPoints(1, 1)).toBe(10);
    // combo 2: 1 + (2-1)*0.5 = 1.5 -> 15
    expect(calcLineClearPoints(1, 2)).toBe(15);
    // combo 3: 1 + (3-1)*0.5 = 2.0 -> 20
    expect(calcLineClearPoints(1, 3)).toBe(20);
    // combo 5: 1 + (5-1)*0.5 = 3.0 -> 30
    expect(calcLineClearPoints(1, 5)).toBe(30);
  });

  it('combines line count and combo', () => {
    // 2 lines at combo 2: 2 * 10 * 1.5 = 30
    expect(calcLineClearPoints(2, 2)).toBe(30);
  });
});

describe('calcTotalPoints', () => {
  it('combines placement and line clear points', () => {
    // 4 cells placed + 1 line cleared at combo 1 = 4 + 10 = 14
    expect(calcTotalPoints(4, 1, 1)).toBe(14);
  });

  it('only placement points when no lines cleared', () => {
    expect(calcTotalPoints(3, 0, 1)).toBe(3);
  });
});
