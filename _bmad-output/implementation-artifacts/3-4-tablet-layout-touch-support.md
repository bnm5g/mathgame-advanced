# Story 3.4: Tablet Layout & Touch Support

Status: review

## Story

As a Tablet User,
I want the UI to adapt to my screen size and support touch,
So that I can play on my iPad in landscape mode.

## Acceptance Criteria

1. **Responsive Layout**
   - **Given** a viewport width between 768px and 1024px,
   - **When** loaded,
   - **Then** the "Tactical Dashboard" layout adjusts (smaller sidebar, optimized font sizes).
2. **Touch Targets**
   - **Given** a touch device,
   - **When** detected,
   - **Then** large touch targets appear in the sidebar for physics allocation (replacing keyboard-only reliance).
3. **Spectator Mode (Mobile)**
   - **Given** a mobile phone (width < 768px),
   - **When** loaded,
   - **Then** a "Spectator Only" or "Please use Desktop/Tablet" message is displayed.

## Tasks / Subtasks

- [x] Responsive CSS Breakpoints
  - [x] Add `@media` queries for tablet landscape in `index.css`
- [x] Touch Event Handling
  - [x] Add `touchstart` listeners to allocation buttons
- [x] Device Detection Logic
  - [x] Implement simple CSS or JS-based device detection for mobile gating
- [x] UI Optimization
  - [x] Ensure HUD elements don't overlap on smaller 768px heights

## Dev Notes

- **Constraint**: The project is desktop/tablet first as per architecture. Mobile is specifically restricted to spectator/warning.


## File List

- [index.html](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/index.html)
- [src/styles/index.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/index.css)
- [src/styles/components/hud.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/components/hud.css)
- [src/ui/telemetry.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/telemetry.ts)
- [src/ui/hud.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/hud.ts)

## Change Log

- **2026-01-21**: Tablet layout, mobile gate, and touch interation implemented.

## Dev Agent Record

### Implementation Plan
- Added `.mobile-gate` to `index.html` and `index.css`.
- Updated `index.css` and `hud.css` with tablet `@media` queries.
- Added click/touch listeners to `TelemetryManager` rows for sidebar allocation.
- Added click/touch listeners to `HUDManager` buttons for game actions.

### Completion Notes
- UI adapts cleanly between 768px and 1440px widths.
- Mobile gate (width < 768px) displays high-priority warning message.
- Full parity between keyboard and touch interaction for all game actions.

## References

- [Source: _bmad-output/epics.md#Story 3.4]
