# Implementation Plan

- [x] 1. Set up project structure and development environment









  - Initialize Vite + React + TypeScript project with proper configuration
  - Configure tsconfig.json for strict type checking
  - Set up project folder structure: src/engine, src/entities, src/systems, src/components, src/types, src/assets
  - Install necessary dependencies (React, TypeScript, Vite)
  - _Requirements: 10.5_

- [x] 2. Implement core math and utility types






  - [x] 2.1 Create Vec2 class for 2D vector operations

    - Implement Vec2 with x, y properties and methods: add, subtract, multiply, normalize, length, distance
    - _Requirements: 1.1, 1.3, 5.1_
  

  - [x] 2.2 Create Rect class for bounding boxes

    - Implement Rect with x, y, width, height and collision detection methods
    - _Requirements: 5.5_
  
  - [x] 2.3 Define core type definitions


    - Create EntityID type, GameState enum, and common interfaces
    - _Requirements: All_

- [x] 3. Implement InputManager







  - [x] 3.1 Create InputManager class with keyboard and mouse tracking





    - Implement key state tracking with Map<string, boolean>
    - Implement mouse position tracking relative to canvas
    - Implement mouse button state tracking
    - Add event listeners for keydown, keyup, mousemove, mousedown, mouseup
    - Create a commit of the latest implementation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 3.2 Write unit tests for InputManager
    - Test key state tracking and mouse position calculations
    - _Requirements: 1.1, 1.2, 1.3_
    
- [x] 4. Implement GameLoop with fixed timestep

  - [x] 4.1 Create GameLoop class with accumulator pattern



    - Implement fixed 60Hz update rate (16.67ms timestep)
    - Implement accumulator for frame time handling
    - Calculate interpolation alpha for smooth rendering
    - Use requestAnimationFrame for render loop
    - Create a commit of the latest implementation

    - _Requirements: 10.1_
  
  - [ ]* 4.2 Write unit tests for GameLoop timing
    - Test fixed timestep accumulation and alpha calculation
    - _Requirements: 10.1_


- [x] 5. Implement base Entity class and entity management

  - [x] 5.1 Create abstract Entity base class

    - Implement properties: id, position, velocity, size, active, tags
    - Implement getBounds() method for AABB
    - Implement hasTag() method for entity queries
    - Define abstract update() and render() methods
    - _Requirements: 5.5_
  
  - [x] 5.2 Implement entity registry in Engine


    - Create Map<EntityID, Entity> for entity storage
    - Implement spawn() method with unique ID generation
    - Implement despawn() method for entity removal
    - Implement getEntity() and queryEntities() methods
    - Create a commit of the latest implementation
    - _Requirements: All_



- [ ] 6. Implement PhysicsSystem
  - [ ] 6.1 Create PhysicsSystem class with gravity and collision
    - Implement gravity application to entities
    - Implement velocity integration
    - Implement platform collision detection using AABB
    - Implement collision resolution (move entity to platform surface)
    - Implement ground friction when entity is grounded
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 6.2 Write unit tests for physics calculations
    - Test gravity, collision detection, and friction


    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 7. Implement CollisionSystem
  - [ ] 7.1 Create CollisionSystem with AABB collision detection
    - Implement broad-phase collision detection
    - Implement AABB overlap test
    - Implement collision response callbacks
    - Handle projectile-entity collisions
    - Create a commit of the latest implementation

    - _Requirements: 5.4, 5.5_
  


  - [ ]* 7.2 Write unit tests for collision detection
    - Test AABB overlap detection with various scenarios
    - _Requirements: 5.4, 5.5_



- [ ] 8. Implement weapon system and definitions
  - [ ] 8.1 Create WeaponDef interface and weapon data
    - Define WeaponDef with properties: name, damage, fireRate, magazineSize, reloadTime, projectileSpeed, spread, projectileCount
    - Create weapon definitions for pistol, shotgun, and rifle
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 8.2 Create WeaponSystem class
    - Implement fire rate limiting with cooldown tracking
    - Implement magazine and ammo tracking
    - Implement reload mechanics with timer


    - Implement projectile spawning with spread for shotgun
    - Implement weapon switching logic
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [-]* 8.3 Write unit tests for weapon mechanics

    - Test fire rate limiting, reload timing, and ammo tracking
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 9. Implement Projectile entity with object pooling
  - [ ] 9.1 Create Projectile class extending Entity
    - Implement properties: owner, damage, lifetime, speed
    - Implement straight-line movement
    - Implement lifetime countdown and auto-despawn
    - Implement onHit() method for collision response
    - _Requirements: 5.4_
  
  - [x] 9.2 Implement object pool for projectiles

    - Create ProjectilePool class with pre-allocated projectiles
    - Implement acquire() and release() methods
    - Integrate pool with WeaponSystem
    - Create a commit of the latest implementation
    - _Requirements: 10.2_
  
  - [ ]* 9.3 Write unit tests for projectile behavior
    - Test movement, lifetime, and collision handling
    - _Requirements: 5.4_

