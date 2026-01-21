# Story 3.5: Accessibility ARIA Regions

Status: ready-for-dev

## Story

As a Screen Reader User,
I want to hear critical game updates,
So that I can understand the race state without sight.

## Acceptance Criteria

1. **Assertive HUD updates**
   - **Given** the HUD Question,
   - **When** it appears,
   - **Then** it has `aria-live="assertive"` so it is announced immediately.
2. **Polite Telemetry updates**
   - **Given** physics allocation,
   - **When** I add points to Velocity,
   - **Then** an `aria-live="polite"` region announces "Velocity increased".
3. **Semantic Integrity**
   - **Given** the DOM structure,
   - **When** navigating,
   - **Then** all interactive elements have semantic labels and focus states are clearly visible.

## Tasks / Subtasks

- [ ] Audit HUD for ARIA Roles
  - [ ] Add `role="region"`, `aria-label`, etc.
- [ ] Implement Live Regions
  - [ ] Add a hidden `div` with `aria-live` for announcing dynamic status changes
- [ ] Screen Reader Testing
  - [ ] Verify announcements using ChromeVox or similar tool
- [ ] Keyboard Focus Management
  - [ ] Ensure focus state (`:focus`) is highly visible as per UX spec

## Dev Notes

- **Performance**: Don't announce every position change (too frequent). Focus on discrete events (Answer Correct, Points Allocated, New Question).

## References

- [Source: _bmad-output/epics.md#Story 3.5]
