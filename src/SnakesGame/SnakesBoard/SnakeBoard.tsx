import { useRef, useEffect, useState } from "react";
import { SnakeGameEngine } from "./SnakeGame";

import "./SnakesBoardStyles.css";

interface SnakeGameBoard {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  externalScore: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  highScore: number;
  score: number;
  isGameOver: boolean;
}

export default function SnakeBoard({
  isPlaying,
  setIsPlaying,
  externalScore,
  setScore,
  setIsGameOver,
  highScore,
  score,
  isGameOver,
}: SnakeGameBoard) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  const snakes = useRef<SnakeGameEngine | null>(null);

  const canvasSidesLength = 500; // 500px

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 500, y: 100 });

  useEffect(() => {
    if (canvasRef.current === null) {
      throw new Error("canvasRef is not used");
    }

    canvasRef.current.width = canvasSidesLength;
    canvasRef.current.height = canvasSidesLength;
    context.current = canvasRef.current.getContext("2d");

    if (context.current) {
      const ctx = context.current;
      snakes.current = new SnakeGameEngine(
        ctx,
        canvasSidesLength,
        externalScore,
        setScore,
        setIsGameOver,
        isPlaying
      );
      const snakeGame = snakes.current;

      window.onkeydown = (e) => {
        switch (e.key) {
          case "w":
          case "ArrowUp":
            setIsPlaying((prevIsPlaying) => {
              if (!prevIsPlaying) {
                return true;
              }
              return prevIsPlaying;
            });
            snakeGame.snake.changeMovement("to top");
            break;
          case "s":
          case "ArrowDown":
            setIsPlaying((prevIsPlaying) => {
              if (!prevIsPlaying) {
                return true;
              }
              return prevIsPlaying;
            });
            snakeGame.snake.changeMovement("to bottom");
            break;
          case "d":
          case "ArrowRight":
            setIsPlaying((prevIsPlaying) => {
              if (!prevIsPlaying) {
                return true;
              }
              return prevIsPlaying;
            });
            snakeGame.snake.changeMovement("to right");
            break;
          case "a":
          case "ArrowLeft":
            setIsPlaying((prevIsPlaying) => {
              if (!prevIsPlaying) {
                return true;
              }
              return prevIsPlaying;
            });
            snakeGame.snake.changeMovement("to left");
            break;
          case "Escape":
            setIsPlaying((prevIsPlaying) => {
              return !prevIsPlaying;
            });
            break;
          case " ":
            setIsPlaying((prevIsPlaying) => {
              return !prevIsPlaying;
            });
            break;
          default:
            break;
        }
      };
    }

    return () => {
      canvasRef.current = null;
      context.current = null;
      snakes.current = null;
    };
  }, []);

  useEffect(() => {
    if (snakes.current) {
      snakes.current.animate(isPlaying);
    }
  }, [isPlaying]);

  // Global mouse event listeners for better drag performance
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        
        // Direct update without requestAnimationFrame for better responsiveness
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false, capture: true });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false, capture: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleGlobalMouseUp, { capture: true });
    };
  }, [isDragging, dragOffset]);

  // Drag event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the container
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation(); // Prevent the click from bubbling up to the container
      setIsDragging(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        willChange: 'transform',
        zIndex: 10,
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6))'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="high-score">High Score: {highScore}</p>
      <p className="score">
        <span>Score</span>
        <span>{score}</span>
      </p>
      <canvas id="game-canvas" ref={canvasRef}></canvas>
      {isGameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <div>GAME OVER</div>
          <div style={{ fontSize: '1rem', marginTop: '10px' }}>Final Score: {score}</div>
        </div>
      )}
    </div>
  );
}
