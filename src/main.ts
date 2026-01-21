import './styles/index.css';
import { engine } from './game/engine';
import { InputManager } from './utils/keyboard';
import { HUDManager } from './ui/hud';
import { TelemetryManager } from './ui/telemetry';
import { RaceTrackRenderer } from './ui/racetrack';
import { gameStateManager, PHYSICS_VARIABLES } from './game/state';
import { QuestionLoader } from './questions/loader';
import { authenticateAnonymously, getCurrentUser } from './multiplayer/auth';
import { setupConnectionMonitor, database } from './multiplayer/firebase';
import { SyncManager } from './multiplayer/sync';

// Setup App Container
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="game-app">
    <div id="game-container"></div>
  </div>
`;

// Initialize Systems
console.log('Initializing Systems...');
setupConnectionMonitor(); // AC4: Health Check

// AC2: Trigger Anonymous Auth
authenticateAnonymously()
  .then(user => {
    console.log(`signed in as ${user.uid}`);
  })
  .catch(err => {
    console.error('Auth failed:', err);
  });

gameStateManager.setEngine(engine.physics);
const inputManager = new InputManager();
const hudManager = new HUDManager(gameStateManager);
const telemetryManager = new TelemetryManager(gameStateManager);
const raceTrackRenderer = new RaceTrackRenderer();
const syncManager = new SyncManager(database);

import { LobbyManager } from './ui/lobby';
export const lobbyManager = new LobbyManager();

// TODO: Start sync when joining/creating a room
// For now, this is a placeholder - will be triggered by LobbyManager
let currentRoomId: string | null = null;
let isMultiplayer = false;

// Connect Input -> State (Story 1.5 Integration)
inputManager.subscribe((key) => {
  // Ignore input if user is typing in a form field
  if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
    return;
  }

  const index = parseInt(key) - 1;
  const state = gameStateManager.getState();

  if (index >= 0 && index < 4) {
    if (state.isAllocationActive) {
      const varName = PHYSICS_VARIABLES[index];
      gameStateManager.allocatePoints(index);
      telemetryManager.triggerFlash(varName);
    } else {
      gameStateManager.submitAnswer(index);
    }
  }
  gameStateManager.handleInput(key);
});

// Start Game Loop
console.log('Starting Game Engine...');
engine.start();

engine.subscribe((_dt) => {
  // Render race track with local and remote players
  const localState = engine.physics.getState();
  const remotePlayers = syncManager.getRemotePlayers();
  const isConnected = syncManager.getIsConnected();
  const gameState = gameStateManager.getState();
  raceTrackRenderer.render(localState, remotePlayers, isConnected, gameState.isResonanceActive);

  // Write local state to Firebase (throttled by SyncManager)
  if (isMultiplayer && currentRoomId) {
    const gameState = gameStateManager.getState();
    if (gameState.isRaceFinished) {
      syncManager.sendRaceFinish(localState, gameState.streak, gameState.isResonanceActive);
    } else {
      syncManager.writeLocalState(localState, gameState.streak, gameState.isResonanceActive);
    }
  }
});

// Load Questions and Start (Story 1.4)
QuestionLoader.loadQuestions().then(questions => {
  gameStateManager.setQuestions(questions);
  gameStateManager.startRace();
});

// Cleanup on HMR (Hot Module Replacement)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    engine.stop();
    inputManager.destroy();
    hudManager.destroy();
    raceTrackRenderer.destroy();
    syncManager.stopSync();
  });
}

// Export for LobbyManager to trigger sync
export function startMultiplayerSync(roomId: string) {
  const user = getCurrentUser();
  if (!user) {
    console.error('Cannot start sync: User not authenticated');
    return;
  }

  currentRoomId = roomId;
  isMultiplayer = true;
  syncManager.startSync(roomId, user.uid);
  console.log(`Multiplayer sync started for room ${roomId}`);
}

export function stopMultiplayerSync() {
  isMultiplayer = false;
  currentRoomId = null;
  syncManager.stopSync();
  console.log('Multiplayer sync stopped');
}
