# Story 2.7: Disconnection Handling

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Player**,
I want **the game to handle disconnections gracefully by removing ghost players or showing a 'disconnected' icon**,
so that **the race state remains clear and accurate**.

## Acceptance Criteria

1.  **Given** a remote player in a room,
    **When** they lose internet connection or close the tab (Firebase `onDisconnect` triggers),
    **Then** their `connected` state logic updates to false.

2.  **Given** a player has been disconnected for > 10 seconds,
    **When** the game loop runs,
    **Then** the player is removed from the visible race (or marked visually disconnected).

3.  **Given** a disconnected player,
    **When** they reconnect within the grace period (if applicable),
    **Then** they can resume (optional for this story, but ensure no crash).

## Tasks / Subtasks

- [x] Implement `onDisconnect` logic in `SyncManager`
  - [x] Use `onDisconnect(ref).set(false)` or similar for presence
  - [x] Use `onDisconnect(ref).remove()` for critical cleanup if needed
- [x] Update `SyncManager` to track presence
  - [x] Listen to `.info/connected`
- [x] Update `GameStateManager` or UI
  - [x] Filter out disconnected players from rendering
- [x] Add unit tests for disconnection triggers

## Dev Notes

- **Firebase Presence**: Use standard Firebase presence system.
  - `const connectedRef = ref(db, ".info/connected");`
  - `onDisconnect(playerStateRef).update({ connected: false });`
- **Architecture**:
  - Validates `FR13` (Network Handling).
  - Clean up "ghosts" so they don't linger at the start line.

### Project Structure Notes

- Modify `src/multiplayer/sync.ts`
- Modify `src/game/state.ts` (if state needs to know about connection status)

### References

- [Source: _bmad-output/architecture.md]
- [Source: _bmad-output/epics.md]

## Dev Agent Record

### Agent Model Used

Antigravity (simulating create-story workflow)

### Debug Log References

### Completion Notes List

- Implemented `onDisconnect` logic in `SyncManager` to update `connected: false` in Firebase with server timestamps.
- Added listener for `.info/connected` to set `connected: true` upon reconnection.
- Implemented 10-second grace period for disconnected players in `SyncManager.getRemotePlayers()`, externalized to `GAME_CONSTANTS`.
- Fixed memory leak in `SyncManager` by preventing redundant state listener registrations.
- Updated `RaceTrackRenderer` to visually represent offline status for both local and remote players.
- Verified all functionality with comprehensive unit tests and fixed regression issues in related test suites.

### File List

- [src/multiplayer/sync.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/multiplayer/sync.ts)
- [src/multiplayer/sync.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/multiplayer/sync.test.ts)
- [src/ui/racetrack.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/racetrack.ts)
- [src/main.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/main.ts)
- [src/game/constants.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/constants.ts)
- [src/multiplayer/rooms.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/multiplayer/rooms.test.ts)
- [src/game/physics.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/physics.test.ts)

### Status

Status: done
