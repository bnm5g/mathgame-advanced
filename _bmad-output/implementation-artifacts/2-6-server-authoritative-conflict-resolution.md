# Story 2.6: Server-Authoritative Conflict Resolution

Status: backlog

## Story

As a Developer,
I want to use server timestamps for critical events,
So that network lag doesn't give unfair advantages.

## Acceptance Criteria

1. **Server Timestamping**
   - **Given** a critical event (finish line crossing),
   - **When** sent to Firebase,
   - **Then** it must include `firebase.database.ServerValue.TIMESTAMP` instead of a local variable.

2. **Winner Determination**
   - **Given** multiple players finishing close together,
   - **When** determining the winner,
   - **Then** the clients/logic must compare the server timestamps, not the local receive times.

3. **Race End Logic**
   - **Given** a player crosses the finish line,
   - **When** the update reaches the server,
   - **Then** the `raceEndTime` is recorded authoritatively.

## Dev Notes

### Architecture Context
- **Module**: `src/multiplayer/sync.ts` & `src/game/state.ts`
- **Firebase**: Use `ServerValue.TIMESTAMP` (placeholder that resolves on server).
- **Data Structure**:
  ```typescript
  interface PlayerState {
      // ... existing pos, vel
      finished: boolean;
      finishTime: number; // Server timestamp
  }
  ```

### Technical Approach
1.  **Modify `SyncManager`**:
    - When `GameStateManager` signals "Finished", `SyncManager` writes `{ finished: true, finishTime: ServerValue.TIMESTAMP }` to the player's node.
2.  **Modify `GameStateManager`**:
    - When receiving remote player updates, check for `finishTime`.
    - Sort results based on `finishTime`.

### Task Breakdown
- [ ] Update `SyncManager` to send `ServerValue.TIMESTAMP` on finish.
- [ ] Update `GameStateManager` to handle remote finish times.
- [ ] Create a "Race Results" sorter helper.

## File List
- [MODIFY] `src/multiplayer/sync.ts`
- [MODIFY] `src/game/state.ts`
- [MODIFY] `src/game/types.ts` (if shared types exist)

## Change Log
- 2026-01-14: Story created.
