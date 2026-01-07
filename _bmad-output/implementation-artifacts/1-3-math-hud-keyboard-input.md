# Story 1.3: Math HUD & Keyboard Input

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Racer,
I want to use keyboard keys 1-2-3-4 to interact with the game,
so that I can play using the "Tactical Dashboard" controls without a mouse.

## Acceptance Criteria

1. **Given** the browser window, **When** keys 1, 2, 3, or 4 are pressed, **Then** an `InputManager` captures these events without default browser actions.

2. **Given** a basic HUD overlay, **When** the game starts, **Then** it renders a question container and 4 answer options using the "SpaceX minimalist" style.

3. **Given** the HUD, **When** valid keys (1-4) are pressed, **Then** the corresponding UI element visually highlights (focused state).

## Tasks / Subtasks

- [x] Implement InputManager (AC: 1)
  - [x] Create `src/utils/keyboard.ts` with `InputManager` class
  - [x] Capture keydown events for keys 1-4
  - [x] Prevent default browser actions (e.g., browser shortcuts)
  - [x] Emit events using Observer pattern for game state integration
  - [x] Add unit tests for keyboard event handling

- [x] Create HUD Component Structure (AC: 2)
  - [x] Create `src/ui/hud.ts` with `HUDManager` class
  - [x] Design HTML structure for question container and 4 answer options
  - [x] Integrate with existing DOM in `index.html` (via `main.ts` injection)
  - [x] Connect to `GameStateManager` via Observer pattern

- [x] Implement SpaceX Minimalist Styling (AC: 2)
  - [x] Create `src/styles/components/hud.css` with glassmorphism effects
  - [x] Use HSL color variables from design system
  - [x] Implement `backdrop-filter: blur(12px)` for HUD overlay
  - [x] Add `pointer-events: none` to non-interactive HUD elements
  - [x] Ensure high contrast for WCAG 2.1 AA compliance

- [x] Implement Visual Highlighting (AC: 3)
  - [x] Add CSS focus states for answer options
  - [x] Implement keyboard focus management in `HUDManager`
  - [x] Add visual feedback (border glow, color shift) on key press
  - [x] Ensure focus states are keyboard-accessible

- [x] Integration Testing
  - [x] Test keyboard input integration with `GameEngine`
  - [x] Verify HUD renders correctly on game start
  - [x] Test focus states with rapid key presses (1-2-3-4 sequence)
  - [x] Verify no browser default actions occur

## Dev Notes

### Critical Implementation Rules

**🚨 PREVENT COMMON LLM MISTAKES:**
- **DO NOT** reinvent keyboard handling - use the Observer pattern established in Stories 1.1 and 1.2
- **DO NOT** use React or any framework - this is Vanilla TypeScript + DOM
- **DO NOT** create inline styles - use the CSS design system in `src/styles/`
- **DO NOT** skip accessibility - ARIA labels and keyboard focus are REQUIRED
- **DO NOT** forget to integrate with existing `GameEngine` Observer pattern

### Architecture Compliance

**Game Loop Integration:**
- `InputManager` must integrate with existing `GameEngine` from Story 1.1
- Use the Observer pattern: `GameEngine.subscribe()` for state updates
- HUD updates should happen in response to state changes, NOT directly from keyboard events
- Follow the established pattern: Input → State Change → Observer Notification → UI Update

**State Management:**
- Connect `InputManager` to `GameStateManager` (established in Story 1.1)
- DO NOT create a separate state management system
- Use the existing Observer pattern for event propagation
- State changes should be deterministic and testable

**Rendering Strategy:**
- Use DOM for HUD (NOT Canvas) as per Architecture Decision
- Canvas is reserved for race track rendering (future stories)
- HUD should use `position: absolute` with `z-index` layering
- Implement `pointer-events: none` on HUD overlay to allow clicks through

### Library & Framework Requirements

**TypeScript Configuration:**
- Use strict mode with `strictNullChecks` enabled (already configured)
- Follow existing naming conventions: `camelCase` for variables/functions, `PascalCase` for classes
- Use named exports (NO default exports)

**Styling Requirements:**
- **Framework**: Vanilla CSS ONLY (no TailwindCSS, no CSS-in-JS)
- **Design System**: Use HSL color variables from `src/styles/index.css`
- **Glassmorphism**: `backdrop-filter: blur(12px)` for HUD overlay
- **High Contrast**: Ensure WCAG 2.1 AA compliance for focus states
- **File Structure**: Create `src/styles/components/hud.css` for component styles

