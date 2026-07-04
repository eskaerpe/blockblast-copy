import { useDroppable } from '@dnd-kit/core';
import type { Board as BoardType, BlockShape } from '../game/types';
import { canPlaceBlock } from '../game/board';
import { BOARD_SIZE } from '../game/constants';

interface BoardProps {
  board: BoardType;
  hoveredCell: { row: number; col: number } | null;
  activeBlock: BlockShape | null;
  clearingCells: Set<string>;
  isDragging: boolean;
}

function Cell({ row, col, color, isValid, isHovered, clearing, isDragging }: {
  row: number;
  col: number;
  color: string;
  isValid: boolean;
  isHovered: boolean;
  clearing: boolean;
  isDragging: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${row}-${col}` });
  const occupied = color !== '0' && !clearing;
  const over = isDragging ? isOver : false;
  const highlight = isHovered && !occupied;

  const bg = occupied
    ? color
    : over && isValid
      ? 'rgba(34,197,94,0.35)'
      : over && !isValid
        ? 'rgba(239,68,68,0.35)'
        : highlight
          ? 'rgba(34,197,94,0.2)'
          : 'bg-board-cell';

  const borderColor = highlight ? 'border-green-400/40' : 'border-board-border';

  return (
    <div
      ref={setNodeRef}
      className={`aspect-square rounded-sm border ${borderColor} transition-colors duration-100 ${
        clearing ? 'animate-clear' : ''
      }`}
      style={{ background: bg }}
    />
  );
}

export function Board({ board, hoveredCell, activeBlock, clearingCells, isDragging }: BoardProps) {
  // compute which cells would be occupied by the active block at the hovered position
  const previewCells = new Set<string>();
  let previewValid = false;

  if (hoveredCell && activeBlock) {
    const { row, col } = hoveredCell;
    previewValid = canPlaceBlock(board, activeBlock, row, col);
    if (previewValid) {
      for (const c of activeBlock.cells) {
        previewCells.add(`${row + c.row},${col + c.col}`);
      }
    }
  }

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
            isValid={previewValid}
            isHovered={previewCells.has(`${r},${c}`)}
            clearing={clearingCells.has(`${r},${c}`)}
            isDragging={isDragging}
          />
        ))
      )}
    </div>
  );
}
