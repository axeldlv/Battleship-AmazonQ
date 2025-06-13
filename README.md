# Battleship Game

A browser-based implementation of the classic Battleship game, where you play against an AI opponent.

Check technical blog here : [From Prompt to Play: Battleship Game Tutorial Using Amazon Q, React, and TypeScript](https://dev.to/aws-builders/from-prompt-to-play-battleship-game-tutorial-using-amazon-q-react-and-typescript-2jch)

## Features

- Classic 10x10 Battleship grid
- Standard ship sizes (5, 4, 3, 3, 2)
- Manual ship placement with horizontal/vertical orientation
- AI opponent with smart targeting logic
- Real-time game state updates without page reloads
- Victory/defeat modal when game ends

## Technologies Used

- TypeScript
- React
- CSS for styling

## How to Play

1. Place your ships on your board by:
   - Selecting a ship from the list
   - Choosing horizontal or vertical orientation
   - Clicking on your board to place the ship

2. Once all ships are placed, click "Start Game"

3. Take turns with the AI:
   - Click on the enemy board to fire at a position
   - The AI will automatically take its turn after you

4. The game ends when all ships of one player are sunk

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/battleship-game.git
```

2. Navigate to the project directory
```
cd battleship-game
```

3. Install dependencies
```
npm install
```

4. Start the development server
```
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Game Rules

- Each player has a fleet of 5 ships:
  - Carrier (5 cells)
  - Battleship (4 cells)
  - Cruiser (3 cells)
  - Submarine (3 cells)
  - Destroyer (2 cells)

- Ships cannot overlap or be placed diagonally
- Ships cannot be moved once placed
- Players take turns firing at the opponent's grid
- A hit is marked in red, a miss in blue
- A ship is sunk when all its cells are hit
- The game ends when all ships of one player are sunk

## License

This project is licensed under the MIT License - see the LICENSE file for details.
