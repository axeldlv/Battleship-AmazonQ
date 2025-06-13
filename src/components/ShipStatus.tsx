import React from 'react';
import { Ship } from '../models/types';
import './ShipStatus.css';

interface ShipStatusProps {
  ships: Ship[];
  isPlayerShips: boolean;
}

const ShipStatus: React.FC<ShipStatusProps> = ({ ships, isPlayerShips }) => {
  const shipNames: { [key: number]: string } = {
    1: 'Carrier',
    2: 'Battleship',
    3: 'Cruiser',
    4: 'Submarine',
    5: 'Destroyer',
  };

  return (
    <div className="ship-status">
      <h3>{isPlayerShips ? 'Your Ships' : 'Enemy Ships'}</h3>
      <div className="ship-status-list">
        {ships.map((ship) => (
          <div 
            key={ship.id} 
            className={`ship-status-item ${ship.isSunk ? 'sunk' : ''}`}
          >
            <div className="ship-status-name">
              {shipNames[ship.id]}
              <span className="ship-size">({ship.size})</span>
            </div>
            <div className="ship-status-bar">
              <div 
                className="ship-status-health" 
                style={{ width: `${((ship.size - ship.hits) / ship.size) * 100}%` }}
              />
            </div>
            <div className="ship-status-text">
              {ship.isSunk ? 'DESTROYED' : `${ship.hits}/${ship.size}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipStatus;