- [ ] 10. Implement Player entity
  - [x] 10.1 Create Player class extending Entity


    - Implement properties: health, maxHealth, moveSpeed, jumpForce, currentWeapon, weapons, grounded, aimAngle
    - Implement movement with smooth acceleration (WASD input)
    - Implement variable jump height based on space key hold duration
    - Implement aim angle calculation from mouse position
    - Implement shoot() method that calls WeaponSystem
    - Implement swapWeapon() method for weapon cycling
    - Implement takeDamage() method with knockback
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 10.2 Write unit tests for player mechanics
    - Test movement, jumping, aiming, and damage handling
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 11. Implement Enemy entity with AI
  - [x] 11.1 Create Enemy class extending Entity



    - Implement properties: health, aiState, sightRadius, attackRange, patrolPoints, currentPatrolIndex, attackCooldown
    - Implement AI state machine: idle, patrol, chase, attack
    - Implement patrol behavior with waypoint navigation
    - Implement player detection within sightRadius
    - Implement chase behavior moving toward player
    - Implement attack behavior with cooldown
    - Implement takeDamage() method
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 11.2 Write unit tests for enemy AI
    - Test state transitions and behavior logic
    - _Requirements: 4.1, 4.2, 4.3, 4.4_


- [ ] 12. Implement ParticleSystem with object pooling
  - [ ] 12.1 Create Particle class and ParticleSystem

    - Implement Particle with position, velocity, lifetime, color, size
    - Implement ParticleSystem with particle pool
    - Implement muzzle flash effect spawning
    - Implement hit spark effect spawning
    - Implement dust particle effect spawning
    - Implement particle update (movement, lifetime decay, fade)
    - Implement particle rendering
    - Create a commit of the latest implementation
    - _Requirements: 3.1, 3.2, 3.3, 10.3_
  
  - [ ]* 12.2 Write unit tests for particle system
    - Test particle lifecycle and pooling
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 13. Implement sound system
  - [ ] 13.1 Create SoundManager using Web Audio API
    - Implement sound loading and caching
    - Implement play() method with volume control
    - Load sound effects: shoot, jump, hit, death
    - Integrate sound triggers in Player, Enemy, and Projectile
    - _Requirements: 3.4, 3.5, 3.6_
  
  - [ ]* 13.2 Write unit tests for sound playback
    - Test sound loading and playback triggering
    - _Requirements: 3.4, 3.5, 3.6_

- [ ] 14. Implement LevelManager and level data
  - [ ] 14.1 Create Level interface and level data structure
    - Define Level interface with platforms, enemySpawns, playerSpawn, bounds
    - Create at least 3 level definitions with different layouts
    - _Requirements: 6.1, 6.5_
  
  - [ ] 14.2 Create LevelManager class
    - Implement level loading from level data
    - Implement platform spawning
    - Implement enemy spawning at designated positions
    - Implement player spawning at spawn point
    - Implement level transition logic
    - Implement level completion detection
    - Implement player respawn on death
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 14.3 Write unit tests for level management
    - Test level loading and entity spawning
    - _Requirements: 6.2, 6.3, 6.4_

- [ ] 15. Implement camera system
  - [ ] 15.1 Create Camera class with follow behavior
    - Implement camera position tracking player
    - Implement deadzone to reduce excessive movement
    - Implement camera bounds constraint within level
    - Implement world-to-screen coordinate transformation
    - Apply camera offset to all rendering
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 15.2 Write unit tests for camera calculations
    - Test camera follow logic and bounds constraints
    - _Requirements: 12.1, 12.2, 12.4_

