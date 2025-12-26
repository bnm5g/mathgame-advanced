---
stepsCompleted: []
inputDocuments: ['_bmad-output/prd.md', '_bmad-output/architecture.md', '_bmad-output/ux-design-specification.md']
---

# mathgame-advanced - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for mathgame-advanced, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can create private game rooms with a password.
FR2: Users can join an existing room using a unique room code and password.
FR3: The System can handle 2-4 concurrent players in a single game session.
FR4: The System can synchronize game state (player positions, stats) across all participants in real-time.
FR5: Room Hosts can manually trigger the start of a race once players have joined.
FR6: The System can simulate real-time vehicle movement based on Position, Velocity, Acceleration, and Jerk.
FR7: Users can allocate "Value Points" earned from correct answers to any of the four physics variables (Pos/Vel/Acc/Jerk).
FR8: The System calculates the cumulative effect of Jerk → Acceleration → Velocity → Position in every physics tick.
FR9: The System enforces a "Friction Spike" (temporary increased resistance) for players who answer incorrectly, reducing their effective acceleration.
FR10: The System can display multiple-choice math questions (Calculus/Derivatives focus).
FR11: Users can select one of four possible answers for each question.
FR12: The System validates answers and grants physics value points based on accuracy.
FR13: The System detects when a player's vehicle reaches the finish line.
FR14: The System declares a winner and ends the race session once the finish line is crossed.
FR15: The System tracks "Correct Answer Streaks" for each player.
FR16: The System triggers local "Resonance Mode" (visual/auditory feedback) when a player hits a specific streak threshold.
FR17: Users can see real-time "Sparkline" or graph visualizations of their physics variables over time.
FR18: The UI pulses or shifts color locally based on which physics variable is currently most "active" or dominant.
FR19: The Web App functions as a Single Page Application (SPA) without full-page reloads.
FR20: The UI is responsive and usable on tablets and desktop browsers.
FR21: The System provides real-time ARIA labels for physics stat changes for screen reader compatibility.
FR22: Users can navigate the entire question/answer and allocation flow using only a keyboard.

### NonFunctional Requirements

NFR1: **Performance**: Client-side physics at 30fps minimum rendering with smooth interpolation.
NFR2: **Performance**: Server sync rate of 10-20 ticks/second via Firebase Realtime Database.
NFR3: **Performance**: Answer response time < 500ms from submission to result display.
NFR4: **Reliability**: 90% of games complete without server/code errors.
NFR5: **Reliability**: All players see consistent race state within 500ms.
NFR6: **Reliability**: Graceful degradation when players disconnect (game continues for remaining players).
NFR7: **Scalability**: Support 100 concurrent games (400 players) at launch.
NFR8: **Scalability**: Architecture designed for 10x growth without major refactoring.
NFR9: **Accessibility**: WCAG 2.1 AA compliance with high-contrast visuals.
NFR10: **Accessibility**: Keyboard-first navigation (1-2-3-4 keys) and screen reader support for real-time updates.

### Additional Requirements

**From Architecture:**
- **Starter Template**: Initialize project using `npm create vite@latest calculus-racer -- --template vanilla-ts`.
- **Tech Stack**: Use Vite 5.x, TypeScript 5.x (Strict Mode), Firebase SDK 12.7.0 (RTDB, Auth, Hosting).
- **Project Structure**: Follow specified directory structure (`game/`, `multiplayer/`, `ui/`, `questions/`, `utils/`).
- **State Management**: Implement `GameStateManager`, `UIStateManager`, and `NetworkStateManager` with Observer pattern.
- **Physics Loop**: Use `requestAnimationFrame` with accumulated delta time and fixed 30fps physics updates.
- **Multiplayer Sync**: Implement server-authoritative sync (Phase 1) with timestamp-based conflict resolution.
- **Testing**: Use Vitest for unit/physics tests and Playwright for E2E multiplayer tests.
- **Naming**: Enforce `camelCase` for Firebase paths and TS code.
- **Precision**: Round all networked physics values to 3 decimal places.
- **Bandwidth**: Optimize to ~5 ticks/sec with delta compression for free tier viability.
- **Deployment**: Deploy to Firebase Hosting (Dev/Staging/Production environments).

