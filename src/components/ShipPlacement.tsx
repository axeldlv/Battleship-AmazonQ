import React from 'react';
import { SHIPS, ShipOrientation } from '../models/types';
import './ShipPlacement.css';

interface ShipPlacementProps {
  placedShips: number[];
  placingShipId: number | null;
  placingShipOrientation: ShipOrientation;
  onShipSelect: (shipId: number, size: number) => void;
  onOrientationToggle: () => void;
}

const ShipPlacement: React.FC<ShipPlacementProps> = ({
  placedShips,
  placingShipId,
  placingShipOrientation,
  onShipSelect,
  onOrientationToggle,
}) => {
  return (
    <div className="ship-placement">
      <h3>Place Your Ships</h3>
      
      <div className="orientation-toggle">
        <button 
          className={`orientation-button ${placingShipOrientation === ShipOrientation.HORIZONTAL ? 'active' : ''}`}
          onClick={onOrientationToggle}
        >
          {placingShipOrientation === ShipOrientation.HORIZONTAL ? 'Horizontal' : 'Vertical'}
        </button>
      </div>
      
      <div className="ships-list">
        {SHIPS.map((ship) => {
          const isPlaced = placedShips.includes(ship.id);
          const isSelected = placingShipId === ship.id;
          
          return (
            <div
              key={ship.id}
              className={`ship-item ${isPlaced ? 'placed' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (!isPlaced) {
                  onShipSelect(ship.id, ship.size);
                }
              }}
            >
              <div className="ship-name">{ship.name}</div>
              <div className="ship-size">
                {Array.from({ length: ship.size }).map((_, i) => (
                  <div key={i} className="ship-unit" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipPlacement;
