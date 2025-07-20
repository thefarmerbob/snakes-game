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

  // Function to show random painting when food is eaten
  const handleFoodEaten = () => {
    // Get current available paintings from ref
    const availablePaintings = availablePaintingsRef.current;
    
    if (availablePaintings.length === 0) {
      // All paintings collected - show collection gallery with congratulations
      setShowCollection(true);
      setCurrentCollectionIndex(0);
      return;
    }
    
    // Select a random painting from available list
    const randomIndex = Math.floor(Math.random() * availablePaintings.length);
    const randomPainting = availablePaintings[randomIndex];
    
    // Remove the selected painting from available list
    availablePaintings.splice(randomIndex, 1);
    
    setCurrentPainting(randomPainting);
    setCollectedPaintings(prev => new Set([...prev, randomPainting]));
    setShowPainting(true);
    
    // Check if this was the last painting
    if (availablePaintings.length === 0) {
      // This was the last painting - show collection gallery after showing it
      setTimeout(() => {
        setShowPainting(false);
        setShowCollection(true);
        setCurrentCollectionIndex(0);
      }, 3000);
    } else {
      // Hide painting after 3 seconds and continue game
      setTimeout(() => {
        setShowPainting(false);
      }, 3000);
    }
  };

  // Function to close collection gallery
  const closeCollection = () => {
    setShowCollection(false);
  };

  // Function to navigate to next painting in collection
  const nextPainting = () => {
    const collectedArray = Array.from(collectedPaintings);
    setCurrentCollectionIndex((prev) => 
      prev < collectedArray.length - 1 ? prev + 1 : 0
    );
  };

  // Function to navigate to previous painting in collection
  const prevPainting = () => {
    const collectedArray = Array.from(collectedPaintings);
    setCurrentCollectionIndex((prev) => 
      prev > 0 ? prev - 1 : collectedArray.length - 1
    );
  };

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 500, y: 100 });
  const [showPainting, setShowPainting] = useState(false);
  const [currentPainting, setCurrentPainting] = useState('');
  const [collectedPaintings, setCollectedPaintings] = useState<Set<string>>(new Set());
  const [showCollection, setShowCollection] = useState(false);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
  
  // Use ref to track available paintings list
  const availablePaintingsRef = useRef<string[]>(['p1.png', 'p2.jpg', 'p3.jpg', 'p4.jpg', 'p5.jpg', 'p6.jpg', 'p7.jpg', 'p8.jpg', 'p9.jpg']);

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
        isPlaying,
        handleFoodEaten
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
      {showPainting && !isGameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '5%',
          width: '65%',
          height: '55%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <img 
            src={`/maras-paintings/${currentPainting}`} 
            alt="Painting" 
            style={{
              width: '90%',
              objectFit: 'contain',
              borderRadius: '5px'
            }}
          />
          <div style={{
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Painting Collected! ({collectedPaintings.size}/9)
          </div>
        </div>
      )}
      {isGameOver && collectedPaintings.size < 9 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '5%',
          width: '65%',
          height: collectedPaintings.size > 0 ? '70%' : '30%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div>GAME OVER</div>
          
          {collectedPaintings.size > 0 ? (
            <>
              <div style={{
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '10px'
              }}>
                Paintings Collected:
              </div>
              <div style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                <img 
                  src={`/maras-paintings/${Array.from(collectedPaintings)[currentCollectionIndex]}`} 
                  alt="Painting" 
                  style={{
                    width: '90%',
                    objectFit: 'contain'
                  }}
                />
                {collectedPaintings.size > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '5px 10px',
                    borderRadius: '5px'
                  }}>
                    <button 
                      onClick={() => {
                        const collectedArray = Array.from(collectedPaintings);
                        setCurrentCollectionIndex((prev) => 
                          prev > 0 ? prev - 1 : collectedArray.length - 1
                        );
                      }}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                    >
                      ←
                    </button>
                                         <div style={{
                       color: 'white',
                       fontSize: '0.6rem',
                       textAlign: 'center'
                     }}>
                       {currentCollectionIndex + 1} of {collectedPaintings.size}
                     </div>
                    <button 
                      onClick={() => {
                        const collectedArray = Array.from(collectedPaintings);
                        setCurrentCollectionIndex((prev) => 
                          prev < collectedArray.length - 1 ? prev + 1 : 0
                        );
                      }}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              color: '#ccc',
              fontSize: '0.9rem',
              textAlign: 'center',
              marginTop: '10px'
            }}>
              No paintings were collected
            </div>
          )}
        </div>
      )}
      {showCollection && (
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          marginTop: '0%',
          width: '65%',
          height: '65%',
          transform: 'translate(-50%, -50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '20px',
          borderRadius: '10px',
        }}>
          {collectedPaintings.size === 9 && (
            <div style={{
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              Congratulations! You've collected all paintings!
            </div>
          )}
          <button 
            onClick={closeCollection}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '5px 8px',
              fontSize: '0.8rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              cursor: 'pointer',
              width: '25px',
              height: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ×
          </button>
          {Array.from(collectedPaintings).length > 0 && (
            <>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <img 
                  src={`/maras-paintings/${Array.from(collectedPaintings)[currentCollectionIndex]}`} 
                  alt="Painting" 
                  style={{
                    width: '90%',
                    objectFit: 'contain'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '5px 10px',
                  borderRadius: '5px'
                }}>
                  <button 
                    onClick={prevPainting}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    ←
                  </button>
                  <div style={{
                    color: 'white',
                    fontSize: '0.6rem',
                    textAlign: 'center'
                  }}>
                    {currentCollectionIndex + 1} of {collectedPaintings.size}
                  </div>
                  <button 
                    onClick={nextPainting}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
