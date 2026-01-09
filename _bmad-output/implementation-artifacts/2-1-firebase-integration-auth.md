# Story 2.1: Firebase Integration & Auth

Status: done

## Story

As a player,
I want to join a game session without creating an account,
so that I can start racing with friends immediately while still having a unique identity in the session.

## Acceptance Criteria

1. Firebase SDK is successfully initialized in the project using Vite environment variables. [Source: architecture.md#Decision: Starter: Vite Vanilla TypeScript]
2. Anonymous authentication is triggered automatically on application startup. [Source: architecture.md#Decision: Authentication Strategy]
3. Every player receives a unique UID from Firebase Auth for session identification.
4. Firebase Realtime Database connection is established and ready for state synchronization. [Source: architecture.md#Decision: Firebase Data Schema]

## Tasks / Subtasks

- [x] Firebase SDK Boilerplate (AC: 1)
  - [x] Install firebase dependency: `npm install firebase`
  - [x] Create `.env` file with Firebase config keys (VITE_ prefixed)
  - [x] Create `src/multiplayer/firebase.ts` for initialization
- [x] Implement Anonymous Authentication (AC: 2, 3)
  - [x] Implement `signInAnonymously` in `src/multiplayer/auth.ts` or `firebase.ts`
  - [x] Ensure UID is accessible to other modules
- [x] Firebase Connection & Health Check (AC: 4)
  - [x] Initialize Realtime Database instance
  - [x] Add console logging for connection status (dev only)

## Dev Notes

- **Authentication Pattern**: use `signInAnonymously(auth)` from `firebase/auth`. [Source: architecture.md#Decision: Authentication Strategy]
- **Environment Variables**: Use `import.meta.env.VITE_FIREBASE_API_KEY` etc.
- **Project Structure**:
    - `src/multiplayer/firebase.ts`: SDK initialization and database reference export.
    - `src/multiplayer/auth.ts`: Authentication state management.
- **Security**: Security rules are defined in `architecture.md#Decision: Firebase Security Rules`.

### Project Structure Notes

- Aligned with `calculus-racer/src/multiplayer/` structure defined in architecture.
- Follows "Zero-Friction Joining" UX principle.

### References

- [PRD: MV - Minimum Viable Product](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/prd.md#MVP---Minimum-Viable-Product)
- [Architecture: Authentication Strategy](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/architecture.md#Decision:-Authentication-Strategy)
- [Architecture: Firebase Data Schema](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/architecture.md#Decision:-Firebase-Data-Schema)

## Dev Agent Record

### Agent Model Used

Antigravity (Custom BMAD Framework)

### Debug Log References

N/A

### Completion Notes List

- N/A

### File List

- [NEW] `src/multiplayer/firebase.ts`
- [NEW] `src/multiplayer/auth.ts`
- [NEW] `src/multiplayer/firebase.test.ts`
- [NEW] `src/multiplayer/auth.test.ts`
- [MODIFY] `.env`
- [MODIFY] `src/main.ts` (Integration point)
- [MODIFY] `src/game/state.ts` (Minor adjustments)
- [MODIFY] `src/ui/hud.ts` (Minor adjustments)
- [MODIFY] `src/styles/components/hud.css` (Minor adjustments)

## Senior Developer Review (AI)

_Reviewer: Antigravity on 2026-01-09_

**Findings:**
1.  **Critical**: `authenticateAnonymously` and `setupConnectionMonitor` were implemented but NEVER called in `main.ts`. Fixed during review.
2.  **Medium**: `src/multiplayer/` files were not tracked in git. Fixed.
3.  **Medium**: File list was incomplete. Updated.

**Outcome**: **APPROVED** (Auto-fixed)