**From UX Design:**
- **Design System**: Implement custom "Space X Minimalist" system using Vanilla CSS and HSL variables.
- **Input Handling**: Implement robust keyboard handling for `1-2-3-4` keys for both answers and allocation.
- **Layout**: "Tactical Dashboard" layout with persistent Sidebar (telemetry) and HUD Overlay (questions).
- **Feedback**: Implement visual/audio feedback for "Resonance" (success streak) and "Friction Spike" (error/red flash).
- **Accessibility**: Ensure high contrast for HSL physics colors and ARIA live regions for telemetry.
- **Responsiveness**: Support Desktop (>1024px) and Tablet Landscape (768px-1023px); Mobile is Spectator only.
- **Animations**: Use CSS transitions for UI state changes (no heavy JS animation libraries).

### FR Coverage Map

FR1: Epic 2 - Users create private rooms with passwords.
FR2: Epic 2 - Users join rooms via code and password.
FR3: Epic 2 - System handles 2-4 concurrent players.
FR4: Epic 2 - System syncs game state real-time (Server-Authoritative).
FR5: Epic 2 - Hosts trigger race start.
FR6: Epic 1 - Physics engine simulates movement (Pos/Vel/Acc/Jerk).
FR7: Epic 1 - Users allocate "Value Points" to physics variables.
FR8: Epic 1 - System calculates derivative cascade (Jerk->Acc->Vel->Pos).
FR9: Epic 1 - Physics engine enforces "Friction Spike" penalty.
FR10: Epic 1 - System displays math questions in HUD.
FR11: Epic 1 - Users select answers (1-2-3-4 keys).
FR12: Epic 1 - System validates accuracy and grants value.
FR13: Epic 1 - System detects finish line crossing.
FR14: Epic 1 - System declares winner (local simulation initially).
FR15: Epic 3 - System tracks correct answer streaks.
FR16: Epic 3 - UI triggers "Resonance Mode" for streaks.
FR17: Epic 3 - Telemetry sidebar visualizes sparklines.
FR18: Epic 3 - UI pulses based on dominant physics variable.
FR19: Epic 1 - SPA architecture setup.
FR20: Epic 3 - UI responsiveness for Tablet/Desktop.
FR21: Epic 3 - ARIA live regions for accessibility.
FR22: Epic 1 - Keyboard navigation (1-2-3-4) foundation.

## Epic List

### Epic 1: Single Player Physics Engine
**Goal**: Establish the core racing loop where a player can answer questions, allocate physics points, slightly "feel" the derivative cascade, and race to a finish line using keyboard controls.
**FRs covered**: FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR19, FR22
**Notes**:
- Implements the "Tactical Math Loop" (Solve -> Invest -> Move) locally.
- Sets up the custom Vanilla CSS + HSL design system.
- Includes the "SpaceX" minimalist HUD foundations.
- Does NOT include multiplayer sync yet.
- Satisfies Phase 1 MVP strategy: "Prove the game loop + physics work perfectly in isolation."

### Story 1.1: Project Skeleton & Game Loop

As a Developer,
I want to initialize the project structure and main game loop,
So that I have a foundation for rendering and updating the game state.

**Acceptance Criteria:**

**Given** the `npm create vite` command,
**When** run with vanilla-ts template,
**Then** a new project is created with TypeScript 5.x and Vite 5.x.

**Given** the directory structure,
**When** inspected,
**Then** it matches the Architecture document (`src/game/`, `src/ui/`, `src/multiplayer/`, `src/questions/`).

**Given** the application starts,
**When** the browser loads `main.ts`,
**Then** a `requestAnimationFrame` loop is running.

**Given** the game loop,
**When** measuring delta time,
**Then** the `dt` (delta time) is calculated accurately between frames to ensure smooth simulation.

### Story 1.2: Physics Engine Foundation

As a Player,
I want the game to calculate physics based on Jerk, Acceleration, Velocity, and Position,
So that my vehicle moves according to real calculus principles.

