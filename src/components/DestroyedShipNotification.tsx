import React, { useEffect, useState } from 'react';
import './DestroyedShipNotification.css';

interface DestroyedShipNotificationProps {
  shipName: string | null;
  isPlayerShip: boolean;
}

const DestroyedShipNotification: React.FC<DestroyedShipNotificationProps> = ({ 
  shipName, 
  isPlayerShip 
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (shipName) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shipName]);
  
  if (!shipName || !visible) {
    return null;
  }
  
  return (
    <div className={`destroyed-ship-notification ${isPlayerShip ? 'player' : 'enemy'}`}>
      <div className="notification-icon">💥</div>
      <div className="notification-text">
        {isPlayerShip ? 'Your' : 'Enemy'} {shipName} has been destroyed!
      </div>
    </div>
  );
};

export default DestroyedShipNotification;
