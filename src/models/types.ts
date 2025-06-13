export enum CellState {
  EMPTY = 'empty',
  SHIP = 'ship',
  HIT = 'hit',
  MISS = 'miss',
}

export enum ShipOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export interface Cell {
  x: number;
  y: number;
  state: CellState;
  shipId?: number;
}

export interface Ship {
  id: number;
  size: number;
  positions: { x: number; y: number }[];
  hits: number;
  isSunk: boolean;
}

export interface GameBoard {
  cells: Cell[][];
  ships: Ship[];
}

export interface GameState {
  playerBoard: GameBoard;
  aiBoard: GameBoard;
  isGameStarted: boolean;
  isPlayerTurn: boolean;
  gameOver: boolean;
  winner: 'player' | 'ai' | null;
  placingShipId: number | null;
  placingShipSize: number | null;
  placingShipOrientation: ShipOrientation;
}

export const BOARD_SIZE = 10;

export const SHIPS = [
  { id: 1, size: 5, name: 'Carrier' },
  { id: 2, size: 4, name: 'Battleship' },
  { id: 3, size: 3, name: 'Cruiser' },
  { id: 4, size: 3, name: 'Submarine' },
  { id: 5, size: 2, name: 'Destroyer' },
];
