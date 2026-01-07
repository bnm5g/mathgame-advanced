# Story 1.6: Friction Spike Penalty

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Competitor,
I want to be penalized for guessing incorrectly,
so that accuracy is rewarded over blind guessing.

## Acceptance Criteria

1. [x] **Trigger Logic**: Submitting a wrong answer must trigger a "Friction Spike" state that remains active for 2.0 seconds.
2. [x] **Physics Drag**: While the Friction Spike is active, a friction coefficient of `0.95` must be applied to both `velocity` and `acceleration` during every physics tick in the `PhysicsEngine`.
3. [x] **Visual "Reboot" Effect**: When the spike is active, the HUD must flicker/flash red (`hsl(0, 100%, 50%)`), and a "DRAG ACTIVE" or "SYSTEM REBOOT" indicator must be visible.
4. [x] **Recovery**: After 2.0 seconds, the friction multiplier must return to 1.0 (no drag), and the visual indicator must disappear.

## Tasks/Subtasks
- [x] **Task 1: Physics Engine Modification** (AC: 2)
    - [x] Implement `0.95` friction multiplier in `PhysicsEngine.ts`.
    - [x] Ensure rounding to 3 decimal places is maintained.
- [x] **Task 2: State & Timing Management** (AC: 1, 4)
    - [x] Add `frictionSpikeEnd` timer to `GameState`.
    - [x] Update `GameStateManager` to set 2.0s penalty on wrong submission.
- [x] **Task 3: UI Feedback - The Reboot Effect** (AC: 3)
    - [x] Implement red flicker and screen shake in `hud.css`.
    - [x] Update `HUDManager.ts` to show "SYSTEM REBOOT" status text.
- [x] **Task 4: Verification**
    - [x] Unit tests for Physics multiplier.
    - [x] Unit tests for State timing.
    - [x] Unit tests for HUD class toggling.

## Dev Notes

- **Architecture Patterns**: The friction calculation belongs in the `PhysicsEngine` (Pure Logic), but the timer/duration belongs in `GameStateManager`.
- **UX Specs**: "The Reboot Effect" - Screen flickers red; HUD elements "shut down" briefly. CSS "Shake" animation is recommended. [Source: ux-design-specification.md#L323]
- **Source Tree**:
  - `src/game/physics.ts`: Apply friction multiplier.
  - `src/game/state.ts`: Manage timer and feedback state.
  - `src/ui/hud.ts`: Render reboot visuals.
  - `src/styles/components/hud.css`: Add flicker/shake animations.

### Project Structure Notes

- Matches existing modular separation: `game/` for logic, `ui/` for display.
- Uses `GameStateManager` as the single source of truth for the penalty state.

### References

- [Epic 1.6 Requirements](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/epics.md#L220)
- [UX Design - Friction Spike sensory feedback](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/ux-design-specification.md#L61)
- [Architecture - Friction Penalty mechanics](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/architecture.md#L28)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Thinking)

### Debug Log References

- Learnings from Story 1.5: Keep `PhysicsEngine` logic deterministic.
- UI Timing: Ensure `FEEDBACK_DELAY_MS` (1500ms) doesn't conflict with the 2000ms Friction Spike duration.

### Completion Notes List
- Implemented 0.95 friction multiplier for velocity and acceleration.
- Balanced timing: Penalty (2000ms) vs Feedback (1500ms) prevents state transitions while frozen.
- Added "Elon-mode" visual feedback with red flashes and HUD shaking.
- Improved system robustness by centralizing `PhysicsEngine` instance between State and Engine.

### File List
- [1-6-friction-spike-penalty.md](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/implementation-artifacts/1-6-friction-spike-penalty.md)
- [physics.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/physics.ts)
- [physics.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/physics.test.ts)
- [state.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/state.ts)
- [state.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/state.test.ts)
- [engine.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/engine.ts)
- [hud.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.ts)
- [hud.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.test.ts)
- [hud.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/components/hud.css)
- [main.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/main.ts)
- [loader.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/questions/loader.ts) (Implicit fix for Story 1.4/1.5 cleanup)
- [telemetry.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/telemetry.ts) (Visual polish)
- [keyboard.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/utils/keyboard.ts) (Improved input reliability)
