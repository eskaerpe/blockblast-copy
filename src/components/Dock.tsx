import { useDraggable } from '@dnd-kit/core';
import type { BlockShape } from '../game/types';

function DockBlock({ block, index, cellSize }: { block: BlockShape; index: number; cellSize: number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `dock-block-${index}`,
    data: { block, index },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined;

  const minRow = Math.min(...block.cells.map((c) => c.row));
  const maxRow = Math.max(...block.cells.map((c) => c.row));
  const minCol = Math.min(...block.cells.map((c) => c.col));
  const maxCol = Math.max(...block.cells.map((c) => c.col));
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  const s = Math.max(12, Math.min(cellSize * 0.55, 28));
  const gap = Math.max(1, cellSize * 0.03);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none rounded-lg p-2 bg-gray-800 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-30' : 'hover:scale-105'
      }`}
      style={style}
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
    </div>
  );
}

interface DockProps {
  dock: BlockShape[];
  cellSize: number;
}

export function Dock({ dock, cellSize }: DockProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-gray-900 rounded-xl">
      {dock.map((block, i) => (
        <DockBlock key={`${block.id}-${i}`} block={block} index={i} cellSize={cellSize} />
      ))}
    </div>
  );
}