**Acceptance Criteria:**

**Given** a `PhysicsEngine` class,
**When** instantiated,
**Then** it initializes all variables (pos, vel, acc, jerk) to 0.

**Given** a physics update tick,
**When** `update(dt)` is called,
**Then** `acc` increases by `jerk * dt`, `vel` increases by `acc * dt`, and `pos` increases by `vel * dt`.

**Given** the physics calculations,
**When** running,
**Then** results are rounded to 3 decimal places to ensure deterministic behavior.

**Given** a fixed tick rate (e.g. 30fps),
**When** the render loop runs faster or slower,
**Then** physics updates use an accumulated time pattern to stay independent of frame rate.

### Story 1.3: Math HUD & Keyboard Input

As a Racer,
I want to use keyboard keys 1-2-3-4 to interact with the game,
So that I can play using the "Tactical Dashboard" controls without a mouse.

**Acceptance Criteria:**

**Given** the browser window,
**When** keys 1, 2, 3, or 4 are pressed,
**Then** an `InputManager` captures these events without default browser actions.

**Given** a basic HUD overlay,
**When** the game starts,
**Then** it renders a question container and 4 answer options using the "SpaceX minimalist" style.

**Given** the HUD,
**When** valid keys (1-4) are pressed,
**Then** the corresponding UI element visually highlights (focused state).

### Story 1.4: Answer Evaluation & Value Granting

As a Player,
I want to select answers and receive "Value Points" for correct ones,
So that I can earn resources to speed up my car.

**Acceptance Criteria:**

**Given** a displayed question,
**When** the user presses the key corresponding to the correct answer,
**Then** a "Correct" state is triggered and points (e.g., 10) are added to a `holdingValue`.

**Given** a displayed question,
**When** the user presses the key for a wrong answer,
**Then** a "Wrong" state is triggered (0 points awarded).

**Given** the Question Loader,
**When** the game starts,
**Then** it loads questions from a local JSON file (`public/questions/calculus.json`).

### Story 1.5: Strategic Allocation

As a Strategist,
I want to allocate my earned points to Position, Velocity, Acceleration, or Jerk,
So that I can influence my car's movement physics.

**Acceptance Criteria:**

**Given** a `holdingValue` > 0,
**When** the state enters "Allocation Phase",
**Then** the HUD displays options to add to Pos/Vel/Acc/Jerk.

**Given** the user presses 1 (Pos), 2 (Vel), 3 (Acc), or 4 (Jerk),
**When** in Allocation Phase,
**Then** the `holdingValue` is added to that specific physics variable in the `PhysicsEngine`.

**Given** the allocation is complete,
**Then** the `holdingValue` resets to 0 and the next question flow begins.

### Story 1.6: Friction Spike Penalty

As a Competitor,
I want to be penalized for guessing incorrectly,
So that accuracy is rewarded over blind guessing.

**Acceptance Criteria:**

**Given** a wrong answer,
**When** validated,
**Then** a "Friction Spike" state is active for 2.0 seconds.

**Given** active Friction Spike,
**When** physics updates,
**Then** an artificial friction coefficient (e.g., 0.95 per tick) is applied to reduce velocity/acceleration.

**Given** the UI,
**When** Friction Spike is active,
**Then** a visual indicator (red flash or "DRAG ACTIVE" text) appears.

### Story 1.7: Race State & Win Condition

As a Racer,
I want the race to end when I cross the finish line,
So that I have a clear goal and victory condition.

**Acceptance Criteria:**

**Given** the car's position,
**When** it exceeds `FINISH_LINE_DISTANCE` (e.g., 1000 units),
**Then** the game state changes to `FINISHED`.

**Given** the finished state,
**When** triggered,
**Then** a "Race Complete" message is displayed with the final time.

**Given** the game loop,
**When** in finished state,
**Then** input is disabled and the physics loop stops (or switches to coasting).