**Testing Framework:**
- Use Vitest (already configured in Stories 1.1 and 1.2)
- Follow existing test patterns in `src/game/engine.test.ts`
- Test keyboard events with `vi.useFakeTimers()` for deterministic behavior
- Mock DOM elements using `jsdom` (Vitest default)

### File Structure Requirements

**Files to Create:**
- `src/utils/keyboard.ts` - InputManager class
- `src/utils/keyboard.test.ts` - Unit tests for InputManager
- `src/ui/hud.ts` - HUDManager class
- `src/ui/hud.test.ts` - Unit tests for HUDManager
- `src/styles/components/hud.css` - HUD component styles

**Files to Modify:**
- `src/main.ts` - Initialize InputManager and HUDManager
- `src/styles/index.css` - Import hud.css component styles
- `index.html` - Add HUD container element

**DO NOT Modify:**
- `src/game/engine.ts` - Game loop is stable from Story 1.2
- `src/game/physics.ts` - Physics engine is stable from Story 1.2
- `src/game/state.ts` - State interfaces are stable

### Testing Requirements

**Unit Tests Required:**
- `keyboard.test.ts`:
  - Test key capture for keys 1-4
  - Test prevention of default browser actions
  - Test Observer event emission
  - Test invalid key handling (ignore non-1-4 keys)

- `hud.test.ts`:
  - Test HUD rendering with mock question data
  - Test focus state changes on keyboard input
  - Test integration with GameStateManager
  - Test accessibility attributes (ARIA labels)

**Integration Tests:**
- Test full flow: Key press → InputManager → GameStateManager → HUDManager → DOM update
- Test rapid key presses (1-2-3-4 sequence) without race conditions
- Test HUD visibility on game start

### Previous Story Intelligence

**From Story 1.1 (Project Skeleton & Game Loop):**
- ✅ `GameEngine` class established with `requestAnimationFrame` loop
- ✅ Observer pattern implemented: `subscribe(callback)` and `unsubscribe(callback)`
- ✅ Delta time calculation working correctly
- ✅ Vitest configured with `vi.useFakeTimers()` for timer mocking
- ✅ Project structure established: `src/game/`, `src/ui/`, `src/utils/`, `src/styles/`
- **Key Learning**: Use `vi.useFakeTimers()` in tests to avoid timing issues
- **Key Learning**: Observer pattern requires `subscribe/unsubscribe` methods, not just callbacks

**From Story 1.2 (Physics Engine Foundation):**
- ✅ `PhysicsEngine` class integrated with `GameEngine`
- ✅ Fixed timestep (30 FPS) implemented with accumulator pattern
- ✅ Physics values rounded to 3 decimal places for determinism
- ✅ Observer pattern preserved and tested with multiple subscribers
- **Key Learning**: Fixed timestep requires accumulator to decouple physics from render rate
- **Key Learning**: Rounding to 3 decimals prevents floating-point drift
- **Key Learning**: Tests should verify Observer pattern works with multiple subscribers

**Code Patterns Established:**
- **Observer Pattern**: `engine.subscribe((state) => { /* handle state */ })`
- **Named Exports**: `export class GameEngine { }` (NOT default exports)
- **Test Structure**: `describe('ClassName', () => { test('behavior', () => { }) })`
- **File Naming**: `kebab-case.ts` for files, `PascalCase` for classes

### Git Intelligence Summary

**Recent Commits Analysis:**
- `5077df4`: Story 1.2 completed with code review fixes applied
- `3a4a561`: Code review fixes for Observer pattern and test improvements
- `0d41e49`: Physics engine implementation with fixed timestep
- `0c88f72`: Initial project skeleton and game loop

**Key Patterns from Recent Work:**
- Code review workflow is active - expect feedback on Observer pattern usage
- Tests are critical - all stories have comprehensive unit tests
- Observer pattern is the established state management approach
- TypeScript strict mode is enforced - handle null checks properly

**Files Modified in Recent Commits:**
- `src/game/engine.ts` - Core game loop (DO NOT break this)
- `src/game/physics.ts` - Physics calculations (DO NOT modify)
- `src/main.ts` - Application entry point (WILL modify for HUD initialization)
- Test files - Comprehensive test coverage expected

### Technical Specifications

**Keyboard Event Handling:**
- Use `addEventListener('keydown', handler)` on `window` or `document`
- Prevent default: `event.preventDefault()` for keys 1-4
- Key codes: `event.key === '1'` (NOT `event.keyCode` - deprecated)
- Emit events using Observer pattern to `GameStateManager`

