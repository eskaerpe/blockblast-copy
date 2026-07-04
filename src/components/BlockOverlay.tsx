import type { BlockShape } from '../game/types';

interface BlockOverlayProps {
  block: BlockShape;
  cellSize: number;
}

export function BlockOverlay({ block, cellSize }: BlockOverlayProps) {
  const minRow = Math.min(...block.cells.map((c) => c.row));
  const maxRow = Math.max(...block.cells.map((c) => c.row));
  const minCol = Math.min(...block.cells.map((c) => c.col));
  const maxCol = Math.max(...block.cells.map((c) => c.col));
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  const s = Math.max(12, cellSize);
  const gap = Math.max(1, s * 0.04);

  return (
    <div
      className="grid opacity-90 pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${s}px)`,
        gridTemplateRows: `repeat(${rows}, ${s}px)`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const occupied = block.cells.some(
            (cell) => cell.row - minRow === r && cell.col - minCol === c
          );
          return (
            <div
              key={`${r}-${c}`}
              className="rounded-sm"
                style={{
                    width: `${s}px`,
                    height: `${s}px`,
                background: occupied ? block.color : 'transparent',
              }}
            />
          );
        })
      )}
    </div>
  );
}
