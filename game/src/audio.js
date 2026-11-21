// Tiny synthesised sound effects — no audio files, everything is made with
// the Web Audio API so the game stays fully offline and self-contained.

export class SoundBank {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return true;
  }

  tone(freq, dur, type, vol, when = 0) {
    if (!this.enabled || !this.ensure()) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A happy two-note chime when a difference is found.
  found() {
    this.tone(659, 0.14, 'sine', 0.22);
    this.tone(880, 0.22, 'sine', 0.22, 0.09);
  }

  // A low buzz when the player clicks somewhere with no difference.
  wrong() {
    this.tone(110, 0.18, 'square', 0.12);
  }

  // A soft tick for button presses.
  click() {
    this.tone(520, 0.05, 'triangle', 0.12);
  }

  // A short fanfare for finishing a level.
  win() {
    this.tone(523, 0.16, 'sine', 0.22);
    this.tone(659, 0.16, 'sine', 0.22, 0.12);
    this.tone(784, 0.16, 'sine', 0.22, 0.24);
    this.tone(1047, 0.3, 'sine', 0.24, 0.36);
  }

  // A rising sparkle for the hint button.
  hint() {
    this.tone(988, 0.1, 'sine', 0.14);
    this.tone(1319, 0.16, 'sine', 0.14, 0.08);
  }
}
