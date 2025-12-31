# Story 1.2: Physics Engine Foundation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Player,
I want the game to calculate physics based on Jerk, Acceleration, Velocity, and Position,
so that my vehicle moves according to real calculus principles.

## Acceptance Criteria

1. **Given** a `PhysicsEngine` class, **When** instantiated, **Then** it initializes all variables (pos, vel, acc, jerk) to 0.
2. **Given** a physics update tick, **When** `update(dt)` is called, **Then** `acc` increases by `jerk * dt`, `vel` increases by `acc * dt`, and `pos` increases by `vel * dt`.
3. **Given** the physics calculations, **When** running, **Then** results are rounded to 3 decimal places to ensure deterministic behavior.
4. **Given** a fixed tick rate (e.g. 30fps), **When** the render loop runs faster or slower, **Then** physics updates use an accumulated time pattern to stay independent of frame rate.

## Tasks / Subtasks

- [x] Implement `PhysicsEngine` class structure
  - [x] Define `IPhysicsState` interface 
  - [x] Initialize variables to 0
- [x] Implement Core Physics Loop
  - [x] Implement `update(dt)` method with derivative cascade
  - [x] Apply rounding logic (3 decimal places)
- [x] Implement Fixed Time Step Logic
  - [x] Add accumulator to `GameEngine` or `PhysicsEngine`
  - [x] Decouple render logic from physics logic
- [x] Integrate with `GameEngine`
  - [x] Instantiate `PhysicsEngine` in `GameEngine`
  - [x] Call `physics.update()` within the loop
- [x] Verify with Tests
  - [x] Test initialization
  - [x] Test derivative accumulation over multiple ticks

## Dev Notes

- **Architecture**: `PhysicsEngine` is a pure logic class, decoupled from UI. It updates the state.
- **Patterns**: Implemented fixed-timestep accumulator (30 FPS) in `GameEngine` to ensure deterministic physics across different frame rates.
- **Math**: Euler integration: `acc += jerk * dt`, `vel += acc * dt`, `pos += vel * dt`.
- **Rounding**: Values rounded to 3 decimal places per tick.

### Project Structure Notes

- `src/game/physics.ts` created for core physics logic.
- `src/game/engine.ts` refactored to handle fixed-timestep and integrate `PhysicsEngine`.

### References

- [Epics: Story 1.2](file:///d:/BMAD%20project/mathgame-advanced/_bmad-output/epics.md#story-12-physics-engine-foundation)
- [Project Context: Game Loop](file:///d:/BMAD%20project/mathgame-advanced/_bmad-output/project-context.md#critical-implementation-rules)

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

- Physics tests `physics.test.ts` passed initially, then expanded to cover all state rounding.
- Engine tests `engine.test.ts` required mock timing adjustments (100ms advancements) to reliably trigger the 33.3ms fixed-timestep logic.
- Verified accumulator precision fix (epsilon comparison) and magic number removal.
- Verified "spiral of death" protection by capping `frameTime` at 100ms.

### Completion Notes List

- Physics engine implemented with full derivative cascade.
- Game loop refactored for fixed-timestep (30 FPS).
- Observer pattern preserved and tested with multiple subscribers.

### File List

- [physics.ts](file:///d:/BMAD%20project/mathgame-advanced/src/game/physics.ts)
- [physics.test.ts](file:///d:/BMAD%20project/mathgame-advanced/src/game/physics.test.ts)
- [engine.ts](file:///d:/BMAD%20project/mathgame-advanced/src/game/engine.ts)
- [engine.test.ts](file:///d:/BMAD%20project/mathgame-advanced/src/game/engine.test.ts)
- [main.ts](file:///d:/BMAD%20project/mathgame-advanced/src/main.ts)
