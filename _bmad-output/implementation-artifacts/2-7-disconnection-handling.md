# Story 2.7: Disconnection Handling

Status: ready-for-dev

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

- [ ] Implement `onDisconnect` logic in `SyncManager`
  - [ ] Use `onDisconnect(ref).set(false)` or similar for presence
  - [ ] Use `onDisconnect(ref).remove()` for critical cleanup if needed
- [ ] Update `SyncManager` to track presence
  - [ ] Listen to `.info/connected`
- [ ] Update `GameStateManager` or UI
  - [ ] Filter out disconnected players from rendering
- [ ] Add unit tests for disconnection triggers

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

### File List
