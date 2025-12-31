import './styles/index.css'
import { engine } from './game/engine'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Calculus Racer</h1>
    <div id="game-container"></div>
  </div>
`

// Start the game loop
console.log('Starting Game Engine...');
engine.start();
engine.subscribe((_dt) => {
  // Logic will go here
  // console.log('dt:', _dt); 
});
