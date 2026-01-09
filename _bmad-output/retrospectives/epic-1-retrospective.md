# Retrospective: Epic 1 - Single Player Physics Engine

## Overview
Epic 1 successfully established the "Tactical Math Loop" and the core physics engine for Calculus Racer. All 7 stories (1.1 to 1.7) have been completed, verified, and reviewed. This foundation is now ready for the transition to multiplayer functionality in Epic 2.

## Successes & Technical Wins
- **Observer Pattern Evolution**: The implementation of `GameStateManager` with an Observer pattern proved highly effective. It decoupled game logic from UI updates, allowing the HUD to react fluidly to state changes.
- **Physics Determinism**: Custom physics calculations (Jerk -> Acc -> Vel -> Pos) were implemented with a fixed tick rate (30 FPS) and precision rounding to 3 decimal places, ensuring consistency essential for future multiplayer synchronization.
- **CSS Design System**: The "SpaceX Minimalist" design system was successfully established using Vanilla CSS variables (HSL), providing a premium look and feel without external overhead.
- **Robust Testing**: Integration tests (e.g., `allocation-flow.test.ts`) were added to verify complex interactions like the "resonance allocation" rule, catching edge cases early.

## Challenges & Lessons Learned
- **UI Scaling and Layout**: Early in the epic, there were issues with overlapping HUD elements and alignment.
  - *Lesson*: Prioritize component-level CSS modularization and testing on multiple resolutions (Desktop vs Tablet) earlier in the dev cycle.
- **Magic Number Management**: Several values (e.g., `FINISH_LINE_DISTANCE`, `FEEDBACK_DELAY_MS`) were initially hardcoded.
  - *Lesson*: The project now enforces a strict `game/constants.ts` policy to centralize game-balancing variables.
- **Event Timing**: The logic for `raceStartTime` required refinement during code review to ensure it accurately reflected the start of gameplay rather than initialization.

## Technical Debt & Ongoing Considerations
- **Type Safety**: While `as any` casts were significantly reduced in Story 1.7, continuous monitoring of type boundaries (especially during physics engine updates) is required.
- **ARIA Live Regions**: Foundational accessibility was added, but as more dynamic multiplayer events are introduced, this will need to be expanded.
- **State Merging**: The Current `GameState` is optimized for local play. Epic 2 will require a strategy for reconciling local state with Firebase updates (interpolation vs snap-to-position).

## Preparation for Epic 2 (Multiplayer)
- **Firebase Strategy**: Story 2.1 will initialize Firebase and anonymous auth.
- **Sync Optimization**: Physics states are already serializable and rounded, which will minimize bandwidth spikes.
- **Lobby UI**: The HUD system built in Epic 1 is flexible enough to accommodate the upcoming Room Creation and Joining views.

## Action Items
1. [ ] Finalize `constants.ts` with any remaining hardcoded physics values.
2. [ ] Review state serialization logic to ensure compatibility with Firebase RTDB.
3. [ ] Design the Lobby overlay as a new component in the `src/ui/` directory.

---
*Facilitated by Antigravity*
