# Story 1.1: Project Skeleton & Game Loop

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** Developer,  
**I want** to initialize the project structure and main game loop,  
**so that** I have a foundation for rendering and updating the game state.

## Acceptance Criteria

1.  **Project Initialization**:
    *   **Given** the `npm create vite` command,
    *   **When** run with `vanilla-ts` template,
    *   **Then** a new project is created with TypeScript 5.x and Vite 5.x.
2.  **Directory Structure**:
    *   **Given** the directory structure,
    *   **When** inspected,
    *   **Then** it matches the Architecture document (`src/game/`, `src/ui/`, `src/multiplayer/`, `src/questions/`, `src/utils/`).
3.  **Game Loop**:
    *   **Given** the application starts,
    *   **When** the browser loads `main.ts`,
    *   **Then** a `requestAnimationFrame` loop is running.
4.  **Delta Time calculation**:
    *   **Given** the game loop,
    *   **When** measuring delta time,
    *   **Then** the `dt` (delta time) is calculated accurately between frames to ensure smooth simulation.

## Tasks / Subtasks

- [x] Initialize Vite Project (AC: 1)
    - [x] Run `npm create vite@latest . -- --template vanilla-ts` (Note: Run in root or subfolder as per User preference - ensure `.gitignore` is correct).
    - [x] Install dependencies (`npm install`).
    - [x] Install Firebase (`npm install firebase`).
- [x] Create Directory Structure (AC: 2)
    - [x] Create `src/styles/` (index.css, components/, themes/).
    - [x] Create `src/game/` (engine.ts, physics.ts, state.ts).
    - [x] Create `src/multiplayer/` (firebase.ts, sync.ts, rooms.ts).
    - [x] Create `src/ui/` (hud.ts, telemetry.ts, lobby.ts).
    - [x] Create `src/questions/` (loader.ts, validator.ts).
    - [x] Create `src/utils/` (keyboard.ts, constants.ts).
- [x] Implement Game Loop (AC: 3, 4)
    - [x] Implement `src/game/engine.ts` with `requestAnimationFrame`.
    - [x] Calculate `dt` (using `performance.now()`).
    - [x] Integrate loop into `src/main.ts`.

## Dev Notes

### Architecture Compliance

*   **Framework**: Vite 5.x + Vanilla TS. No React/Vue/Angular.
*   **State Management**: Use Observer Pattern (Skeleton only for now).
*   **Performance**: Game loop MUST use `requestAnimationFrame`.
*   **Styling**: Vanilla CSS. Setup `src/styles/index.css` with CSS variables skeleton.
*   **Naming Convention**: `camelCase` for files and variables. Named exports only.
*   **Strict Mode**: Ensure `strictNullChecks` is enabled in `tsconfig.json`.

### Project Structure Notes

*   **Root**: Ensure we are working in the correct root. If the repo `mathgame-advanced` IS the project, initialize IN PLACE (`.`). If `calculus-racer` is a subfolder, ensure we align with that. **Recommendation**: Initialize in REPO ROOT `.` if empty (except for `_bmad` folders).
*   **Structure**:
    ```
    src/
    ├── main.ts
    ├── styles/
    ├── game/ (engine.ts, physics.ts, state.ts)
    ├── multiplayer/ (firebase.ts, sync.ts, rooms.ts)
    ├── ui/ (hud.ts, telemetry.ts, lobby.ts)
    ├── questions/ (loader.ts, validator.ts)
    └── utils/ (keyboard.ts, constants.ts)
    ```

### Technical Requirements

*   **TypeScript**: v5.x.
*   **Vite**: v5.x.
*   **Firebase**: v12.7.0 (Install only, integration in Epic 2).
*   **Testing**: Prepare for Vitest (install dev dependencies: `vitest`).

### References

*   **Architecture**: `_bmad-output/architecture.md` (Section: Starter Template Evaluation, Game Engine Architecture).
*   **Epics**: `_bmad-output/epics.md` (Story 1.1).
*   **Project Context**: `_bmad-output/project-context.md`.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- Tests failed initially due to Timer Mocking issues, resolved by adding `vi.useFakeTimers()`.
- Linter warnings in `main.ts` resolved by `_dt`.

### Completion Notes List

- Initialized Vite project and directory structure.
- Implemented `GameEngine` class using `requestAnimationFrame`.
- Implemented deterministic Game Loop with Delta Time calculation.
- Added comprehensive unit tests for `GameEngine`.
- Integrated engine into `main.ts`.

### File List

- `src/main.ts`
- `src/game/engine.ts`
- `src/game/engine.test.ts`
- `src/game/physics.ts`
- `src/game/state.ts`
- `src/multiplayer/firebase.ts`
- `src/multiplayer/sync.ts`
- `src/multiplayer/rooms.ts`
- `src/ui/hud.ts`
- `src/ui/telemetry.ts`
- `src/ui/lobby.ts`
- `src/questions/loader.ts`
- `src/questions/validator.ts`
- `src/utils/keyboard.ts`
- `src/utils/constants.ts`
- `src/styles/index.css`