### Epic 2: Multiplayer Real-Time Sync
**Goal**: Enable 2-4 players to race against each other in private rooms with real-time state synchronization, allowing competitive gameplay.
**FRs covered**: FR1, FR2, FR3, FR4, FR5
**Notes**:
- Implements Firebase Realtime Database schema with bandwidth optimization.
- Handles room creation, joining (password/code), and host controls.
- Implements server-authoritative sync (Phase 1) with timestamp conflict resolution.
- Adds lobby UI.

### Story 2.1: Firebase Integration & Auth

As a Developer,
I want to connect the app to Firebase and establish anonymous authentication,
So that I can identify users and sync data without requiring user accounts.

**Acceptance Criteria:**

**Given** the game load,
**When** `main.ts` executes,
**Then** it initializes the Firebase app using configuration from environment variables.

**Given** Firebase initialization,
**When** complete,
**Then** it silently signs the user in via `signInAnonymously`.

**Given** the auth state,
**When** signed in,
**Then** a unique User ID (UID) is available for identifying the player.

### Story 2.2: Room Creation & Hosting

As a Host,
I want to create a private room with a password,
So that I can invite my friends to a specific game session.

**Acceptance Criteria:**

**Given** the Lobby UI,
**When** I click "Create Room" and enter a password,
**Then** a new room entry is created in Firebase at `/rooms/{roomId}`.

**Given** a created room,
**Then** the `roomId` is a generated 6-digit code.
**And** I am automatically joined as 'Player 1' (Host).

**Given** the room creation,
**When** successful,
**Then** the UI transitions to the "Waiting Room" screen showing the room code.

### Story 2.3: Room Joining & Guest Access

As a Guest,
I want to join an existing room using a code and password,
So that I can play with the host.

**Acceptance Criteria:**

**Given** the Lobby UI,
**When** I enter a valid Room Code and Password,
**Then** I am added to the `/rooms/{roomId}/players` list in Firebase.

**Given** an invalid code or password,
**When** attempting to join,
**Then** an error message ("Invalid Credentials") is displayed.

**Given** a full room (4 players),
**When** attempting to join,
**Then** access is denied with a "Room Full" message.

### Story 2.4: Real-Time State Sync

As a Player,
I want to see opponents' cars move in real-time,
So that I know who is winning.

**Acceptance Criteria:**

**Given** the `SyncManager`,
**When** my physics state changes,
**Then** it writes my `pos`, `vel`, `acc`, and `jerk` to Firebase (max 5 times/second bandwidth cap).

**Given** remote players in the room,
**When** their data updates in Firebase,
**Then** my client receives the update and updates the ghost car positions in `GameStateManager`.

**Given** incoming remote data,
**When** received,
**Then** the values are interpolated to show smooth movement despite the 200ms tick rate.

### Story 2.5: Race Start Coordination

As a Host,
I want to start the race for everyone simultaneously,
So that the competition is fair.

**Acceptance Criteria:**

**Given** I am the Host in the Waiting Room,
**When** I click "Start Race",
**Then** the room status in Firebase updates to `COUNTDOWN`.

**Given** a status change to `COUNTDOWN`,
**When** received by any client (Host or Guest),
**Then** a 3-2-1 visual countdown begins locally.

**Given** the countdown finishes,
**When** it hits 0,
**Then** input is enabled and physics simulation starts for all players.

### Story 2.6: Server-Authoritative Conflict Resolution

As a Developer,
I want to use server timestamps for critical events,
So that network lag doesn't give unfair advantages.

**Acceptance Criteria:**

**Given** a critical event (finish line crossing),
**When** sent to Firebase,
**Then** it includes `firebase.database.ServerValue.TIMESTAMP`.

**Given** two players finishing close together,
**When** determining the winner,
**Then** the client compares the server timestamps, not the local receive times.

### Story 2.7: Disconnection Handling

As a Player,
I want the game to continue if someone leaves,
So that one person's bad internet doesn't ruin the race.

**Acceptance Criteria:**

**Given** a player in a race,
**When** they disconnect (browser close/network loss),
**Then** their presence status in Firebase goes offline.

**Given** an offline notification,
**When** received by remaining players,
**Then** the disconnected car is visually marked (e.g., ghosted/grayed out) but the race continues.

