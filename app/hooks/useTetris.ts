import { useState, useEffect, useCallback, useRef } from 'react';

import type { GameState, Tetromino, Position } from '@/app/types/tetris';
import {
  createEmptyBoard,
  createRandomTetromino,
  isValidPosition,
  mergePieceToBoard,
  clearLines,
  rotatePiece,
  calculateScore,
} from '@/app/utils/tetris';

const GAME_SPEED = 1000;

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    isGameOver: false,
    isPaused: false,
  });

  const gameSpeedRef = useRef(GAME_SPEED);
  const lastMoveTime = useRef(Date.now());

  const startGame = useCallback(() => {
    const firstPiece = createRandomTetromino();
    const nextPiece = createRandomTetromino();

    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPosition: Position = {
        x: prev.currentPiece.position.x,
        y: prev.currentPiece.position.y + 1,
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      }

      const mergedBoard = mergePieceToBoard(prev.board, prev.currentPiece);
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      const newScore = prev.score + calculateScore(linesCleared);

      const nextPiece = prev.nextPiece || createRandomTetromino();
      const newCurrentPiece = createRandomTetromino();

      if (!isValidPosition(newBoard, nextPiece, nextPiece.position)) {
        return {
          ...prev,
          board: mergedBoard,
          isGameOver: true,
        };
      }

      return {
        ...prev,
        board: newBoard,
        currentPiece: nextPiece,
        nextPiece: newCurrentPiece,
        score: newScore,
      };
    });
  }, []);

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPosition: Position = {
        x: prev.currentPiece.position.x - 1,
        y: prev.currentPiece.position.y,
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      }

      return prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPosition: Position = {
        x: prev.currentPiece.position.x + 1,
        y: prev.currentPiece.position.y,
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition,
          },
        };
      }

      return prev;
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const rotatedPiece = rotatePiece(prev.currentPiece);

      if (isValidPosition(prev.board, rotatedPiece, rotatedPiece.position)) {
        return {
          ...prev,
          currentPiece: rotatedPiece,
        };
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      let newPiece: Tetromino = { ...prev.currentPiece };
      let dropDistance = 0;

      while (
        isValidPosition(prev.board, newPiece, {
          x: newPiece.position.x,
          y: newPiece.position.y + 1,
        })
      ) {
        newPiece = {
          ...newPiece,
          position: {
            x: newPiece.position.x,
            y: newPiece.position.y + 1,
          },
        };
        dropDistance++;
      }

      const mergedBoard = mergePieceToBoard(prev.board, newPiece);
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      const newScore = prev.score + calculateScore(linesCleared) + dropDistance * 2;

      const nextPiece = prev.nextPiece || createRandomTetromino();
      const newCurrentPiece = createRandomTetromino();

      if (!isValidPosition(newBoard, nextPiece, nextPiece.position)) {
        return {
          ...prev,
          board: mergedBoard,
          isGameOver: true,
        };
      }

      return {
        ...prev,
        board: newBoard,
        currentPiece: nextPiece,
        nextPiece: newCurrentPiece,
        score: newScore,
      };
    });
  }, []);

  useEffect(() => {
    if (!gameState.currentPiece || gameState.isGameOver || gameState.isPaused) {
      return;
    }

    const gameLoop = setInterval(() => {
      const now = Date.now();
      if (now - lastMoveTime.current >= gameSpeedRef.current) {
        moveDown();
        lastMoveTime.current = now;
      }
    }, 50);

    return () => {
      clearInterval(gameLoop);
    };
  }, [gameState.currentPiece, gameState.isGameOver, gameState.isPaused, moveDown]);

  return {
    gameState,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
  };
}
