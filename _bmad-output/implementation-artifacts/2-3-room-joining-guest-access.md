# Story 2.3: Room Joining & Guest Access

Status: done

## Story

As a Guest,
I want to join an existing room using a code and password,
So that I can play with the host.

## Acceptance Criteria

1. **Room Joining (Success)**
   - **Given** the Lobby UI,
   - **When** I enter a valid Room Code and Password,
   - **Then** I am added to the `/rooms/{roomId}/players` list in Firebase.

2. **Invalid Credentials**
   - **Given** an invalid code or password,
   - **When** attempting to join,
   - **Then** an error message ("Invalid Credentials") is displayed.

3. **Room Full**
   - **Given** a full room (4 players),
   - **When** attempting to join,
   - **Then** access is denied with a "Room Full" message.

## Dev Notes

- **Firebase Structure**: `/rooms/{roomId}/players/{uid}`
  - `{ name: "Guest", slot: 1, status: "online", ready: false }`
- **Validation**: Check if room exists first, then check password, then check player count (< 4).
- **Concurrency**: Use Firebase transactions for joining to prevent race conditions on slots.
- **UI**: Reuse the Lobby overlay. "Join Room" button triggers this flow.

## Tasks / Subtasks

- [x] Room Manager Logic
  - [x] Implement `joinRoom(roomId, password): Promise<void>` in `RoomManager`
  - [x] Add validation (Exists? Password? Full?)
  - [x] Add Transactional Join (Claim slot)
- [x] UI Implementation
  - [x] Connect "Join Room" button in `LobbyManager`
  - [x] Handle Success (Show Waiting Room)
  - [x] Handle Errors (Show Alert/Text)
- [x] Testing
  - [x] Unit Test: Transaction Logic (Mocked)
  - [x] Manual Check: Two browser tabs (Host + Guest)

## File List

- [MODIFY] `src/multiplayer/rooms.ts`
- [MODIFY] `src/ui/lobby.ts`
- [MODIFY] `src/multiplayer/rooms.test.ts`
- [MODIFY] `src/main.ts`
- [MODIFY] `src/utils/keyboard.ts`

## Senior Developer Review (AI)

**Implementation Summary:**
- Implemented `joinRoom` in `RoomManager` using `runTransaction` to handle Safe Concurrency and Capacity checks (Max 4).
- Updated `LobbyManager` to handle "Join" flow, including UI feedback for "Joining..." and distinct "Host/Guest" states in the Waiting Room.
- **Key Fixes:**
  - Resolved "Input Interference" where typing numbers in the password field triggered game logic (`main.ts` and `input.ts` updated to ignore `INPUT`/`TEXTAREA`).
  - Fixed "Double Click" issue by removing redundant event listeners.
  - Improved Password UX by trimming input and clarifying optional/required text.

