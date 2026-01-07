# Story 1.5: Strategic Allocation

Status: done

## Story

As a Strategist,
I want to allocate my earned points to Position, Velocity, Acceleration, or Jerk,
so that I can influence my car's movement physics.

## Acceptance Criteria

1. [x] **Strategic HUD Overlay**: When `holdingValue` > 0 and the game enters the "Allocation Phase", the HUD must clear the question and display four tactical options (1: Pos, 2: Vel, 3: Acc, 4: Jerk).
2. [x] **Physics Injection**: Pressing the corresponding key (1-4) during the Allocation Phase must immediately add the full `holdingValue` to that specific variable within the `PhysicsEngine`.
3. [x] **Sequential Flow**: After allocation, the `holdingValue` must reset to 0, and the game must cycle back to the "Question Phase" after a brief visual confirmation (e.g., 500ms).
4. [x] **Input Shifting**: Inputs 1-4 must stop being processed as math answers and start being processed as allocation choices when the Allocation Phase is active.
5. [x] **Visual Feedback**: The Telemetry Sidebar or HUD must provide color-coded visual feedback (e.g., flashing the target variable's neon accent) to confirm the investment.

## Tasks / Subtasks

- [x] Task 1: Engine & State Enhancement (AC: 2, 3)
    - [x] Add `setAllocationState(active: boolean)` to `GameState`
    - [x] Implement `PhysicsEngine.addValue(variable, value)` with 3-decimal rounding
    - [x] Update `GameStateManager.allocatePoints(index)` to apply points and reset `holdingValue`
- [x] Task 2: HUD Allocation View (AC: 1, 5)
    - [x] Create `renderAllocationPhase()` in `HUDManager`
    - [x] Add CSS transitions for switching between Question and Allocation HUD states
    - [x] Implement visual highlighting in the sidebar during allocation
- [x] Task 3: Input Routing & Flow Control (AC: 4)
    - [x] Update `main.ts` to check `gameState.isAllocationActive` before calling `submitAnswer`
    - [x] Connect `InputManager` to `gameStateManager.allocatePoints()`
- [x] Task 4: Verification (AC: All)
    - [x] Unit tests for `PhysicsEngine` increments
    - [x] Unit tests for `GameStateManager` phase transitions
    - [x] Integration test: Answer Correct -> Earn Points -> Allocate to Acceleration -> Physics Update

## Dev Notes

- **Architecture Compliance**: Keep the `PhysicsEngine` pure; only `GameStateManager` should orchestrate the flow.
- **State Transition**: `submitAnswer (correct)` -> `feedbackState (correct)` -> `isAllocationActive (true)` -> `allocatePoints()` -> `isAllocationActive (false)` -> `nextQuestion()`.
- **Naming**: Use `pos`, `vel`, `acc`, `jerk` consistently.
- **Source Tree**:
    - `src/game/physics.ts`: Add increment logic.
    - `src/game/state.ts`: Add allocation state and logic.
    - `src/ui/hud.ts`: Add allocation rendering.
    - `src/main.ts`: Handle input routing.

### References

- [Epic 1.5 Requirements](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/epics.md#L201)
- [Architecture State Management](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/architecture.md#L290)
- [UX Color System](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/ux-design-specification.md#L168)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Thinking)

### Debug Log References

- Verified physics rounding logic for Jerk -> Acc -> Vel -> Pos cascade.
- Fixed `GameState` interface to include `isAllocationActive`.
- Resolved lint errors regarding `private engine` access and type-only imports.

### Completion Notes List

- ✅ Successfully implemented "Solve -> Invest" gameplay loop.
- ✅ Correct math answers now award points to `holdingValue`.
- ✅ HUD automatically switches to blue "ALLOCATE POWER" mode after answer feedback.
- ✅ Strategic choices (1-4) now update the car's physical properties.
- ✅ **[FIXED]** Added 500ms delay after allocation for visual confirmation (AC3).
- ✅ **[FIXED]** Implemented Telemetry Sidebar with investment flash animations (AC5).
- ✅ All core logic verified with unit and integration tests (12 tests total).

### File List

- [src/game/physics.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/physics.ts)
- [src/game/state.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/state.ts)
- [src/ui/hud.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.ts)
- [src/ui/telemetry.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/telemetry.ts)
- [src/main.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/main.ts)
- [src/questions/loader.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/questions/loader.ts)
- [src/utils/keyboard.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/utils/keyboard.ts)
- [src/styles/index.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/index.css)
- [src/styles/components/hud.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/components/hud.css)
- [src/game/physics.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/physics.test.ts)
- [src/game/allocation-flow.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/allocation-flow.test.ts)
