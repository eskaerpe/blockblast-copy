import { useDroppable } from '@dnd-kit/core';
import type { Board as BoardType, BlockShape } from '../game/types';
import { canPlaceBlock } from '../game/board';
import { BOARD_SIZE } from '../game/constants';

interface BoardProps {
  board: BoardType;
  hoveredCell: { row: number; col: number } | null;
  activeBlock: BlockShape | null;
}

function Cell({ row, col, color, isValid, isHovered }: {
  row: number;
  col: number;
  color: string;
  isValid: boolean;
  isHovered: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${row}-${col}` });

  const occupied = color !== '0';
  const highlight = isHovered && !occupied;

  const bg = occupied
    ? color
    : isOver && isValid
      ? 'rgba(34,197,94,0.35)'
      : isOver && !isValid
        ? 'rgba(239,68,68,0.35)'
        : highlight
          ? 'rgba(34,197,94,0.2)'
          : 'bg-board-cell';

  const borderColor = highlight ? 'border-green-400/40' : 'border-board-border';

  return (
    <div
      ref={setNodeRef}
      className={`aspect-square rounded-sm border ${borderColor} transition-colors duration-100`}
      style={{ background: bg }}
    />
  );
}

export function Board({ board, hoveredCell, activeBlock }: BoardProps) {
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
          />
        ))
      )}
    </div>
  );
}
