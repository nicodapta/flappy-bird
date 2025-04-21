# Flappy Bird Game

A modern implementation of the classic Flappy Bird game using HTML5 Canvas and JavaScript. This version features smooth animations, dynamic cloud generation, and a desert-themed aesthetic with cactus obstacles.

## Features

- Smooth bird movement with gravity physics
- Dynamic cloud generation and animation
- Desert-themed obstacles (cactus pipes)
- Score tracking
- Start screen with game controls
- Responsive design
- Beautiful gradient background
- Collision detection

## How to Play

1. Click the "Start Game" button to begin
2. Press the spacebar or click to make the bird jump
3. Navigate through the gaps between the cactus pipes
4. Each successful passage through a pipe increases your score
5. Avoid hitting the pipes or the ground
6. Try to achieve the highest score possible!

## Technical Details

The game is built using:

- HTML5 Canvas for rendering
- Vanilla JavaScript for game logic
- CSS for styling and animations
- Node.js and Express for server deployment

### Game Components

- **Bird**: Controlled by the player, affected by gravity and jump mechanics
- **Pipes**: Cactus-themed obstacles that move from right to left
- **Clouds**: Dynamically generated background elements
- **Ground**: The bottom boundary of the game
- **Score**: Tracks successful pipe passages

## How to Run Locally

1. Clone this repository to your local machine
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Deploying to Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create
   ```
4. Deploy your code:
   ```bash
   git push heroku main
   ```
5. Open your app:
   ```bash
   heroku open
   ```

## Browser Compatibility

The game works best in modern browsers that support HTML5 Canvas:

- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## Controls

- Spacebar or Mouse Click: Make the bird jump
- Start Button: Begin a new game
- Close and reopen browser: Reset the game

## Development

The project consists of the following files:

- `index.html`: Game structure and canvas setup
- `style.css`: Visual styling and animations
- `game.js`: Game logic and mechanics
- `server.js`: Express server setup
- `package.json`: Project dependencies and scripts
- `Procfile`: Heroku deployment configuration

Feel free to modify the game parameters in `game.js` to adjust difficulty, speed, or visual elements!
