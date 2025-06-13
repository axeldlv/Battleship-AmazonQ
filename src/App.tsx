import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import ShipPlacement from './components/ShipPlacement';
import GameStatus from './components/GameStatus';
import GameModal from './components/GameModal';
import ShipStatus from './components/ShipStatus';
import DestroyedShipNotification from './components/DestroyedShipNotification';
import { 
  BOARD_SIZE, 
  CellState, 
  GameBoard as GameBoardType, 
  GameState, 
  SHIPS, 
  ShipOrientation 
} from './models/types';
import { 
  initializeBoard, 
  placeShip, 
  canPlaceShip, 
  placeShipsRandomly, 
  processShot, 
  areAllShipsSunk, 
  getAIMove 
} from './utils/gameUtils';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerBoard: initializeBoard(),
    aiBoard: initializeBoard(),
    isGameStarted: false,
    isPlayerTurn: true,
    gameOver: false,
    winner: null,
    placingShipId: null,
    placingShipSize: null,
    placingShipOrientation: ShipOrientation.HORIZONTAL,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [destroyedShip, setDestroyedShip] = useState<{name: string | null, isPlayerShip: boolean}>({
    name: null,
    isPlayerShip: false
  });

  // Initialize the game
  useEffect(() => {
    resetGame();
  }, []);

  // AI turn logic
  useEffect(() => {
    if (gameState.isGameStarted && !gameState.isPlayerTurn && !gameState.gameOver) {
      // Add a small delay to make it feel like the AI is "thinking"
      const aiMoveTimeout = setTimeout(() => {
        const aiMove = getAIMove(gameState.playerBoard);
        handleAIMove(aiMove.x, aiMove.y);
      }, 1000);

      return () => clearTimeout(aiMoveTimeout);
    }
  }, [gameState.isGameStarted, gameState.isPlayerTurn, gameState.gameOver]);

  // Check for game over
  useEffect(() => {
    if (gameState.isGameStarted && !gameState.gameOver) {
      if (areAllShipsSunk(gameState.aiBoard)) {
        setGameState(prevState => ({
          ...prevState,
          gameOver: true,
          winner: 'player',
        }));
        setModalOpen(true);
      } else if (areAllShipsSunk(gameState.playerBoard)) {
        setGameState(prevState => ({
          ...prevState,
          gameOver: true,
          winner: 'ai',
        }));
        setModalOpen(true);
      }
    }
  }, [gameState.playerBoard, gameState.aiBoard, gameState.isGameStarted, gameState.gameOver]);

  const resetGame = () => {
    setGameState({
      playerBoard: initializeBoard(),
      aiBoard: initializeBoard(),
      isGameStarted: false,
      isPlayerTurn: true,
      gameOver: false,
      winner: null,
      placingShipId: null,
      placingShipSize: null,
      placingShipOrientation: ShipOrientation.HORIZONTAL,
    });
    setModalOpen(false);
    setDestroyedShip({ name: null, isPlayerShip: false });
  };

  const handleShipSelect = (shipId: number, size: number) => {
    setGameState(prevState => ({
      ...prevState,
      placingShipId: shipId,
      placingShipSize: size,
    }));
  };

  const handleOrientationToggle = () => {
    setGameState(prevState => ({
      ...prevState,
      placingShipOrientation:
        prevState.placingShipOrientation === ShipOrientation.HORIZONTAL
          ? ShipOrientation.VERTICAL
          : ShipOrientation.HORIZONTAL,
    }));
  };

  const handlePlayerBoardClick = (x: number, y: number) => {
    // If the game has started, player can't modify their board
    if (gameState.isGameStarted) return;

    // If no ship is selected for placement, do nothing
    if (gameState.placingShipId === null || gameState.placingShipSize === null) return;

    // Check if the ship can be placed at the selected position
    if (canPlaceShip(
      gameState.playerBoard,
      gameState.placingShipSize,
      x,
      y,
      gameState.placingShipOrientation
    )) {
      // Place the ship
      const updatedPlayerBoard = placeShip(
        gameState.playerBoard,
        gameState.placingShipId,
        gameState.placingShipSize,
        x,
        y,
        gameState.placingShipOrientation
      );

      setGameState(prevState => ({
        ...prevState,
        playerBoard: updatedPlayerBoard,
        placingShipId: null,
        placingShipSize: null,
      }));
    }
  };

  const handleAIBoardClick = (x: number, y: number) => {
    // If the game hasn't started or it's not the player's turn, do nothing
    if (!gameState.isGameStarted || !gameState.isPlayerTurn || gameState.gameOver) return;

    // Check if the cell has already been hit or missed
    const cell = gameState.aiBoard.cells[y][x];
    if (cell.state === CellState.HIT || cell.state === CellState.MISS) return;

    // Process the player's shot
    const { board: updatedAIBoard, shipSunk, shipName } = processShot(gameState.aiBoard, x, y);

    // Show notification if a ship was sunk
    if (shipSunk && shipName) {
      setDestroyedShip({
        name: shipName,
        isPlayerShip: false
      });
    }

    // Update the game state
    setGameState(prevState => ({
      ...prevState,
      aiBoard: updatedAIBoard,
      isPlayerTurn: false,
    }));
  };

  const handleAIMove = (x: number, y: number) => {
    // Process the AI's shot
    const { board: updatedPlayerBoard, shipSunk, shipName } = processShot(gameState.playerBoard, x, y);

    // Show notification if a ship was sunk
    if (shipSunk && shipName) {
      setDestroyedShip({
        name: shipName,
        isPlayerShip: true
      });
    }

    // Update the game state
    setGameState(prevState => ({
      ...prevState,
      playerBoard: updatedPlayerBoard,
      isPlayerTurn: true,
    }));
  };

  const startGame = () => {
    // Check if all ships have been placed
    const placedShipIds = gameState.playerBoard.ships.map(ship => ship.id);
    if (placedShipIds.length !== SHIPS.length) return;

    // Place AI ships randomly
    const aiBoard = placeShipsRandomly(initializeBoard(), SHIPS);

    setGameState(prevState => ({
      ...prevState,
      aiBoard,
      isGameStarted: true,
      isPlayerTurn: true,
    }));
  };

  const placedShipIds = gameState.playerBoard.ships.map(ship => ship.id);
  const allShipsPlaced = placedShipIds.length === SHIPS.length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Battleship Game</h1>
      </header>

      <div className="game-container">
        <GameStatus
          isGameStarted={gameState.isGameStarted}
          isPlayerTurn={gameState.isPlayerTurn}
          gameOver={gameState.gameOver}
          winner={gameState.winner}
        />

        {!gameState.isGameStarted && (
          <ShipPlacement
            placedShips={placedShipIds}
            placingShipId={gameState.placingShipId}
            placingShipOrientation={gameState.placingShipOrientation}
            onShipSelect={handleShipSelect}
            onOrientationToggle={handleOrientationToggle}
          />
        )}

        <div className="boards-container">
          <div className="board-wrapper">
            <h2 className="board-title">Your Fleet</h2>
            <GameBoard
              board={gameState.playerBoard}
              isPlayerBoard={true}
              isGameStarted={gameState.isGameStarted}
              placingShipSize={gameState.placingShipSize}
              placingShipOrientation={gameState.placingShipOrientation}
              onCellClick={handlePlayerBoardClick}
              showShips={true}
            />
            {gameState.isGameStarted && (
              <ShipStatus ships={gameState.playerBoard.ships} isPlayerShips={true} />
            )}
          </div>

          <div className="board-wrapper">
            <h2 className="board-title">Enemy Waters</h2>
            <GameBoard
              board={gameState.aiBoard}
              isPlayerBoard={false}
              isGameStarted={gameState.isGameStarted}
              placingShipSize={null}
              placingShipOrientation={ShipOrientation.HORIZONTAL}
              onCellClick={handleAIBoardClick}
              showShips={gameState.gameOver}
            />
            {gameState.isGameStarted && (
              <ShipStatus ships={gameState.aiBoard.ships} isPlayerShips={false} />
            )}
          </div>
        </div>

        <div className="game-controls">
          {!gameState.isGameStarted ? (
            <button
              className="start-button"
              onClick={startGame}
              disabled={!allShipsPlaced}
            >
              {allShipsPlaced ? 'Start Game' : 'Place All Ships to Start'}
            </button>
          ) : (
            <button className="reset-button" onClick={resetGame}>
              Reset Game
            </button>
          )}
        </div>
      </div>

      <GameModal
        isOpen={modalOpen}
        winner={gameState.winner}
        onClose={resetGame}
      />

      <DestroyedShipNotification
        shipName={destroyedShip.name}
        isPlayerShip={destroyedShip.isPlayerShip}
      />
    </div>
  );
};

export default App;
