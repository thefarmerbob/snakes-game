import { useState } from "react";
import SnakeBoard from "./SnakesBoard";

import "./styles.css";

// key used to access high-score value from localstorage
export const HIGH_SCORE_KEY = "high-score";

export default function SnakesGame() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [isBoardVisible, setIsBoardVisible] = useState(true);

  if (localStorage.getItem(HIGH_SCORE_KEY) === null) {
    localStorage.setItem(HIGH_SCORE_KEY, "0");
  }
  const highScore = Number(localStorage.getItem(HIGH_SCORE_KEY));

  const handleBodyClick = () => {
    // Toggle board visibility when clicking the background
    if (!justStarted) {
      if (isBoardVisible) {
        // Pause animation first, then hide board
        setIsPlaying(false);
        // Hide board after a brief moment to ensure pause happens first
        setTimeout(() => {
          setIsBoardVisible(false);
          // Reset game state after hiding
          setTimeout(() => {
            setIsGameOver(false);
            setJustStarted(true);
            setScore(0);
          }, 0);
        }, 50);
      } else {
        // Show the board and reset game state if game was over
        if (isGameOver) {
          setIsGameOver(false);
          setJustStarted(true);
          setScore(0);
          setIsPlaying(false);
        }
        setIsBoardVisible(true);
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleClick = () => {
    if (!justStarted && !isGameOver) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div id="snakes-game-container" onClick={handleBodyClick} onDoubleClick={handleDoubleClick}>
      {/* Snake Gallery Button */}
              <div 
          style={{
            position: 'absolute',
            top: '70%',
            left: '90%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            zIndex: 1
          }}
                  onClick={(e) => {
            e.stopPropagation();
            if (justStarted) {
              setIsPlaying(true);
              setJustStarted(false);
              setScore(0);
              setIsBoardVisible(true);
            } else if (!isBoardVisible) {
              // Show the board if it's hidden
              if (isGameOver) {
                setIsGameOver(false);
                setJustStarted(true);
                setScore(0);
                setIsPlaying(false);
              }
              setIsBoardVisible(true);
              setIsPlaying(true);
            } else {
              // Pause animation first, then hide board
              setIsPlaying(false);
              // Hide board after a brief moment to ensure pause happens first
              setTimeout(() => {
                setIsBoardVisible(false);
                // Reset game state after hiding
                setTimeout(() => {
                  setIsGameOver(false);
                  setJustStarted(true);
                  setScore(0);
                }, 0);
              }, 50);
            }
          }}
      >
                  <img 
            src="/snake-gallery.png" 
            alt="Snake Game" 
            style={{
              width: '60px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
      </div>
      
      {!justStarted && isBoardVisible && (
        <SnakeBoard
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          externalScore={score}
          setScore={setScore}
          setIsGameOver={setIsGameOver}
          highScore={highScore}
          score={score}
          isGameOver={isGameOver}
        />
      )}
      {justStarted
        ? ""
        : ""}
    </div>
  );
}
