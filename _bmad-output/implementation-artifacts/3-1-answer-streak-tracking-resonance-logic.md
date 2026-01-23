# Story 3.1: Answer Streak Tracking & Resonance Logic

Status: done

## Story

As a Player,
I want the game to track my correct answer streaks,
So that I can enter "Resonance Mode" for high performance.

## Acceptance Criteria

1. **Streak Counting**
   - **Given** the `GameStateManager`,
   - **When** a correct answer is submitted,
   - **Then** the `streak` counter increments by 1.
2. **Streak Reset**
   - **Given** a wrong answer,
   - **When** submitted,
   - **Then** the `streak` counter resets to 0.
3. **Resonance Trigger**
   - **Given** the streak counter,
   - **When** it reaches 5,
   - **Then** the state flag `isResonanceActive` becomes `true`.
4. **Data Sync**
   - **Given** a streak update or resonance activation,
   - **Then** the state is synchronized with Firebase (integrated into `SyncManager`).

## Tasks / Subtasks

- [x] Implement Streak Tracking in `GameStateManager`
  - [x] Add `streak` and `isResonanceActive` to state
  - [x] Update `evaluateAnswer` to handle streak logic
- [x] Network Synchronization
  - [x] Update `SyncManager` to include streak data in periodic updates
- [x] Unit Testing
  - [x] Verify streak increments on correct answers
  - [x] Verify streak resets on wrong answers
  - [x] Verify resonance activation at streak = 5

## Dev Notes

- **State Management**: Modify `src/game/state.ts`.
- **Sync Logic**: Modify `src/multiplayer/sync.ts`.
- **Threshold**: Use a constant for the resonance threshold (5).


## File List

- [src/game/state.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/state.ts)
- [src/game/constants.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/constants.ts)
- [src/multiplayer/sync.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/multiplayer/sync.ts)
- [src/main.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/main.ts)
- [src/game/state.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/state.test.ts)
- [src/multiplayer/sync.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/multiplayer/sync.test.ts)

## Change Log

- **2026-01-21**: streak tracking logic and network synchronization implemented and tested.

## Dev Agent Record

### Implementation Plan
- Add `streak` and `isResonanceActive` to `GameState`.
- Update `GameStateManager.submitAnswer` to track streaks and trigger resonance.
- Externalize `RESONANCE_STREAK_THRESHOLD` to `GAME_CONSTANTS`.
- Update `SyncManager` and `RemotePlayerState` to include streak data.
- Integrate streak data into `main.ts` loop.

### Completion Notes
- All unit tests pass (10/10 in state.test.ts, 12/12 in sync.test.ts).
- Network sync verified with updated mocks in `sync.test.ts`.

## References

- [Source: _bmad-output/epics.md#Story 3.1]
