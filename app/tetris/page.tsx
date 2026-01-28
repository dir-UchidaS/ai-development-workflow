'use client';

import { useEffect } from 'react';

import { useTetris } from '@/app/hooks/useTetris';
import { GameBoard } from '@/app/components/tetris/GameBoard';
import { NextPiece } from '@/app/components/tetris/NextPiece';
import { ScoreDisplay } from '@/app/components/tetris/ScoreDisplay';
import { Controls } from '@/app/components/tetris/Controls';

export default function TetrisPage() {
  const {
    gameState,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
  } = useTetris();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotate();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.isGameOver, gameState.isPaused, gameState.currentPiece, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Tetris
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="flex-shrink-0">
            <GameBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
            />
            {gameState.isGameOver && (
              <div className="mt-4 p-4 bg-red-600 rounded-lg text-white text-center font-bold">
                Game Over!
              </div>
            )}
            {gameState.isPaused && (
              <div className="mt-4 p-4 bg-yellow-600 rounded-lg text-white text-center font-bold">
                Paused
              </div>
            )}
          </div>

          <div className="space-y-4">
            <ScoreDisplay score={gameState.score} />
            <NextPiece nextPiece={gameState.nextPiece} />
            <Controls
              onStart={startGame}
              onPause={togglePause}
              isGameOver={gameState.isGameOver}
              isPaused={gameState.isPaused}
              hasStarted={gameState.currentPiece !== null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
