# Story 2.6: Server-Authoritative Conflict Resolution

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **Developer**,
I want **to use server timestamps for critical events**,
so that **network lag doesn't give unfair advantages**.

## Acceptance Criteria

1.  **Given** a critical event (finish line crossing),
    **When** sent to Firebase,
    **Then** it includes `firebase.database.ServerValue.TIMESTAMP`.

2.  **Given** two players finishing close together,
    **When** determining the winner,
    **Then** the client compares the server timestamps, not the local receive times.

## Tasks / Subtasks

- [ ] Implement server timestamp usage in `SyncManager`
  - [ ] Update `sendRaceFinish` (or equivalent) to include `timestamp: ServerValue.TIMESTAMP`
  - [ ] Ensure `lastUpdate` fields use server timestamps
- [ ] Implement conflict resolution logic in `GameStateManager`
  - [ ] When receiving multiple finish events, sort by timestamp
  - [ ] Determine winner based on lowest server timestamp
- [ ] Verify timestamp precision and handling
  - [ ] Ensure timestamps are treated as numbers and correctly compared
- [ ] Add unit tests for conflict resolution
  - [ ] Test sorting logic with mock timestamps
- [ ] Add E2E tests for race finish scenarios
  - [ ] Simulate simultaneous finishes with different latencies

## Dev Notes

- **Firebase SDK**: Use `import { serverTimestamp } from 'firebase/database'` (or SDK equivalent `ServerValue.TIMESTAMP`). 
  - Note: In modular SDK (v9+), use `serverTimestamp()`. Architecture mentions Firebase SDK 12.7.0, so check exact import.
- **Architecture Compliance**:
  - Decision: "Timestamp-based with Firebase server timestamps" (Architecture.md)
  - "Resolve conflicts by earliest server timestamp"
  - "Handle simultaneous finish: Lowest timestamp wins"
- **Critical Logic**:
  - Do NOT trust client-side `Date.now()`.
  - Client clocks can drift. Server timestamp is the source of truth.

### Project Structure Notes

- Modify `src/multiplayer/sync.ts` (SyncManager)
- Modify `src/game/state.ts` (GameStateManager)
- Tests in `src/multiplayer/sync.test.ts` or `src/game/state.test.ts`

### References

- [Source: _bmad-output/architecture.md#Multiplayer Synchronization Architecture]
- [Source: _bmad-output/epics.md#Story 2.6]

## Dev Agent Record

### Agent Model Used

Antigravity (simulating create-story workflow)

### Debug Log References

### Completion Notes List

### File List
