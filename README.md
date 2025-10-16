# Armor Mayhem Clone

A fully functional 2D platformer shooter game built with React, TypeScript, and HTML5 Canvas. Features multiple levels, enemy AI, various weapons, particle effects, and player progression.

## Features

### Core Gameplay
- **Player Movement**: Smooth WASD movement with acceleration and variable jump height
- **Combat System**: Three weapons (Pistol, Shotgun, Rifle) with unique characteristics
- **Enemy AI**: State machine-based AI with patrol, chase, and attack behaviors
- **Physics**: Realistic gravity, collision detection, and platform interactions
- **Particle Effects**: Muzzle flashes, hit sparks, and dust particles

### Game Systems
- **Fixed Timestep Game Loop**: Consistent 60Hz updates with interpolated rendering
- **Object Pooling**: Optimized projectile and particle management
- **Camera System**: Smooth following with deadzone and boundary constraints
- **Collision Detection**: AABB-based collision with callback system
- **Sound System**: Web Audio API integration with placeholder sounds

### Levels
- **3 Unique Levels**: Warehouse District, Industrial Complex, and Tower Assault
- **Progressive Difficulty**: Increasing enemy count and complex layouts
- **Platform Variety**: Solid and one-way platforms

### UI Components
- Main menu with level selection
- In-game HUD showing health, weapon, ammo, score, and lives
- Pause menu
- Game over screen
- Level complete screen

## Controls

- **WASD**: Move (W/Space for jump)
- **Mouse**: Aim
- **Left Click**: Shoot
- **F**: Swap weapon
- **ESC**: Pause game

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # React UI components
│   ├── GameCanvas.tsx
│   ├── HUD.tsx
│   ├── Menu.tsx
│   ├── PauseScreen.tsx
│   ├── GameOverScreen.tsx
│   └── LevelCompleteScreen.tsx
├── engine/          # Core game engine
│   ├── Engine.ts
│   ├── GameLoop.ts
│   ├── InputManager.ts
│   └── Camera.ts
├── entities/        # Game entities
│   ├── Entity.ts
│   ├── Player.ts
│   ├── Enemy.ts
│   └── Projectile.ts
├── systems/         # Game systems
│   ├── PhysicsSystem.ts
│   ├── CollisionSystem.ts
│   ├── WeaponSystem.ts
│   ├── ParticleSystem.ts
│   ├── ProjectilePool.ts
│   ├── SoundManager.ts
│   ├── LevelManager.ts
│   └── StorageManager.ts
├── data/            # Game data
│   ├── weapons.ts
│   └── levels.ts
└── types/           # TypeScript types
    ├── Vec2.ts
    ├── Rect.ts
    └── index.ts
```

## Architecture

### Entity-Component-System Pattern
The game uses an ECS-inspired architecture where:
- **Entities**: Base objects with position, velocity, and tags
- **Systems**: Handle specific aspects (physics, collision, weapons)
- **Engine**: Coordinates all systems and entity updates

### Fixed Timestep Loop
- Updates run at fixed 60Hz for deterministic physics
- Rendering runs at variable framerate with interpolation
- Prevents "spiral of death" with frame time capping

### Object Pooling
- Projectiles and particles use pre-allocated pools
- Reduces garbage collection pressure
- Improves performance during intense combat

## Technical Details

### Physics
- Gravity: 980 px/s² (scaled Earth gravity)
- Ground friction: 0.85
- Air friction: 0.98
- AABB collision detection and resolution

### Weapons
- **Pistol**: 25 damage, 3 shots/sec, 12 rounds
- **Shotgun**: 15 damage/pellet, 1 shot/sec, 6 rounds, 6 pellets
- **Rifle**: 20 damage, 8 shots/sec, 30 rounds

### Performance
- Entity culling for off-screen objects
- Efficient collision detection with broad-phase
- High-DPI display support
- Optimized rendering pipeline

## Development Notes

### Challenges Solved
1. **TypeScript Strict Mode**: Handled null checks for array access and optional properties
2. **Projectile Spawning**: Implemented callback system for entity-to-engine communication
3. **Camera Deadzone**: Smooth following without jittery movement
4. **One-Way Platforms**: Proper collision detection from above only
5. **Weapon Spread**: Even distribution for shotgun pellets

### Future Enhancements
- Add more weapon types
- Implement power-ups and pickups
- Add boss enemies
- Include background music
- Add sprite-based graphics
- Implement multiplayer support

## License

MIT

## Credits

Built as a clone of the Flash game "Armor Mayhem" using modern web technologies.
