# Story 2.2: Room Creation & Hosting

Status: done

## Story

As a Host,
I want to create a private room with a password,
So that I can invite my friends to a specific game session.

## Acceptance Criteria

1. **Room Creation**
   - **Given** the Lobby UI,
   - **When** I click "Create Room" and enter a password,
   - **Then** a new room entry is created in Firebase at `/rooms/{roomId}`.

2. **Room ID & Host Join**
   - **Given** a created room,
   - **Then** the `roomId` is a generated 6-digit code.
   - **And** I am automatically joined as 'Player 1' (Host).

3. **UI Transition**
   - **Given** the room creation,
   - **When** successful,
   - **Then** the UI transitions to the "Waiting Room" screen showing the room code.

## Dev Notes

- **Firebase Structure**: `/rooms/{roomId}`
- **Room ID Gen**: Use a simple alphanumeric generator.
- **UI**: Add "Lobby" view container.

## Tasks / Subtasks

- [x] Room Manager Logic
  - [x] Create `src/multiplayer/rooms.ts`
  - [x] Implement `createRoom(password)` function
  - [x] Implement unique ID generation
- [x] UI Implementation
  - [x] Create `src/ui/lobby.ts`
  - [x] Add HTML structure for Lobby (Create/Join forms)
  - [x] Add HTML structure for Waiting Room (Code display)
  - [x] Handle transition from Main Menu -> Lobby -> Waiting
- [x] Integration
  - [x] Connect `createRoom` button to `RoomManager`

## File List

- [NEW] `src/multiplayer/rooms.ts`
- [NEW] `src/ui/lobby.ts`
- [NEW] `src/styles/components/lobby.css`
- [NEW] `src/multiplayer/rooms.test.ts`
- [MODIFY] `index.html`
- [MODIFY] `src/main.ts`
- [MODIFY] `src/styles/index.css`
- [MODIFY] `src/multiplayer/auth.ts` (Added waitForAuth)

## Senior Developer Review (AI)

**Findings:**
1.  **Implementation**: Successfully implemented `RoomManager` and `LobbyManager`.
2.  **UI/UX**: Created a "SpaceX" themed lobby overlay. Added `waitForAuth` to prevent race conditions during initialization.
3.  **Tests**: Added unit tests for Room ID generation to ensure no ambiguous characters.
4.  **Configuration**: Fixed missing CSS variables, updated `.env` with valid keys, and enabled Anonymous Auth.
5.  **Status**: Feature verified manually by user (Room creation works).

