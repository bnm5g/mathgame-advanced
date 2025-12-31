# Story 1.2: Physics Engine Foundation

Status: in-progress

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

- [ ] Implement `PhysicsEngine` class structure
  - [ ] Define `IPhysicsState` interface 
  - [ ] Initialize variables to 0
- [ ] Implement Core Physics Loop
  - [ ] Implement `update(dt)` method with derivative cascade
  - [ ] Apply rounding logic (3 decimal places)
- [ ] Implement Fixed Time Step Logic
  - [ ] Add accumulator to `GameEngine` or `PhysicsEngine`
  - [ ] Decouple render logic from physics logic
- [ ] Integrate with `GameEngine`
  - [ ] Instantiate `PhysicsEngine` in `GameEngine`
  - [ ] Call `physics.update()` within the loop
- [ ] Verify with Tests
  - [ ] Test initialization
  - [ ] Test derivative accumulation over multiple ticks

## Dev Notes

- **Architecture**: `PhysicsEngine` should be a pure logic class, decoupled from UI. It updates the state.
- **Patterns**: Use `accumulator` pattern for the game loop stability (fix your timestep!).
- **Math**: Use simple Euler integration for now: `val += rate * dt`.
- **Rounding**: `Math.round(num * 1000) / 1000` is sufficient.

### Project Structure Notes

- `src/game/physics.ts` is the target file.
- `src/game/engine.ts` will need modification to support the fixed update loop.

### References

- [Epics: Story 1.2](file:///d:/BMAD%20project/mathgame-advanced/_bmad-output/epics.md#story-12-physics-engine-foundation)
- [Project Context: Game Loop](file:///d:/BMAD%20project/mathgame-advanced/_bmad-output/project-context.md#critical-implementation-rules)

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

### File List
