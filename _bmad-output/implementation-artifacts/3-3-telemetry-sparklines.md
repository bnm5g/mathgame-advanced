# Story 3.3: Telemetry Sparklines

Status: review

## Story

As a Strategist,
I want to see my physics variables visualized as graphs,
So that I can see the "derivative cascade" effect over time.

## Acceptance Criteria

1. **Graph Rendering**
   - **Given** the Telemetry Sidebar,
   - **When** the game runs,
   - **Then** it renders 4 real-time sparkline graphs (Jerk, Acc, Vel, Pos).
2. **Real-time Updates**
   - **Given** the sparklines,
   - **When** physics values update,
   - **Then** the graphs update right-to-left showing the last 5 seconds of data.
3. **Visual Cues**
   - **Given** the allocation action,
   - **When** points are added to a variable,
   - **Then** the corresponding graph visualizes a "step up" or spike.

## Tasks / Subtasks

- [x] Create Sparkline Engine
  - [x] Implement a lightweight canvas-based graph renderer
- [x] Data Buffer
  - [x] Implement a sliding window buffer for physics history (last 5s)
- [x] Sidebar Integration
  - [x] Update `HUDManager` or create `TelemetrySidebar` in `src/ui/`
- [x] Styling
  - [x] Ensure graphs match the SpaceX minimalist aesthetic

## Dev Notes

- **Performance**: Use a small `<canvas>` for each sparkline to avoid expensive DOM manipulations.
- **History**: Track history at roughly 10Hz for smooth graphs.


## File List

- [src/ui/telemetry.ts](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/ui/telemetry.ts)
- [src/styles/components/hud.css](file:///c:/Users/admin/Desktop/BMAD/mathgame-advanced/src/styles/components/hud.css)

## Change Log

- **2026-01-21**: Sparklines refined with 10Hz sampling, dynamic window scaling (parabolic curves), and gradient fills.

## Dev Agent Record

### Implementation Plan
- Implemented `samplePhysics` at 10Hz fixed frequency.
- Updated `drawSparkline` to use `createLinearGradient` and add grid lines.
- Added resonance-active class handling for sidebar.
- Increased sparkline height to 40px in CSS.

### Completion Notes
- Sparklines now use **Dynamic Auto-Scaling** per window, making physical relationships (parabolas/linear ramps) visually striking.
- 10Hz sampling provides high-fidelity tracking of integration.

## References

- [Source: _bmad-output/epics.md#Story 3.3]
