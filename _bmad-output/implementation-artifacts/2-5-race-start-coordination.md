# Story 2.5: Race Start Coordination

Status: done

## Story

As a Host,
I want to start the race for everyone simultaneously,
So that the competition is fair.

## Acceptance Criteria

1. **Host Start (Trigger)**
   - **Given** I am the Host in the Waiting Room,
   - **When** I click "Start Race",
   - **Then** the room status in Firebase updates to `COUNTDOWN`.
   - **Constraint**: Only the Host (creator/first player) can trigger this.

### Code Review (2026-01-14)
- **Architecture**: Identified memory leak in `listenToStatus` (missing unsubscribe).
  - **Fix**: Updated `listenToStatus` to return unsubscribe function. Updated `LobbyManager` to clean up listener on hide/unmount.
- **Type Safety**: Removed `any` usage in catch blocks.
  - **Fix**: Replaced with `unknown` and `instanceof Error` checks.
- **Verification**: User confirmed manual test success. Tests passing.
2. **Countdown Synchronization (Visual)**
   - **Given** a status change to `COUNTDOWN` in Firebase,
   - **When** received by any client (Host or Guest),
   - **Then** a 3-2-1 visual countdown begins locally.
   - **Constraint**: All clients must start countdown approximately simultaneously (within <200ms).

3. **Race Start (Logic)**
   - **Given** the countdown finishes (0),
   - **When** it hits 0,
   - **Then** the game state changes to `RACE_ACTIVE`.
   - **And** input is enabled for all players.
   - **And** physics simulation starts locally.

4. **Late Join Handling**
   - **Given** a race is already in countdown or active,
   - **When** a new player attempts to join,
   - **Then** they should be blocked or join as spectator (for MVP, blocking is acceptable or 'waiting for next race').
   - *Refined for MVP*: Access denied with "Race in Progress".

## Dev Notes

### Architecture Context
- **Module**: `src/multiplayer/lobby.ts` (Host controls) & `src/game/state.ts` (Race start state)
- **Firebase Schema**:
  ```
  /rooms/{roomId}/status: "WAITING" | "COUNTDOWN" | "RACE" | "FINISHED"
  /rooms/{roomId}/startTime: timestamp (optional, for precise sync if needed)
  ```
- **Responsibilities**:
  - `LobbyManager`: Listen for status changes. Render countdown overlay. Switch to Game View.
  - `GameStateManager`: Handle state transitions (`isGameActive`).
  - `InputManager`: Unlock inputs when race starts.

### Technical Requirements
- **Countdown Timer**: Simple 3-second `setTimeout` or `setInterval` sequences triggered by Firebase listener.
- **State Transition**:
  1. Host clicks Start -> Writes `status: COUNTDOWN` to Firebase.
  2. All Clients listen to `/rooms/{roomId}/status`.
  3. On `COUNTDOWN` -> Show "3... 2... 1..." (Canvas or HTML Overlay).
  4. On 0 -> Set `status: RACE` (Host writes this, or local derivation?).
     - *Simpler*: `COUNTDOWN` implies a fixed duration (3s). Clients switch to local `RACE` state after 3s automatically.
     - *Robust*: Host writes `startTime` = `serverTimestamp + 3000ms`. All clients sync to that time.
     - *MVP Approach*: Host writes `status: COUNTDOWN`. Clients start local 3s timer. Good enough for casual play.

### Task Breakdown
- [ ] **Data & Logic**
  - [ ] Update `RoomManager` to handle room status (`WAITING`, `COUNTDOWN`, `RACE`).
  - [ ] Implement `startRace(roomId)` in `RoomManager` (Host only).
  - [ ] Add listener for `status` changes in `LobbyManager`.
- [ ] **UI - Countdown**
  - [ ] Create `CountdownOverlay` component (HTML/CSS in `src/ui/lobby.ts` or new file).
  - [ ] Implement 3-2-1 animation logic.
- [ ] **State Wiring**
  - [ ] Trigger `GameStateManager.startRace()` when countdown ends.
  - [ ] Ensure inputs are disabled until countdown ends (InputManager check `isGameActive`).

## File List
- [MODIFY] `src/multiplayer/rooms.ts` - Add status management
- [MODIFY] `src/ui/lobby.ts` - Add start button & listeners
- [NEW] `src/ui/countdown.ts` - Visual countdown handler
- [MODIFY] `src/game/state.ts` - Ensure clean start transition

## Dev Agent Record

### Implementation Notes
- **RoomManager**: Added `startRace` (updates Firebase) and `listenToStatus` (Observer pattern).
- **LobbyManager**: Subscribes to status. Triggers `CountdownOverlay` on signal.
- **CountdownOverlay**: Visual 3s timer. On completion, triggers `gameStateManager.startRace()`.
- **GameStateManager**: Added `startRace()` to enable physics/inputs.

### Testing
- Unit tests added for `CountdownOverlay` (UI logic) and `RoomManager` (Firebase logic).
- Manual verification required for multi-client sync.

