import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragCancelEvent,
} from '@dnd-kit/core';
import { Board } from './Board';
import { Dock } from './Dock';
import { BlockOverlay } from './BlockOverlay';
import { PreviewOverlay } from './PreviewOverlay';
import { Settings } from './Settings';
import { GameOver } from './GameOver';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import type { BlockShape } from '../game/types';

interface DragState {
  activeBlock: BlockShape | null;
  activeBlockIdx: number;
  anchorCell: { row: number; col: number } | null;
  isDragging: boolean;
}

const EMPTY_DRAG: DragState = { activeBlock: null, activeBlockIdx: -1, anchorCell: null, isDragging: false };

function blockAnchorOffset(block: BlockShape): { row: number; col: number } {
  const minRow = Math.min(...block.cells.map((c) => c.row));
  const maxRow = Math.max(...block.cells.map((c) => c.row));
  const minCol = Math.min(...block.cells.map((c) => c.col));
  const maxCol = Math.max(...block.cells.map((c) => c.col));
  return {
    row: Math.floor((maxRow - minRow + 1) / 2),
    col: Math.floor((maxCol - minCol + 1) / 2),
  };
}

export function Game() {
  const [drag, setDrag] = useState<DragState>(EMPTY_DRAG);
  const [cellSize, setCellSize] = useState(40);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const dragPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const board = useGameStore((s) => s.board);
  const boardVersion = useGameStore((s) => s.boardVersion);
  const dock = useGameStore((s) => s.dock);
  const score = useGameStore((s) => s.score);
  const hiScore = useGameStore((s) => s.hiScore);
  const gameOver = useGameStore((s) => s.gameOver);
  const combo = useGameStore((s) => s.combo);
  const lastClearCount = useGameStore((s) => s.lastClearCount);
  const clearedLines = useGameStore((s) => s.clearedLines);
  const clearClearedLines = useGameStore((s) => s.clearClearedLines);
  const init = useGameStore((s) => s.init);
  const restart = useGameStore((s) => s.restart);
  const tryPlaceBlock = useGameStore((s) => s.tryPlaceBlock);

  const { playPlace, playClear, playCombo, playGameOver } = useSound();

  const prevScoreRef = useRef(score);
  const prevComboRef = useRef(combo);
  const prevGameOverRef = useRef(gameOver);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const el = boardContainerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setCellSize(Math.max(12, w / 8));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => setDrag(EMPTY_DRAG);
  }, []);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      if (lastClearCount > 0) {
        playClear(lastClearCount);
        if (combo > prevComboRef.current) {
          playCombo(combo);
        }
      } else {
        playPlace();
      }
    }
    prevScoreRef.current = score;
    prevComboRef.current = combo;
  }, [score, combo, lastClearCount, playPlace, playClear, playCombo]);

  useEffect(() => {
    if (gameOver && !prevGameOverRef.current) {
      playGameOver();
    }
    prevGameOverRef.current = gameOver;
  }, [gameOver, playGameOver]);

  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (clearedLines) {
      const cells = new Set<string>();
      for (const r of clearedLines.rows) {
        for (let c = 0; c < 8; c++) cells.add(`${r},${c}`);
      }
      for (const c of clearedLines.cols) {
        for (let r = 0; r < 8; r++) cells.add(`${r},${c}`);
      }
      setClearingCells(cells);
      const timer = setTimeout(() => {
        setClearingCells(new Set());
        clearClearedLines();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [clearedLines, clearClearedLines]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const cellFromPoint = useCallback((cx: number, cy: number) => {
    const el = boardContainerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const cellW = rect.width / 8;
    const cellH = rect.height / 8;
    const col = Math.floor((cx - rect.left) / cellW);
    const row = Math.floor((cy - rect.top) / cellH);
    if (row < 0 || row >= 8 || col < 0 || col >= 8) return null;
    return { row, col };
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { block, index } = event.active.data.current as { block: BlockShape; index: number };
      const ae = event.activatorEvent as PointerEvent;
      dragPointerRef.current = { x: ae.clientX, y: ae.clientY };
      setDrag({ activeBlock: block, activeBlockIdx: index, anchorCell: null, isDragging: true });
    },
    []
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { activeBlock } = drag;
      if (!activeBlock) return;
      dragPointerRef.current = {
        x: dragPointerRef.current.x + event.delta.x,
        y: dragPointerRef.current.y + event.delta.y,
      };
      const cell = cellFromPoint(dragPointerRef.current.x, dragPointerRef.current.y);
      if (cell) {
        const off = blockAnchorOffset(activeBlock);
        setDrag((d) => ({ ...d, anchorCell: { row: cell.row - off.row, col: cell.col - off.col } }));
      } else {
        setDrag((d) => ({ ...d, anchorCell: null }));
      }
    },
    [drag, cellFromPoint]
  );

  const endDrag = useCallback(() => {
    setDrag(EMPTY_DRAG);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const block = drag.activeBlock;
      const blockIdx = drag.activeBlockIdx;
      const { over } = event;
      endDrag();

      if (!over || blockIdx < 0 || !block) return;
      const overId = String(over.id);
      const match = overId.match(/^cell-(\d+)-(\d+)$/);
      if (!match) return;

      // Center the drop on the cursor just like the preview
      const cellRow = parseInt(match[1], 10);
      const cellCol = parseInt(match[2], 10);
      const off = blockAnchorOffset(block);
      const row = cellRow - off.row;
      const col = cellCol - off.col;
      tryPlaceBlock(blockIdx, row, col);
    },
    [drag.activeBlockIdx, drag.activeBlock, tryPlaceBlock, endDrag]
  );

  const handleDragCancel = useCallback(
    (_event: DragCancelEvent) => {
      endDrag();
    },
    [endDrag]
  );

  const showPreview = drag.isDragging && drag.anchorCell && drag.activeBlock;

  return (
    <div className="relative h-full flex flex-col items-center justify-between p-4 safe-top safe-bottom">
      <div className="flex items-center justify-between w-full max-w-md px-2">
        <div className="text-sm">
          <span className="text-gray-400">Score</span>
          <div className="text-2xl font-bold tabular-nums">{score}</div>
        </div>
        <div className="text-sm text-right">
          <span className="text-gray-400">Best</span>
          <div className="text-2xl font-bold tabular-nums text-yellow-400">{hiScore}</div>
        </div>
      </div>

      {combo > 1 && (
        <div key={combo} className="text-orange-400 font-bold text-sm animate-pop">
          Combo x{combo}
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="relative" data-board ref={boardContainerRef} key={String(boardVersion)}>
          <Board board={board} clearingCells={clearingCells} />

          {showPreview && (
            <PreviewOverlay
              board={board}
              block={drag.activeBlock!}
              cell={drag.anchorCell!}
              cellSize={cellSize}
            />
          )}
        </div>

        <Dock dock={dock} cellSize={cellSize} />

        <DragOverlay dropAnimation={null}>
          {drag.activeBlock ? (
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <BlockOverlay block={drag.activeBlock} cellSize={Math.max(12, cellSize)} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Settings />

      {gameOver && <GameOver score={score} hiScore={hiScore} onRestart={restart} />}
    </div>
  );
}
