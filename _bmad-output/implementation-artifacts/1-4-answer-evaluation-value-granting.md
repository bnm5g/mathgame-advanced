# Story 1.4: Answer Evaluation & Value Granting

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Player,
I want to select answers and receive "Value Points" for correct ones,
so that I can earn resources to speed up my car.

## Acceptance Criteria

1. **Given** a displayed question, **When** the user presses the key corresponding to the correct answer (1-4), **Then** a "Correct" state is triggered and points (e.g., 10) are added to a `holdingValue` in the Game State.

2. **Given** a displayed question, **When** the user presses the key for a wrong answer, **Then** a "Wrong" state is triggered (0 points awarded) and the `holdingValue` does not increase.

3. **Given** the Question Loader, **When** the game starts, **Then** it loads questions continuously from a local JSON file (`public/questions/calculus.json`).

4. **Given** an answer submission, **When** validated, **Then** the HUD provides immediate visual feedback (Green for correct, Red for wrong) before loading the next question.

## Tasks / Subtasks

- [x] Implement Question Loading System (AC: 3)
    - [x] Create `public/questions/calculus.json` with at least 5 sample calculus questions
    - [x] Define `Question` interface in `src/game/state.ts` (id, text, answers, correctIndex, points)
    - [x] Create `src/questions/loader.ts` to fetch and parse JSON data
    - [x] Add error handling for failed load (fallback questions)
    - [x] Create unit tests for `loader.ts` (mocking `fetch`)

- [x] Implement Answer Validation Logic (AC: 1, 2)
    - [x] Update `GameState` interface to include `holdingValue` (number) and `feedbackState` ('idle' | 'correct' | 'wrong')
    - [x] Add `submitAnswer(answerIndex: number)` method to `GameStateManager`
    - [x] Implement validation logic: Compare index to `currentQuestion.correctIndex`
    - [x] Implement scoring: Add `question.points` to `holdingValue` on success
    - [x] Create unit tests for `submitAnswer` logic (scoring, state transitions)

- [x] Integrate Input with Validation (AC: 1, 2)
    - [x] Update `main.ts` to connect `InputManager` events to `GameStateManager.submitAnswer()` logic
    - [x] Implement answer key mapping (KeyPress '1' -> submitAnswer(0))
    - [x] Create integration test for keyboard -> points flow

- [x] Implement HUD Feedback & Question Cycling (AC: 4)
    - [x] Update `HUDManager` to react to `feedbackState` changes
    - [x] Add CSS classes for `.correct` (Green) and `.wrong` (Red) to `hud.css`
    - [x] Implement delay (e.g., 1000ms) before loading next question
    - [x] Update `GameStateManager` to cycle to next question after delay
    - [x] Create unit tests for HUD feedback classes

## Dev Notes

### Critical Implementation Rules

**🚨 PREVENT COMMON LLM MISTAKES:**
- **State Logic Location**: Validation logic MUST live in `GameStateManager`, NOT in `HUDManager` or `InputManager`. UI only reflects state.
- **Handling Async**: Question loading is async (`fetch`). Ensure `GameEngine` waits or handles "loading" state gracefully.
- **Type Safety**: Use strict interfaces for `Question` and `GameState`. Do not use `any`.
- **Input Debounce**: Prevent rapid-fire inputs from submitting multiple answers for the same question.

### Architecture Compliance

**State Management:**
- `holdingValue`: Temporary points store before allocation. Part of `GameState`.
- `currentQuestion`: The active question object.
- `feedbackState`: UI state for animations (Idle -> Correct/Wrong -> Idle).
- Use `setState()` to update these values and notify subscribers (HUD).

**Question Data Structure:**
```typescript
interface Question {
    id: string;
    text: string;
    answers: string[]; // Array of 4 strings
    correctIndex: number; // 0-3
    points: number;
}
```

### Library & Framework Requirements

- **Fetch API**: Use native `window.fetch` for loading JSON.
- **Mocking**: Use `vi.stubGlobal('fetch', ...)` for unit testing loader.

### File Structure Requirements

**Files to Create:**
- `public/questions/calculus.json`
- `src/questions/loader.ts`
- `src/questions/loader.test.ts`

**Files to Modify:**
- `src/game/state.ts` (Add Question/HoldingValue interfaces)
- `src/ui/hud.ts` (Add feedback visuals)
- `src/styles/components/hud.css` (Add feedback styles)
- `src/main.ts` (Wiring)

### Previous Story Intelligence

**From Story 1.3:**
- **Input Handling**: The `InputManager` handles keys 1-4. In 1.4, these now trigger `submitAnswer(0)` through `submitAnswer(3)`.
- **HUD Updates**: `HUDManager.onStateUpdate` is the single source of truth for UI updates.
- **Determinism**: Keep logic deterministic. Validation is pure logic (Index A == Index B).

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Successfully implemented asynchronous question loading with local JSON storage.
- Centralized validation logic in `GameStateManager` with state-based feedback.
- Integrated keyboard events (1-4) with clear visual cues on the HUD.
- Verified all components with unit and integration tests (37 passing).

### File List

- [NEW] `public/questions/calculus.json`
- [NEW] `src/questions/loader.ts`
- [NEW] `src/questions/loader.test.ts`
- [MODIFY] `src/game/state.ts`
- [MODIFY] `src/ui/hud.ts`
- [NEW] `src/ui/hud.test.ts`
- [MODIFY] `src/styles/components/hud.css`
- [MODIFY] `src/main.ts`
- [MODIFY] `src/tests/integration.test.ts`
- [MODIFY] `package.json`
- [NEW] `src/game/state.test.ts`

### Change Log

- **Question Loader**: Implemented `QuestionLoader` class to fetch calculus questions.
- **Game State**: Added `holdingValue`, `feedbackState`, and `currentQuestion` to `GameState`.
- **Validation**: Added `submitAnswer` to `GameStateManager` with 1.5s delay before cycling.
- **HUD**: Added `.correct` and `.wrong` CSS states and updated `HUDManager` to apply them.
- **Input**: Wired `InputManager` to `submitAnswer` in `main.ts`.
