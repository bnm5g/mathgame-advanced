# Story 1.7: Race State & Win Condition

Status: done

## Story

As a Racer,
I want the race to end when I cross the finish line,
so that I have a clear goal and victory condition.

## Acceptance Criteria

1. [x] **Finish Detection**: The system must detect when `pos >= FINISH_LINE_DISTANCE` (1000 units).
2. [x] **State Transition**: Upon reaching the finish line, `isGameActive` must be set to `false` and a new `isRaceFinished` state must be triggered.
3. [x] **Victory UI**: Display a "RACE COMPLETE" overlay with the final elapsed time (formatted as MM:SS.ms).
4. [x] **Input Lock**: Keyboard inputs (1-4) must be disabled once the race is finished.
5. [x] **Physics Freeze**: The game loop must stop updating physics variables when the race is finished.

## Tasks/Subtasks
- [x] **Task 1: State & Logic Implementation**
    - [x] Define `FINISH_LINE_DISTANCE` constant.
    - [x] Update `GameState` to include `isRaceFinished` and `startTime`.
    - [x] Implement detection logic in `engine.ts` or `state.ts`.
- [x] **Task 2: UI & Feedback**
    - [x] Create a "Race Complete" overlay in `hud.ts`.
    - [x] Implement timer formatting logic for the final result.
- [x] **Task 3: Verification**
    - [x] Unit test: Verify state transition when `pos` >= threshold.
    - [x] Integration test: Verify physics loop stops and inputs are ignored after finish.

## Dev Agent Record
- **Model**: Antigravity
- **Completion Notes**:
    - Implemented `FINISH_LINE_DISTANCE = 1000` in `GameEngine`.
    - Added `isRaceFinished`, `raceStartTime`, and `raceEndTime` to `GameState`.
    - Created "RACE COMPLETE" overlay with `MM:SS.ms` formatting.
    - Verified logic with new tests in `engine.test.ts` and updated `state.test.ts`.
- **File List**:
    - `src/game/state.ts`
    - `src/game/engine.ts`
    - `src/game/constants.ts`
    - `src/ui/hud.ts`
    - `src/main.ts`
    - `src/game/state.test.ts`
    - `src/game/engine.test.ts`
    - `src/ui/hud.test.ts`
    - `src/questions/loader.ts`
    - `src/ui/telemetry.ts`
    - `src/utils/keyboard.ts`
    - `package.json`
