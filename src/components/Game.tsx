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
} from '@dnd-kit/core';
import { Board } from './Board';
import { Dock } from './Dock';
import { BlockOverlay } from './BlockOverlay';
import { Settings } from './Settings';
import { GameOver } from './GameOver';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
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

  // Sound effects
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

  // Clear line animation state after it plays
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
    <div className="relative h-full flex flex-col items-center justify-between p-4 safe-top safe-bottom">
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
        <div key={combo} className="text-orange-400 font-bold text-sm animate-pop">
          Combo x{combo}
        </div>
      )}

      {/* Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div data-board>
          <Board board={board} hoveredCell={hoveredCell} activeBlock={activeBlock} clearingCells={clearingCells} />
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
