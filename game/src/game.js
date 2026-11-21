// Milo's Garden — game state, input, timer, hints and scoring.
// One job: run a level. Rendering lives in scenes.js, sound in audio.js.

import { LEVELS, PANEL_W, PANEL_H, drawPanel } from './scenes.js';
import { SoundBank } from './audio.js';

export const STATES = {
  TITLE: 'title',
  PLAYING: 'playing',
  LEVEL_DONE: 'level-done',
  GAME_OVER: 'game-over',
  WIN: 'win',
};

const WRONG_PENALTY = 5; // seconds lost on a wrong click
const HINT_COST = 5; // seconds a hint costs
const FIND_POINTS = 100;

export class Game {
  constructor(doc) {
    this.doc = doc;
    this.canvasA = doc.getElementById('panel-a');
    this.canvasB = doc.getElementById('panel-b');
    this.ctxA = this.canvasA.getContext('2d');
    this.ctxB = this.canvasB.getContext('2d');
    this.sounds = new SoundBank();
    this.state = STATES.TITLE;
    this.levelIndex = 0;
    this.found = new Set();
    this.hintsLeft = 3;
    this.score = 0;
    this.misses = 0;
    this.timeLeft = LEVELS[0].timeLimit;
    this.lastTick = 0;
    this.hintMark = null; // {x, y, r, until}
    this.onHud = null; // (game) => void, set by main.js
    this.onOverlay = null; // (kind, data) => void, set by main.js
    this.bindInput();
  }

  level() {
    return LEVELS[this.levelIndex];
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.hintsLeft = 3;
    this.misses = 0;
    this.timeLeft = this.level().timeLimit;
    this.hintMark = null;
    this.state = STATES.PLAYING;
    this.lastTick = performance.now();
    this.render();
    this.updateHud();
  }

  startGame() {
    this.score = 0;
    this.startLevel(0);
  }

  restartLevel() {
    this.sounds.click();
    this.startLevel(this.levelIndex);
  }

  // -- input ---------------------------------------------------------------

  bindInput() {
    for (const canvas of [this.canvasA, this.canvasB]) {
      canvas.addEventListener('click', (ev) => this.handleClick(ev, canvas));
    }
    this.doc.getElementById('hint-btn').addEventListener('click', () => this.useHint());
    this.doc.getElementById('restart-btn').addEventListener('click', () => this.restartLevel());
    this.doc.getElementById('sound-btn').addEventListener('click', (ev) => {
      this.sounds.enabled = !this.sounds.enabled;
      ev.currentTarget.textContent = this.sounds.enabled ? 'Sound: on' : 'Sound: off';
      if (this.sounds.enabled) this.sounds.click();
    });
    this.doc.addEventListener('keydown', (ev) => {
      if (ev.key === 'h' || ev.key === 'H') this.useHint();
      if (ev.key === 'r' || ev.key === 'R') this.restartLevel();
      if (ev.key === 'm' || ev.key === 'M') {
        this.doc.getElementById('sound-btn').click();
      }
      if (['1', '2', '3'].includes(ev.key)) {
        const n = Number(ev.key) - 1;
        if (n < LEVELS.length && this.state !== STATES.TITLE) this.startLevel(n);
      }
    });
  }

  panelPoint(ev) {
    // offsetX/Y are measured from the canvas padding edge (inside its
    // 3px border), so they map exactly onto the 560x420 scene — no need
    // to correct for the border the way getBoundingClientRect would.
    return {
      x: (ev.offsetX / this.canvasA.width) * PANEL_W,
      y: (ev.offsetY / this.canvasA.height) * PANEL_H,
    };
  }

