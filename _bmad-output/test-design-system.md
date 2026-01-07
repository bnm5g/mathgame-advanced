# System-Level Test Design - mathgame-advanced

## Testability Assessment

- **Controllability**: **PASS**
  - The architecture uses deterministic physics calculations (3-decimal rounding) and a fixed 30fps update loop, ensuring local simulation is reproducible across clients.
  - Modular state managers (`GameStateManager`, `PhysicsEngine`) allow for easy state seeding and injection of test data.
  - The Firebase Emulator Suite enables full control over the real-time database and authentication states during integration and E2E testing.
- **Observability**: **PASS**
  - The Observer pattern implemented in all state managers allows test utilities to subscribe to state changes and verify transitions without polling.
  - Real-time telemetry sparklines and ARIA live regions provide built-in visibility into the internal physics "derivative cascade" and race state.
- **Reliability**: **PASS**
  - The use of Playwright for E2E testing with multi-browser context support allows for reliable simulation of 4-player race conditions and synchronization.
  - Network-first interception strategies are planned to prevent flakiness in Firebase-dependent flows.

## Architecturally Significant Requirements (ASRs)

| Requirement ID | Category | Description | Probability | Impact | Score | Mitigation Strategy |
| -------------- | -------- | ----------- | ----------- | ------ | ----- | ------------------- |
| **ASR-1**      | **TECH** | **Real-time Physics Desync**: Distributed physics state must remain consistent across 4 clients despite Firebase latency. | 2 | 3 | **6** | Implement deterministic rounding (3 decimals) and interpolation; validate with 4-player Playwright desync tests. |
| **ASR-2**      | **PERF** | **Firebase Bandwidth Limits**: Scaling to 100 concurrent games within free-tier limits (~5 ticks/sec). | 2 | 2 | 4 | Delta compression for network updates; monitor bandwidth usage in load tests. |
| **ASR-3**      | **OPS** | **Disconnection Resilience**: Game must continue gracefully for remaining players if a peer drops. | 3 | 2 | **6** | Implement presence-based "ghosting" logic; verify with Playwright network disconnection simulation. |
| **ASR-4**      | **BUS**  | **"Tactical Math" Input Accuracy**: Keyboard (1-2-3-4) input must be 100% reliable for state transitions. | 1 | 3 | 3 | Keyboard-driven unit tests for `InputManager`; E2E validation of high-speed input combos. |

## Test Levels Strategy

| Level | Target Coverage | Rationale |
| ----- | --------------- | --------- |
| **Unit** | **70%** | Critical for physics calculations, derivative cascade logic, question validation, and state machine transitions. |
| **Integration** | **20%** | Focuses on Firebase RTDB sync, room lifecycle (Create/Join), and telemetry sidebar synchronization. |
| **E2E** | **10%** | Validates the complete "Calculus Combat" journey (Lobby -> Countdown -> Race -> Win) across 4 players. |

## NFR Testing Approach

- **Security**:
  - **Auth/Authz**: Validate Firebase Anonymous Auth and RTDB Security Rules (write access restricted to own player object).
  - **Data Validation**: Ensure RTDB rules enforce data types and range limits for physics variables.
- **Performance**:
  - **Frame Rate**: Monitor `requestAnimationFrame` loop to ensure >30fps during heavy rendering/sync.
  - **Network Latency**: Target **P95 <200ms** perceived lag for physics updates via Firebase.
  - **Response Time**: Answer validation to feedback loop must be **<500ms**.
- **Reliability**:
  - **Error Recovery**: Fallback HUD "Reboot" effect for failed network calls.
  - **Graceful Termination**: Winner declaration and race cleanup logic validation.

## Test Environment Requirements

- **Local Development**: Vitest + Firebase Emulator Suite (Database, Auth).
- **CI/CD Pipeline**: GitHub Actions running Playwright E2E tests against the Firebase Emulator.
- **Staging**: Firebase Hosting (Staging Project) for real-world latent testing.

## Testability Concerns

- **Firebase Latency Spikes**: While interpolation handles constant lag, sudden spikes (>500ms) may cause visible jitter. **Mitigation**: Implement "Soft Reset" or reconciliation logic if desync exceeds a threshold.
- **Complex Matchmaking State**: Simultaneous room joins/creations at scale could hit RTDB transaction limits. **Mitigation**: Stress test room creation flow with k6.

## Recommendations for Sprint 0

1. **Initialize Vitest** with a `physics-determinism` test suite immediately following Story 1.2.
2. **Configure Playwright** with a "Multiplayer Context Helper" to easily spawn 4-player test scenarios.
3. **Establish Firebase Security Rules** baselines early to prevent data corruption during integration.
