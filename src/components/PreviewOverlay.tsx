import type { Board as BoardType, BlockShape } from '../game/types';
import { canPlaceBlock } from '../game/board';

interface PreviewOverlayProps {
  board: BoardType;
  block: BlockShape;
  cell: { row: number; col: number };
  cellSize: number;
}

export function PreviewOverlay({ board, block, cell, cellSize }: PreviewOverlayProps) {
  const valid = canPlaceBlock(board, block, cell.row, cell.col);
  const s = Math.max(8, cellSize);
  const gap = 2;
  const offset = 4; // p-1 = 4px padding on the board

  const previewCells = block.cells.map((c) => ({
    row: cell.row + c.row,
    col: cell.col + c.col,
  }));

  if (previewCells.length === 0) return null;

  const minRow = Math.min(...previewCells.map((c) => c.row));
  const maxRow = Math.max(...previewCells.map((c) => c.row));
  const minCol = Math.min(...previewCells.map((c) => c.col));
  const maxCol = Math.max(...previewCells.map((c) => c.col));
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  const top = offset + minRow * (s + gap);
  const left = offset + minCol * (s + gap);
  const width = cols * s + (cols - 1) * gap;
  const height = rows * s + (rows - 1) * gap;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 10 }}
    >
      {/* Position the block shape over the target grid cells */}
      <div
        className="absolute"
        style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${s}px)`,
            gridTemplateRows: `repeat(${rows}, ${s}px)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const occupied = previewCells.some(
                (pc) => pc.row - minRow === r && pc.col - minCol === c
              );
              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-sm ${valid ? 'bg-green-500/35' : 'bg-red-500/35'} ${
                    valid ? 'border border-green-400/40' : 'border border-red-400/40'
                  }`}
                  style={{ width: `${s}px`, height: `${s}px` }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
