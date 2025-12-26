---
project_name: 'mathgame-advanced'
user_name: 'Minh'
date: '2025-12-26'
sections_completed: ['technology_stack', 'implementation_rules', 'usage_guidelines']
status: 'complete'
rule_count: 15
optimized_for_llm: true
existing_patterns_found: 5
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Build**: Vite 5.x (Vanilla TS template)
- **Language**: TypeScript 5.x (Strict Mode, ES2020+)
- **Backend**: Firebase SDK 12.7.0 (RTDB, Auth, Hosting)
- **Styling**: Vanilla CSS (No frameworks)
- **Testing**: Vitest 4.0.16 (Unit) & Playwright 1.57 (E2E)

## Critical Implementation Rules

### Language-Specific Rules

- **Naming**: Use `camelCase` for all variables, functions, and Firebase keys. No `snake_case`.
- **Strict Mode**: `strictNullChecks` is ON. Handle `null`/`undefined` explicitly.
- **Async**: Always use `async/await` and wrap game loop steps in `try/catch`.

### Framework-Specific Rules (Firebase & Game)

- **Database Paths**: Use `camelCase` segments (e.g., `/rooms/roomId/players`), NOT snake_case.
- **Game Loop**: Use `requestAnimationFrame` with delta time. **NEVER** use `setInterval` for physics.
- **State Source**: `SyncManager.ts` is the ONLY place that writes to Firebase.
- **Precision**: Round all networked physics values to 3 decimal places (`0.123`).

### Testing Rules

- **Co-location**: Unit tests (`*.test.ts`) must sit next to the source file.
- **Determinism**: Physics tests must be deterministic.
- **E2E**: Use Playwright to simulate 4 concurrent players.

### Code Quality & Style Rules

- **Separation**: `game/` (Logic) vs `ui/` (DOM) vs `multiplayer/` (Sync).
- **CSS**: Use CSS Variables (`var(--neon-blue)`) from `main.css`. Minimize inline styles.
- **Exports**: Use **Named Exports** only. Avoid `default` exports.

### Critical Don't-Miss Rules (Anti-Patterns)

- ❌ **No DOM in Engine**: Physics engine must be pure logic. Use `GameStateManager` to notify UI.
- ❌ **No `any`**: Define strict interfaces (`IGameState`, `IPlayer`) for all data.
- ❌ **No Integer Physics**: Use floats for calculation, round only for network.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2025-12-26