**HUD DOM Structure:**
```html
<div id="hud-overlay" class="hud-overlay">
  <div class="question-container" role="region" aria-label="Math Question">
    <h2 id="question-text" class="question-text"></h2>
    <div class="answers-grid">
      <button class="answer-option" data-key="1" aria-label="Answer 1"></button>
      <button class="answer-option" data-key="2" aria-label="Answer 2"></button>
      <button class="answer-option" data-key="3" aria-label="Answer 3"></button>
      <button class="answer-option" data-key="4" aria-label="Answer 4"></button>
    </div>
  </div>
</div>
```

**CSS Glassmorphism Pattern:**
```css
.hud-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicks through to canvas */
  z-index: 10;
}

.question-container {
  pointer-events: auto; /* Enable clicks on question area */
  background: hsla(var(--hsl-dark-matter), 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid hsla(var(--hsl-accent), 0.3);
  border-radius: 8px;
}

.answer-option:focus {
  outline: 2px solid hsl(var(--hsl-accent));
  box-shadow: 0 0 12px hsla(var(--hsl-accent), 0.6);
}
```

**Observer Pattern Integration:**
```typescript
// In InputManager
export class InputManager {
  private listeners: Set<(key: string) => void> = new Set();
  
  subscribe(callback: (key: string) => void): void {
    this.listeners.add(callback);
  }
  
  unsubscribe(callback: (key: string) => void): void {
    this.listeners.delete(callback);
  }
  
  private notify(key: string): void {
    this.listeners.forEach(callback => callback(key));
  }
}
```

### Project Structure Notes

**Alignment with Unified Project Structure:**
- Follow established directory structure from Stories 1.1 and 1.2
- `src/utils/` for InputManager (utility class)
- `src/ui/` for HUDManager (UI component)
- `src/styles/components/` for component-specific styles
- Co-locate tests with source files (e.g., `keyboard.ts` → `keyboard.test.ts`)

**Integration Points:**
- `src/main.ts`: Initialize InputManager and HUDManager after GameEngine
- `src/game/state.ts`: May need to add HUD state interfaces (e.g., `currentQuestion`)
- `index.html`: Add HUD container div before closing `</body>` tag

### References

- [Epics: Story 1.3](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/epics.md#story-13-math-hud--keyboard-input)
- [Architecture: Game Engine Architecture](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/architecture.md#game-engine-architecture)
- [Architecture: Rendering Strategy](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/architecture.md#rendering-strategy)
- [UX Design: Tactical Dashboard Layout](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/ux-design-specification.md)
- [Previous Story: 1.2 Physics Engine](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/implementation-artifacts/1-2-physics-engine-foundation.md)
- [Previous Story: 1.1 Project Skeleton](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/implementation-artifacts/1-1-project-skeleton-game-loop.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Change Log

- **2026-01-07**: Addressed code review findings - 3 items resolved (Documentation & Tracking). Updated File List to include `keyboard.ts`, tests, and configuration files.
- **2026-01-07**: Completed full story implementation. Added HUDManager, styles, state management, and integration tests.
- **2026-01-07**: Code Review completed. Fixed HUD ghost highlight bug and cleaned up unused variables. Status: DONE.

### Completion Notes List

- Implemented `InputManager` with strict key capture (1-4).
- Created `HUDManager` with "SpaceX Minimalist" design and HSL styling.
- Extended `GameStateManager` with strictly typed `lastInput` tracking (using `sequenceId` for determinism).
- Implemented `onStateUpdate` in HUD to react to state changes, not direct events (Architecture Compliance).
- Added comprehensive Unit and Integration tests (26/26 passing).

### File List

#### [NEW] [keyboard.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/utils/keyboard.ts)
#### [NEW] [keyboard.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/utils/keyboard.test.ts)
#### [NEW] [vitest.config.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/vitest.config.ts)
#### [MODIFY] [package.json](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/package.json)
#### [MODIFY] [package-lock.json](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/package-lock.json)
#### [MODIFY] [1-3-math-hud-keyboard-input.md](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/_bmad-output/implementation-artifacts/1-3-math-hud-keyboard-input.md)
#### [NEW] [hud.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.ts)
#### [NEW] [hud.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.test.ts)
#### [NEW] [hud.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/components/hud.css)
#### [MODIFY] [index.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/index.css)
#### [MODIFY] [main.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/main.ts)
#### [MODIFY] [state.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/game/state.ts)
#### [NEW] [integration.test.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/tests/integration.test.ts)

