# Super Mario Bros - 1:1 Recreation

A faithful 1:1 recreation of the classic Nintendo Super Mario Bros game, built with pure HTML5 Canvas and JavaScript. No external libraries or frameworks required.

## 🎮 Features

- **Complete Level 1-1**: Faithfully recreated the iconic first level with accurate tile placement, gaps, pipes, stairs, and the flagpole
- **Mario Character**: Small Mario, Big Mario, with walking, running, jumping, and crouching animations
- **Enemy System**: Goombas and Koopa Troopas with authentic AI behaviors
- **Power-up System**: Super Mushroom (grow big), Starman (invincibility), and coins
- **Block Interactions**: Breakable bricks, question blocks with hidden items, used blocks
- **Physics Engine**: Gravity, friction, acceleration, variable jump height, and precise collision detection
- **Sound Effects**: Procedurally generated retro sound effects (jump, coin, stomp, power-up, death, etc.)
- **Scoring System**: Points for enemies, blocks, coins, and flagpole height bonus
- **Lives System**: 3 lives, extra life at 100 coins
- **Pixel-Art Graphics**: NES-accurate color palette and sprite rendering

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `← →` or `A D` | Move left/right |
| `↑` or `W` or `Space` | Jump |
| `↓` or `S` | Crouch (Big Mario only) |
| `Shift` | Run (hold while moving) |

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Game

1. Clone the repository:
   ```bash
   git clone https://github.com/ITzoomix/opencode-chaojimali.git
   ```

2. Open `index.html` in your browser:
   ```bash
   # Option 1: Double-click the file
   # Option 2: Use a local server (recommended)
   npx serve .
   ```

3. Click anywhere or press `Space` to start playing!

## 📁 Project Structure

```
opencode-chaojimali/
├── index.html    # Main HTML file with canvas setup
└── game.js       # Complete game engine and logic
```

## 🏗️ Architecture

### Game Engine
- **Canvas Rendering**: 256×240 resolution (NES native) scaled 3× with pixel-perfect rendering
- **Game Loop**: `requestAnimationFrame`-based loop with update and render phases
- **Camera System**: Smooth scrolling camera that follows Mario

### Physics & Collision
- Tile-based collision detection (16×16 pixel tiles)
- Separate X and Y axis collision resolution
- Gravity, friction, and acceleration-based movement

### Entities
- **Mario**: Player character with state management (small/big/fire, invincibility, death)
- **Enemies**: Goomba, Koopa with walking, stomping, and shell mechanics
- **Items**: Mushroom, Star, Coin with spawning and collection logic
- **Particles**: Brick-breaking debris and score popups

### Audio
- Web Audio API for procedural sound generation
- Square, triangle, and sine wave oscillators
- Authentic NES-style sound effects

## 🎯 Gameplay

- Navigate through Level 1-1, avoiding or defeating enemies
- Hit `?` blocks to receive coins, mushrooms, or stars
- Break bricks when in Big Mario form
- Reach the flagpole at the end of the level
- Score bonus points based on flagpole height

## 📊 Scoring

| Action | Points |
|--------|--------|
| Stomp Goomba | 100 |
| Stomp Koopa | 100 |
| Kick Shell | 400 |
| Break Brick | 50 |
| Collect Coin | 200 |
| Collect Mushroom | 1000 |
| Collect Star | 1000 |
| Flagpole Bonus | Up to 5000 |

## 🛠️ Technical Details

- **Resolution**: 256×240 (NES native)
- **Tile Size**: 16×16 pixels
- **Level Width**: 220 tiles (3520 pixels)
- **Frame Rate**: 60 FPS
- **No Dependencies**: Pure vanilla JavaScript

## 📝 License

This is a fan-made recreation for educational purposes. Super Mario Bros is a trademark of Nintendo. All original game assets and characters belong to Nintendo.

## 🙏 Credits

- Original Game: Nintendo (1985)
- Recreation: Built with HTML5 Canvas & JavaScript
