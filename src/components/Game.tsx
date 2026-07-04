import { useState, useCallback, useEffect } from 'react';
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
} from '@dnd-kit/core';
import { Board } from './Board';
import { Dock } from './Dock';
import { BlockOverlay } from './BlockOverlay';
import { Settings } from './Settings';
import { GameOver } from './GameOver';
import { useGameStore } from '../store/gameStore';
import type { BlockShape } from '../game/types';

export function Game() {
  const [activeBlock, setActiveBlock] = useState<BlockShape | null>(null);
  const [activeBlockIdx, setActiveBlockIdx] = useState<number>(-1);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const board = useGameStore((s) => s.board);
  const dock = useGameStore((s) => s.dock);
  const score = useGameStore((s) => s.score);
  const hiScore = useGameStore((s) => s.hiScore);
  const gameOver = useGameStore((s) => s.gameOver);
  const combo = useGameStore((s) => s.combo);
  const init = useGameStore((s) => s.init);
  const restart = useGameStore((s) => s.restart);
  const tryPlaceBlock = useGameStore((s) => s.tryPlaceBlock);

  useEffect(() => {
    init();
  }, [init]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { block, index } = event.active.data.current as { block: BlockShape; index: number };
      setActiveBlock(block);
      setActiveBlockIdx(index);
    },
    []
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!activeBlock) return;
      const overId = event.over ? String(event.over.id) : null;
      if (!overId) {
        setHoveredCell(null);
        return;
      }
      const match = overId.match(/^cell-(\d+)-(\d+)$/);
      if (match) {
        const col = parseInt(match[1], 10);
        const row = parseInt(match[2], 10);
        setHoveredCell({ row, col });
      } else {
        setHoveredCell(null);
      }
    },
    [activeBlock]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event;
      setActiveBlock(null);
      setActiveBlockIdx(-1);
      setHoveredCell(null);

      if (!over || activeBlockIdx < 0) return;

      const overId = String(over.id);
      const match = overId.match(/^cell-(\d+)-(\d+)$/);
      if (!match) return;

      const col = parseInt(match[1], 10);
      const row = parseInt(match[2], 10);
      tryPlaceBlock(activeBlockIdx, row, col);
    },
    [activeBlockIdx, tryPlaceBlock]
  );

  return (
    <div className="h-full flex flex-col items-center justify-between p-4 safe-top safe-bottom">
      {/* Header */}
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

      {/* Combo indicator */}
      {combo > 1 && (
        <div className="text-orange-400 font-bold text-sm animate-pulse">
          Combo x{combo}
        </div>
      )}

      {/* Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div data-board>
          <Board board={board} hoveredCell={hoveredCell} activeBlock={activeBlock} />
        </div>

        {/* Dock */}
        <Dock dock={dock} />

        <DragOverlay dropAnimation={null}>
          {activeBlock ? <BlockOverlay block={activeBlock} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Settings */}
      <Settings />

      {/* Game Over overlay */}
      {gameOver && <GameOver score={score} hiScore={hiScore} onRestart={restart} />}
    </div>
  );
}
