# Story 3.6: Audio Feedback Integration

Status: ready-for-dev

## Story

As a Player,
I want sound effects for my actions,
So that the game feels responsive and immersive.

## Acceptance Criteria

1. **Action SFX**
   - **Given** the `AudioManager`,
   - **When** a correct answer is submitted,
   - **Then** a positive "success" sound plays.
   - **When** a wrong answer is submitted,
   - **Then** a "friction" or "power down" sound plays.
2. **Resonance Hum**
   - **Given** Resonance Mode,
   - **When** active,
   - **Then** a background harmonic hum or music layer fades in.
3. **User Control**
   - **Given** the presence of audio,
   - **When** the user wants to mute,
   - **Then** a simple "Mute" toggle is available in the UI.

## Tasks / Subtasks

- [ ] Implement `AudioManager`
  - [ ] Create `src/utils/audio.ts` using Web Audio API or HTMLAudioElement
- [ ] Source Audio Assets
  - [ ] Identify/Create minimalist synth sounds matching the SpaceX theme
- [ ] State Binding
  - [ ] Trigger sounds from `GameStateManager` and `SyncManager` events
- [ ] Volume/Mute Control
  - [ ] Add a mute button to the HUD corner

## Dev Notes

- **Assets**: Use small `.mp3` or `.ogg` files.
- **Auto-play**: Respect browser policies (first interaction required).

## References

- [Source: _bmad-output/epics.md#Story 3.6]
