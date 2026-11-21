// Milo's Garden — bootstrap: overlays, demo screenshot states and the loop.
// The ?shot= parameter renders a fixed mid-game state for the screenshots
// the maker takes (title, mid1, mid2, win). It is real gameplay state drawn
// by the same code the player sees — no composited images.

import { Game, STATES } from './game.js';
import { LEVELS } from './scenes.js';

const game = new Game(document);
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const overlayStars = document.getElementById('overlay-stars');
const overlayBtn = document.getElementById('overlay-btn');

function showOverlay(title, text, stars, btnLabel) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayStars.textContent = stars;
  overlayBtn.textContent = btnLabel;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

game.onOverlay = (kind, data) => {
  if (kind === STATES.LEVEL_DONE) {
    showOverlay(
      'Level complete!',
      `You found every difference in ${game.level().name}.\nTime bonus +${data.bonus} points.`,
      '★'.repeat(data.stars) + '☆'.repeat(3 - data.stars),
      'Next level',
    );
  } else if (kind === STATES.WIN) {
    showOverlay(
      'You found them all!',
      `Milo's garden holds no more secrets.\nFinal score: ${game.score} points.`,
      '★★★',
      'Play again',
    );
  } else if (kind === STATES.GAME_OVER) {
    showOverlay(
      'Out of time!',
      `You found ${data.found} of ${data.total} differences.\nTake another look — the garden is patient.`,
      '',
      'Try again',
    );
  }
};

overlayBtn.addEventListener('click', () => {
  game.sounds.ensure();
  game.sounds.click();
  hideOverlay();
  if (game.state === STATES.LEVEL_DONE) {
    game.nextLevel();
  } else if (game.state === STATES.WIN || game.state === STATES.GAME_OVER) {
    game.startGame();
  } else if (game.state === STATES.TITLE) {
    game.startGame();
  }
});

// Demo states for screenshots: ?shot=title|mid1|mid2|win
function applyShot(shot) {
  if (!shot) return true;
  if (shot === 'title') {
    game.startLevel(0);
    game.state = STATES.TITLE;
    showOverlay(
      "Milo's Garden",
      'Two pictures hang side by side in Milo’s garden.\nThey look the same — but they are not.\nFind every difference before the sun sets!',
      '',
      'Start playing',
    );
    return true;
  }
  if (shot === 'mid1' || shot === 'mid2') {
    const levelIndex = shot === 'mid1' ? 0 : 1;
    game.startLevel(levelIndex);
    const level = LEVELS[levelIndex];
    const foundIds = shot === 'mid1'
      ? [level.differences[0].id, level.differences[3].id]
      : [level.differences[1].id, level.differences[4].id, level.differences[5].id];
    for (const id of foundIds) game.found.add(id);
    game.timeLeft = shot === 'mid1' ? 62 : 48;
    game.score = foundIds.length * 100;
    game.state = STATES.PLAYING;
    game.lastTick = performance.now();
    game.render();
    game.updateHud();
    return true;
  }
  if (shot === 'win') {
    game.startLevel(2);
    for (const d of LEVELS[2].differences) game.found.add(d.id);
    game.score = 2140;
    game.timeLeft = 41;
    game.state = STATES.WIN;
    game.render();
    game.updateHud();
    showOverlay(
      'You found them all!',
      "Milo's garden holds no more secrets.\nFinal score: 2140 points.",
      '★★★',
      'Play again',
    );
    return true;
  }
  return false;
}

const params = new URLSearchParams(window.location.search);
if (!applyShot(params.get('shot'))) {
  // Normal play: title screen over the first level.
  game.startLevel(0);
  game.state = STATES.TITLE;
  showOverlay(
    "Milo's Garden",
    'Two pictures hang side by side in Milo’s garden.\nThey look the same — but they are not.\nFind every difference before the sun sets!',
    '',
    'Start playing',
  );
}

requestAnimationFrame((t) => game.tick(t));
