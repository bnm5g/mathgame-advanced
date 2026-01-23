# Story 3.2: Resonance Mode Visuals

Status: done

## Story

As a Player,
I want visual feedback when I am in a streak,
So that I feel the "flow state" of the game.

## Acceptance Criteria

1. **Theme Shift**
   - **Given** `isResonanceActive` is true,
   - **Then** the UI styling shifts to "Resonance" theme (Neon Glow borders, pulsing backgrounds).
2. **HSL Animation**
   - **Given** the HSL color variables,
   - **When** in Resonance Mode,
   - **Then** the saturation/lightness values animate/pulse (breathing effect).
3. **Reversion**
   - **Given** the Resonance state ends (streak broken),
   - **Then** the UI gracefully reverts to the standard "Dark Matter" theme.

## Tasks / Subtasks

- [x] Design Resonance Style Tokens
  - [x] Define neon HSL variables in `index.css`
- [x] Implement Breathing Animation
  - [x] Add CSS keyframes for HSL pulsing
- [x] State-Driven Styling
  - [x] Update `UIManager` or `HUDManager` to toggle theme classes based on `isResonanceActive`
- [x] Visual Polish
  - [x] Add neon glow (box-shadow) to HUD elements during resonance

## Dev Notes

- **CSS Strategy**: Use CSS custom properties and `@keyframes`.
- **UI Logic**: Bind to `GameStateManager.subscribe` in `src/main.ts` or a new `ThemeManager`.


## File List

- [src/styles/index.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/index.css)
- [src/styles/components/hud.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/components/hud.css)
- [src/ui/hud.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.ts)
- [src/ui/racetrack.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/racetrack.ts)
- [src/main.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/main.ts)

## Change Log

- **2026-01-21**: Resonance visuals implemented in HUD and RaceTrackRenderer.

## Dev Agent Record

### Implementation Plan
- Add `--hsl-resonance` token and `resonanceBreath` animation to `index.css`.
- Add global `.resonance-active` class that overrides `--hsl-pos` and adds breathing effect.
- Update `HUDManager` to toggle classes on `document.documentElement`.
- Enhanced `RaceTrackRenderer` with pulsing cyan glow for resonant players.

### Completion Notes
- Visuals verified in development environment.
- Animations are performant (3s period, transform/opacity based).

## References

- [Source: _bmad-output/epics.md#Story 3.2]
