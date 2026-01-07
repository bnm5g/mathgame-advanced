import './styles/index.css';
import { engine } from './game/engine';
import { InputManager } from './utils/keyboard';
import { HUDManager } from './ui/hud';
import { TelemetryManager } from './ui/telemetry';
import { gameStateManager, PHYSICS_VARIABLES } from './game/state';
import { QuestionLoader } from './questions/loader';

// Setup App Container
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="game-app">
    <div id="game-container"></div>
  </div>
`;

// Initialize Systems
console.log('Initializing Systems...');
gameStateManager.setEngine(engine.physics);
const inputManager = new InputManager();
const hudManager = new HUDManager(gameStateManager);
const telemetryManager = new TelemetryManager(gameStateManager);

// Connect Input -> State (Story 1.5 Integration)
inputManager.subscribe((key) => {
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
  // Game Loop Logic
  // In future: gameStateManager.update(dt);
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
  });
}
