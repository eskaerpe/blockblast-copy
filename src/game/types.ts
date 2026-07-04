export interface Position {
  row: number;
  col: number;
}

export interface BlockShape {
  id: string;
  cells: Position[];
  color: string;
}

export type CellValue = 0 | string;

export type Board = CellValue[][];

export interface GameState {
  board: Board;
  dock: BlockShape[];
  score: number;
  hiScore: number;
  combo: number;
  gameOver: boolean;
}