- [ ] 16. Implement Engine core coordination
  - [ ] 16.1 Create Engine class integrating all systems
    - Initialize all systems: PhysicsSystem, CollisionSystem, WeaponSystem, ParticleSystem
    - Implement update() method calling systems in correct order
    - Implement render() method with camera transformation
    - Implement game state management (playing, paused, gameOver)
    - Implement entity culling for off-screen entities
    - Integrate InputManager for player control
    - Integrate LevelManager for level management
    - _Requirements: All, 10.4_
  
  - [ ]* 16.2 Write integration tests for engine
    - Test system coordination and entity lifecycle
    - _Requirements: All_

- [ ] 17. Implement React UI components
  - [ ] 17.1 Create GameCanvas component
    - Create React component with canvas ref
    - Initialize Engine on mount
    - Start GameLoop on mount
    - Handle canvas resize and pixel ratio
    - Clean up on unmount
    - _Requirements: 10.5_
  
  - [ ] 17.2 Create HUD component
    - Display player health bar
    - Display current weapon name
    - Display current ammo count
    - Display player score
    - Display remaining lives
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 17.3 Create Menu component
    - Create main menu with start, difficulty select, level select buttons
    - Implement navigation to game on start
    - Style menu with CSS
    - _Requirements: 11.1, 11.2_
  
  - [ ] 17.4 Create PauseScreen component
    - Display pause menu when game is paused
    - Implement resume button
    - Implement restart button
    - Implement quit to menu button
    - _Requirements: 8.1, 8.3, 8.4, 8.5_
  
  - [ ] 17.5 Create GameOverScreen component
    - Display game over message
    - Display final score
    - Implement restart button
    - Implement return to menu button
    - _Requirements: 11.3, 11.5_
  
  - [ ] 17.6 Create LevelCompleteScreen component
    - Display level complete message
    - Display level score
    - Implement next level button
    - Implement return to menu button
    - _Requirements: 11.4, 11.5_

- [ ] 18. Implement game state management in App
  - [ ] 18.1 Create App component with state management
    - Implement game state: menu, playing, paused, gameOver, levelComplete
    - Implement state transitions between screens
    - Conditionally render components based on game state
    - Pass callbacks to Engine for state changes
    - _Requirements: 8.1, 11.1, 11.2, 11.3, 11.4_
  
  - [ ]* 18.2 Write integration tests for state transitions
    - Test navigation between game states
    - _Requirements: 8.1, 11.1, 11.2_

- [ ] 19. Implement pause functionality
  - [ ] 19.1 Add pause handling to Engine and GameLoop
    - Implement pause() and resume() methods in Engine
    - Stop game updates when paused
    - Continue rendering when paused (frozen frame)
    - Listen for Escape key to toggle pause
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 19.2 Write unit tests for pause mechanics
    - Test pause state and update blocking
    - _Requirements: 8.1, 8.2_

- [ ] 20. Implement persistence with localStorage
  - [ ] 20.1 Create StorageManager for save/load
    - Implement saveProgress() method saving to localStorage
    - Implement loadProgress() method loading from localStorage
    - Store best scores per level
    - Store unlocked levels
    - Use JSON format for data
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 20.2 Integrate persistence with game flow
    - Save progress on level completion
    - Load progress on game start
    - Update HUD with loaded data
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 20.3 Write unit tests for storage operations
    - Test save and load with mock localStorage
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 21. Create placeholder assets and rendering
  - [ ] 21.1 Implement basic rendering for all entities
    - Render Player as colored rectangle with weapon line
    - Render Enemy as colored rectangle with direction indicator
    - Render Projectile as small circle
    - Render platforms as rectangles
    - Render particles as colored circles with alpha
    - _Requirements: All_
  
  - [ ] 21.2 Add visual polish
    - Implement sprite rotation for player weapon
    - Add health bars above entities
    - Add visual feedback for damage (flash effect)
    - Ensure crisp rendering on high-DPI displays
    - _Requirements: 1.3, 10.5_

- [ ] 22. Final integration and polish
  - [ ] 22.1 Test complete game flow
    - Test main menu to game transition
    - Test level progression through all 3 levels
    - Test pause and resume functionality
    - Test game over and restart
    - Test persistence across browser sessions
    - _Requirements: All_
  
  - [ ] 22.2 Performance optimization
    - Verify 60 FPS performance
    - Verify object pooling is working
    - Verify entity culling is working
    - Profile and optimize hot paths if needed
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 22.3 Create README documentation
    - Document how to run the project
    - Document controls and gameplay
    - Document architecture overview
    - _Requirements: All_