**Given** a disconnected player,
**When** reconnecting to the same room,
**Then** they can rejoin as a spectator (or resume if implemented post-MVP).

### Epic 3: Sensory UX & Polish
**Goal**: Elevate the experience from "functional" to "visceral" with advanced feedback and accessibility.
**FRs covered**: FR15, FR16, FR17, FR18, FR20, FR21
**Notes**:
- Implements "Resonance Mode" harmonics and visual glows.
- Adds complex telemetry visualization (Sparklines) in the sidebar.
- Ensures WCAG 2.1 AA compliance and valid ARIA live regions.
- Finalizes responsive layout mechanics for Tablet.

### Story 3.1: Answer Streak Tracking & Resonance Logic

As a Player,
I want the game to track my correct answer streaks,
So that I can enter "Resonance Mode" for high performance.

**Acceptance Criteria:**

**Given** the `GameStateManager`,
**When** a correct answer is submitted,
**Then** the `streak` counter increments.

**Given** a wrong answer,
**When** submitted,
**Then** the `streak` counter resets to 0.

**Given** the streak counter,
**When** it reaches 5,
**Then** the state flag `isResonanceActive` becomes true.

### Story 3.2: Resonance Mode Visuals

As a Player,
I want visual feedback when I am in a streak,
So that I feel the "flow state" of the game.

**Acceptance Criteria:**

**Given** `isResonanceActive` is true,
**Then** the UI styling shifts to "Resonance" theme (Neon Glow borders, pulsing backgrounds).

**Given** the HSL color variables,
**When** in Resonance Mode,
**Then** the saturation/lightness values animate/pulse (breathing effect).

**Given** the Resonance state ends (streak broken),
**Then** the UI gracefully reverts to the standard "Dark Matter" theme.

### Story 3.3: Telemetry Sparklines

As a Strategist,
I want to see my physics variables visualized as graphs,
So that I can see the "derivative cascade" effect over time.

**Acceptance Criteria:**

**Given** the Telemetry Sidebar,
**When** the game runs,
**Then** it renders 4 real-time sparkline graphs (Jerk, Acc, Vel, Pos).

**Given** the sparklines,
**When** physics values update,
**Then** the graphs update right-to-left showing the last 5 seconds of data.

**Given** the allocation action,
**When** points are added to a variable (e.g., Jerk),
**Then** the corresponding graph visualizes a "step up" or spike.

### Story 3.4: Tablet Layout & Touch Support

As a Tablet User,
I want the UI to adapt to my screen size and support touch,
So that I can play on my iPad in landscape mode.

**Acceptance Criteria:**

**Given** a viewport width between 768px and 1024px,
**When** loaded,
**Then** the "Tactical Dashboard" layout adjusts (smaller sidebar, optimized font sizes).

**Given** a touch device,
**When** detected,
**Then** large touch targets appear in the sidebar for physics allocation (replacing keyboard-only reliance).

**Given** a mobile phone (width < 768px),
**When** loaded,
**Then** a "Spectator Only" or "Please use Desktop/Tablet" message is displayed.

### Story 3.5: Accessibility ARIA Regions

As a Screen Reader User,
I want to hear critical game updates,
So that I can understand the race state without sight.

**Acceptance Criteria:**

**Given** the HUD Question,
**When** it appears,
**Then** it has `aria-live="assertive"` so it is announced immediately.

**Given** physics allocation,
**When** I add points to Velocity,
**Then** an `aria-live="polite"` region announces "Velocity increased".

**Given** the DOM structure,
**When** navigating,
**Then** all interactive elements have semantic labels and focus states are clearly visible (high contrast).

### Story 3.6: Audio Feedback Integration

As a Player,
I want sound effects for my actions,
So that the game feels responsive and immersive.

**Acceptance Criteria:**

**Given** the `AudioManager` (to be created),
**When** a correct answer is submitted,
**Then** a positive "success" sound plays.

**Given** a wrong answer,
**When** submitted,
**Then** a "friction" or "power down" sound plays.

**Given** Resonance Mode,
**When** active,
**Then** a background harmonic hum or music layer fades in.