  handleClick(ev, canvas) {
    if (this.state !== STATES.PLAYING) return;
    const p = this.panelPoint(ev);
    const hit = this.level().differences.find((d) => {
      if (this.found.has(d.id)) return false;
      const dx = p.x - d.x;
      const dy = p.y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    });
    if (hit) {
      this.found.add(hit.id);
      this.score += FIND_POINTS;
      this.sounds.found();
      this.render();
      this.updateHud();
      if (this.found.size === this.level().differences.length) this.finishLevel();
    } else {
      this.misses += 1;
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_PENALTY);
      this.sounds.wrong();
      canvas.classList.remove('shake');
      void canvas.offsetWidth; // restart the shake animation
      canvas.classList.add('shake');
      this.updateHud();
      if (this.timeLeft <= 0) this.gameOver();
    }
  }

  useHint() {
    if (this.state !== STATES.PLAYING || this.hintsLeft <= 0) return;
    const remaining = this.level().differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.timeLeft = Math.max(0, this.timeLeft - HINT_COST);
    this.hintMark = { x: pick.x, y: pick.y, r: pick.r + 10, until: performance.now() + 2000 };
    this.sounds.hint();
    this.render();
    this.updateHud();
    if (this.timeLeft <= 0) this.gameOver();
  }

  // -- flow ----------------------------------------------------------------

  finishLevel() {
    const bonus = Math.round(this.timeLeft) * 2;
    this.score += bonus;
    this.sounds.win();
    const last = this.levelIndex === LEVELS.length - 1;
    this.state = last ? STATES.WIN : STATES.LEVEL_DONE;
    const stars = this.timeLeft > this.level().timeLimit * 0.5 ? 3
      : this.timeLeft > this.level().timeLimit * 0.25 ? 2 : 1;
    this.onOverlay?.(this.state, { bonus, stars });
    this.updateHud();
  }

  gameOver() {
    this.state = STATES.GAME_OVER;
    this.sounds.wrong();
    this.onOverlay?.(STATES.GAME_OVER, { found: this.found.size, total: this.level().differences.length });
    this.updateHud();
  }

  nextLevel() {
    this.startLevel(this.levelIndex + 1);
  }

  // -- loop ----------------------------------------------------------------

  tick(now) {
    if (this.state === STATES.PLAYING) {
      const dt = (now - this.lastTick) / 1000;
      this.timeLeft = Math.max(0, this.timeLeft - dt);
      if (this.hintMark && now > this.hintMark.until) {
        this.hintMark = null;
        this.render();
      }
      if (this.timeLeft <= 0) {
        this.gameOver();
      } else {
        this.updateHud();
      }
    }
    this.lastTick = now;
    requestAnimationFrame((t) => this.tick(t));
  }

  // -- drawing --------------------------------------------------------------

  render() {
    drawPanel(this.ctxA, this.levelIndex, false, this.found);
    drawPanel(this.ctxB, this.levelIndex, true, this.found);
    if (this.hintMark) this.drawHintMark();
  }

  drawHintMark() {
    for (const ctx of [this.ctxA, this.ctxB]) {
      ctx.save();
      ctx.strokeStyle = '#ffd94a';
      ctx.lineWidth = 5;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.arc(this.hintMark.x, this.hintMark.y, this.hintMark.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  updateHud() {
    const level = this.level();
    this.doc.getElementById('level-name').textContent = level.name;
    this.doc.getElementById('found-count').textContent =
      `${this.found.size} / ${level.differences.length}`;
    this.doc.getElementById('left-count').textContent =
      String(level.differences.length - this.found.size);
    const timerEl = this.doc.getElementById('timer');
    timerEl.textContent = String(Math.ceil(this.timeLeft));
    timerEl.classList.toggle('danger', this.timeLeft <= 15 && this.state === STATES.PLAYING);
    this.doc.getElementById('score').textContent = String(this.score);
    const hintBtn = this.doc.getElementById('hint-btn');
    hintBtn.textContent = `Hint (${this.hintsLeft})`;
    hintBtn.disabled = this.hintsLeft <= 0 || this.state !== STATES.PLAYING;
    this.onHud?.(this);
  }
}
