import { BOARD_SIZE, Cell, CellState, GameBoard, Ship, ShipOrientation } from '../models/types';

// Initialize an empty game board
export const initializeBoard = (): GameBoard => {
  const cells: Cell[][] = [];
  
  for (let y = 0; y < BOARD_SIZE; y++) {
    cells[y] = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      cells[y][x] = {
        x,
        y,
        state: CellState.EMPTY,
      };
    }
  }
  
  return {
    cells,
    ships: [],
  };
};

// Check if a ship can be placed at the given position
export const canPlaceShip = (
  board: GameBoard,
  shipSize: number,
  x: number,
  y: number,
  orientation: ShipOrientation
): boolean => {
  // Check if the ship would go out of bounds
  if (orientation === ShipOrientation.HORIZONTAL) {
    if (x + shipSize > BOARD_SIZE) return false;
  } else {
    if (y + shipSize > BOARD_SIZE) return false;
  }
  
  // Check if the ship would overlap with another ship
  for (let i = 0; i < shipSize; i++) {
    const checkX = orientation === ShipOrientation.HORIZONTAL ? x + i : x;
    const checkY = orientation === ShipOrientation.HORIZONTAL ? y : y + i;
    
    // Check if the cell is already occupied
    if (board.cells[checkY][checkX].state === CellState.SHIP) {
      return false;
    }
    
    // Check adjacent cells (no ships should touch)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const adjX = checkX + dx;
        const adjY = checkY + dy;
        
        if (
          adjX >= 0 && adjX < BOARD_SIZE &&
          adjY >= 0 && adjY < BOARD_SIZE &&
          board.cells[adjY][adjX].state === CellState.SHIP
        ) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// Place a ship on the board
export const placeShip = (
  board: GameBoard,
  shipId: number,
  shipSize: number,
  x: number,
  y: number,
  orientation: ShipOrientation
): GameBoard => {
  if (!canPlaceShip(board, shipSize, x, y, orientation)) {
    return board;
  }
  
  const newBoard = { ...board };
  const positions: { x: number; y: number }[] = [];
  
  // Place the ship on the board
  for (let i = 0; i < shipSize; i++) {
    const shipX = orientation === ShipOrientation.HORIZONTAL ? x + i : x;
    const shipY = orientation === ShipOrientation.HORIZONTAL ? y : y + i;
    
    newBoard.cells[shipY][shipX] = {
      ...newBoard.cells[shipY][shipX],
      state: CellState.SHIP,
      shipId,
    };
    
    positions.push({ x: shipX, y: shipY });
  }
  
  // Add the ship to the board's ships array
  const ship: Ship = {
    id: shipId,
    size: shipSize,
    positions,
    hits: 0,
    isSunk: false,
  };
  
  newBoard.ships.push(ship);
  
  return newBoard;
};

// Place ships randomly on the board (for AI)
export const placeShipsRandomly = (board: GameBoard, ships: { id: number; size: number }[]): GameBoard => {
  let newBoard = { ...board };
  
  ships.forEach(ship => {
    let placed = false;
    
    while (!placed) {
      const orientation = Math.random() < 0.5 ? ShipOrientation.HORIZONTAL : ShipOrientation.VERTICAL;
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      
      if (canPlaceShip(newBoard, ship.size, x, y, orientation)) {
        newBoard = placeShip(newBoard, ship.id, ship.size, x, y, orientation);
        placed = true;
      }
    }
  });
  
  return newBoard;
};

// Process a shot at the given coordinates
export const processShot = (board: GameBoard, x: number, y: number): { board: GameBoard; hit: boolean; shipSunk: Ship | null; shipName?: string } => {
  const newBoard = { ...board };
  const cell = newBoard.cells[y][x];
  
  // If the cell has already been hit or missed, return the board unchanged
  if (cell.state === CellState.HIT || cell.state === CellState.MISS) {
    return { board: newBoard, hit: false, shipSunk: null };
  }
  
  let hit = false;
  let shipSunk: Ship | null = null;
  let shipName: string | undefined;
  
  if (cell.state === CellState.SHIP) {
    // Hit a ship
    hit = true;
    newBoard.cells[y][x] = {
      ...cell,
      state: CellState.HIT,
    };
    
    // Update the ship's hit count
    const shipIndex = newBoard.ships.findIndex(ship => ship.id === cell.shipId);
    if (shipIndex !== -1) {
      const ship = { ...newBoard.ships[shipIndex] };
      ship.hits += 1;
      
      // Check if the ship is sunk
      if (ship.hits === ship.size) {
        ship.isSunk = true;
        shipSunk = ship;
        
        // Get ship name based on id
        const shipNames: { [key: number]: string } = {
          1: 'Carrier',
          2: 'Battleship',
          3: 'Cruiser',
          4: 'Submarine',
          5: 'Destroyer',
        };
        shipName = shipNames[ship.id];
      }
      
      newBoard.ships[shipIndex] = ship;
    }
  } else {
    // Miss
    newBoard.cells[y][x] = {
      ...cell,
      state: CellState.MISS,
    };
  }
  
  return { board: newBoard, hit, shipSunk, shipName };
};

// Check if all ships on a board are sunk
export const areAllShipsSunk = (board: GameBoard): boolean => {
  return board.ships.every(ship => ship.isSunk);
};

// AI logic to make a move
export const getAIMove = (playerBoard: GameBoard): { x: number; y: number } => {
  // First, check if there are any hit ships that aren't sunk yet
  const hitCells: Cell[] = [];
  
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = playerBoard.cells[y][x];
      if (cell.state === CellState.HIT && cell.shipId) {
        const ship = playerBoard.ships.find(s => s.id === cell.shipId);
        if (ship && !ship.isSunk) {
          hitCells.push(cell);
        }
      }
    }
  }
  
  // If there are hit cells, try to hit adjacent cells
  if (hitCells.length > 0) {
    // Sort hit cells to find patterns
    hitCells.sort((a, b) => {
      if (a.shipId !== b.shipId) return a.shipId! - b.shipId!;
      if (a.x !== b.x) return a.x - b.x;
      return a.y - b.y;
    });
    
    // Group hit cells by ship ID
    const hitShips: { [key: number]: Cell[] } = {};
    hitCells.forEach(cell => {
      if (!hitShips[cell.shipId!]) {
        hitShips[cell.shipId!] = [];
      }
      hitShips[cell.shipId!].push(cell);
    });
    
    // For each hit ship, try to find the next cell to hit
    for (const shipId in hitShips) {
      const cells = hitShips[shipId];
      
      // If there's only one hit cell, try all four directions
      if (cells.length === 1) {
        const cell = cells[0];
        const directions = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
        ];
        
        // Shuffle directions for randomness
        directions.sort(() => Math.random() - 0.5);
        
        for (const dir of directions) {
          const x = cell.x + dir.dx;
          const y = cell.y + dir.dy;
          
          if (
            x >= 0 && x < BOARD_SIZE &&
            y >= 0 && y < BOARD_SIZE &&
            playerBoard.cells[y][x].state !== CellState.HIT &&
            playerBoard.cells[y][x].state !== CellState.MISS
          ) {
            return { x, y };
          }
        }
      } else {
        // If there are multiple hit cells, determine the orientation
        let isHorizontal = true;
        let isVertical = true;
        
        for (let i = 1; i < cells.length; i++) {
          if (cells[i].x !== cells[0].x) {
            isVertical = false;
          }
          if (cells[i].y !== cells[0].y) {
            isHorizontal = false;
          }
        }
        
        if (isHorizontal) {
          // Ship is horizontal, try left and right
          cells.sort((a, b) => a.x - b.x);
          
          // Try right
          const rightX = cells[cells.length - 1].x + 1;
          const y = cells[0].y;
          if (
            rightX < BOARD_SIZE &&
            playerBoard.cells[y][rightX].state !== CellState.HIT &&
            playerBoard.cells[y][rightX].state !== CellState.MISS
          ) {
            return { x: rightX, y };
          }
          
          // Try left
          const leftX = cells[0].x - 1;
          if (
            leftX >= 0 &&
            playerBoard.cells[y][leftX].state !== CellState.HIT &&
            playerBoard.cells[y][leftX].state !== CellState.MISS
          ) {
            return { x: leftX, y };
          }
        } else if (isVertical) {
          // Ship is vertical, try up and down
          cells.sort((a, b) => a.y - b.y);
          
          // Try down
          const bottomY = cells[cells.length - 1].y + 1;
          const x = cells[0].x;
          if (
            bottomY < BOARD_SIZE &&
            playerBoard.cells[bottomY][x].state !== CellState.HIT &&
            playerBoard.cells[bottomY][x].state !== CellState.MISS
          ) {
            return { x, y: bottomY };
          }
          
          // Try up
          const topY = cells[0].y - 1;
          if (
            topY >= 0 &&
            playerBoard.cells[topY][x].state !== CellState.HIT &&
            playerBoard.cells[topY][x].state !== CellState.MISS
          ) {
            return { x, y: topY };
          }
        }
      }
    }
  }
  
  // If no good targets found, make a random move
  const emptyCells: { x: number; y: number }[] = [];
  
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (
        playerBoard.cells[y][x].state !== CellState.HIT &&
        playerBoard.cells[y][x].state !== CellState.MISS
      ) {
        emptyCells.push({ x, y });
      }
    }
  }
  
  if (emptyCells.length === 0) {
    // This shouldn't happen, but just in case
    return { x: 0, y: 0 };
  }
  
  // Return a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};
