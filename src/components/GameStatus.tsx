import React from 'react';
import './GameStatus.css';

interface GameStatusProps {
  isGameStarted: boolean;
  isPlayerTurn: boolean;
  gameOver: boolean;
  winner: 'player' | 'ai' | null;
}

const GameStatus: React.FC<GameStatusProps> = ({
  isGameStarted,
  isPlayerTurn,
  gameOver,
  winner,
}) => {
  let statusMessage = '';

  if (gameOver) {
    statusMessage = winner === 'player' 
      ? 'Congratulations! You won the game!' 
      : 'Game over! The AI won this time.';
  } else if (!isGameStarted) {
    statusMessage = 'Place your ships to start the game';
  } else if (isPlayerTurn) {
    statusMessage = 'Your turn - Click on the opponent\'s board to fire';
  } else {
    statusMessage = 'AI is thinking...';
  }

  return (
    <div className={`game-status ${gameOver ? 'game-over' : ''}`}>
      {statusMessage}
    </div>
  );
};

export default GameStatus;
