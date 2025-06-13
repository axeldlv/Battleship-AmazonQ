import React from 'react';
import './GameModal.css';

interface GameModalProps {
  isOpen: boolean;
  winner: 'player' | 'ai' | null;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, winner, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {winner === 'player' ? 'Victory!' : 'Defeat!'}
        </h2>
        <p className="modal-message">
          {winner === 'player'
            ? 'Congratulations! You have sunk all enemy ships!'
            : 'The AI has sunk all your ships. Better luck next time!'}
        </p>
        <button className="modal-button" onClick={onClose}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameModal;
