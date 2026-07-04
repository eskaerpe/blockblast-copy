import { useDroppable } from '@dnd-kit/core';
import type { Board as BoardType } from '../game/types';
import { BOARD_SIZE } from '../game/constants';

interface BoardProps {
  board: BoardType;
  clearingCells: Set<string>;
}

function Cell({ row, col, color, clearing }: {
  row: number;
  col: number;
  color: string;
  clearing: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `cell-${row}-${col}` });
  const occupied = color !== '0' && !clearing;
  const bg = occupied ? color : 'bg-board-cell';

  return (
    <div
      ref={setNodeRef}
      className={`aspect-square rounded-sm border border-board-border transition-colors duration-100 ${
        clearing ? 'animate-clear' : ''
      }`}
      style={{ background: bg }}
    />
  );
}

export function Board({ board, clearingCells }: BoardProps) {
  return (
    <div
      className="bg-board-bg p-1 rounded-lg"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '2px',
        width: 'min(90vw, 90vh - 200px)',
        height: 'min(90vw, 90vh - 200px)',
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            color={String(cell)}
            clearing={clearingCells.has(`${r},${c}`)}
          />
        ))
      )}
    </div>
  );
}
