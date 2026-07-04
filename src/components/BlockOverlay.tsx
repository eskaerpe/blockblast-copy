import type { BlockShape } from '../game/types';

interface BlockOverlayProps {
  block: BlockShape;
}

export function BlockOverlay({ block }: BlockOverlayProps) {
  const minRow = Math.min(...block.cells.map((c) => c.row));
  const maxRow = Math.max(...block.cells.map((c) => c.row));
  const minCol = Math.min(...block.cells.map((c) => c.col));
  const maxCol = Math.max(...block.cells.map((c) => c.col));
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  return (
    <div
      className="grid opacity-90 pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '1px',
        width: `${cols * 24}px`,
        height: `${rows * 24}px`,
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
              className="aspect-square rounded-sm"
              style={{
                background: occupied ? block.color : 'transparent',
              }}
            />
          );
        })
      )}
    </div>
  );
}
