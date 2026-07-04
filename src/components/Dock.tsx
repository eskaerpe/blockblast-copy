import { useDraggable } from '@dnd-kit/core';
import type { BlockShape } from '../game/types';

function DockBlock({ block, index }: { block: BlockShape; index: number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `dock-block-${index}`,
    data: { block, index },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: 0.5, zIndex: 50 }
    : undefined;

  const minRow = Math.min(...block.cells.map((c) => c.row));
  const maxRow = Math.max(...block.cells.map((c) => c.row));
  const minCol = Math.min(...block.cells.map((c) => c.col));
  const maxCol = Math.max(...block.cells.map((c) => c.col));
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none rounded-lg p-2 bg-gray-800 cursor-grab active:cursor-grabbing transition-transform duration-100 ${
        isDragging ? 'opacity-50' : 'hover:scale-105'
      }`}
      style={style}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(14px, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(14px, 1fr))`,
          gap: '1px',
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
                  width: 'min(16px, 6vw)',
                  height: 'min(16px, 6vw)',
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
}

export function Dock({ dock }: DockProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-gray-900 rounded-xl">
      {dock.map((block, i) => (
        <DockBlock key={`${block.id}-${i}`} block={block} index={i} />
      ))}
    </div>
  );
}
