# Armor Mayhem Clone - Replit Project

## Overview
A fully functional 2D platformer shooter game built with React, TypeScript, and HTML5 Canvas. This is a modern web remake of the Flash game "Armor Mayhem" featuring multiple levels, enemy AI, various weapons, particle effects, and player progression.

## Current State
- **Status**: Fully functional and ready to play
- **Last Updated**: October 17, 2025
- **Framework**: React 19 + TypeScript + Vite
- **Port**: 5000 (frontend only)

## Project Architecture

### Tech Stack
- **Frontend**: React 19.2.0, TypeScript 5.9.3, Vite 6.4.0
- **Game Engine**: Custom HTML5 Canvas-based engine with ECS pattern
- **Build System**: Vite with React plugin

### Key Features
- Fixed timestep game loop (60Hz updates)
- Entity-Component-System architecture
- Object pooling for projectiles and particles
- Camera system with smooth following
- AABB collision detection
- Web Audio API sound system
- Local storage for high scores

### File Structure
```
src/
├── components/     # React UI components (menu, HUD, screens)
├── engine/         # Core game engine (loop, input, camera)
├── entities/       # Game entities (player, enemy, projectile)
├── systems/        # Game systems (physics, collision, weapons, particles)
├── data/           # Game data (weapons, levels)
└── types/          # TypeScript types and utilities
```

## Development

### Running Locally
The dev server is configured in the "Game Dev Server" workflow and runs automatically. It serves on:
- Host: 0.0.0.0
- Port: 5000
- HMR: WebSocket via wss protocol for Replit proxy

### Controls
- **WASD**: Move (W/Space for jump)
- **Mouse**: Aim
- **Left Click**: Shoot
- **F**: Swap weapon
- **ESC**: Pause game

### Weapons
1. **Pistol**: 25 damage, 3 shots/sec, 12 rounds
2. **Shotgun**: 15 damage/pellet, 1 shot/sec, 6 rounds, 6 pellets
3. **Rifle**: 20 damage, 8 shots/sec, 30 rounds

### Levels
1. **Warehouse District**: 3 enemies, basic platforms
2. **Industrial Complex**: 5 enemies, more complex layout
3. **Tower Assault**: 8 enemies, challenging vertical design

## Configuration Notes

### Vite Configuration
The vite.config.ts is configured for Replit:
- Server binds to 0.0.0.0:5000 for external access
- HMR uses WebSocket over wss protocol with clientPort 443
- This ensures the proxy-based preview works correctly

### Replit-Specific Setup
- No backend component (frontend only)
- No database required (uses localStorage)
- No API keys needed
- Single workflow for the dev server
