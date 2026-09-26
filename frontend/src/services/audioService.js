/**
 * Procedural Audio Synthesizer using Web Audio API for DREAM LOGIC.
 * Zero external mp3 dependencies, lightweight, and deeply atmospheric.
 */
class DreamAudioService {
  constructor() {
    this.ctx = null;
    this.droneGain = null;
    this.isMuted = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  toggleSound(enabled) {
    this.isMuted = !enabled;
    if (!this.initialized && enabled) {
      this.init();
    }

    if (this.ctx && this.ctx.state === "suspended" && enabled) {
      this.ctx.resume();
    }

    if (enabled) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    return !this.isMuted;
  }

  startAmbientDrone() {
    if (!this.ctx || this.isMuted || this.droneGain) return;

    try {
      // Create dual sine oscillators for a rich, low-frequency dream hum
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      this.droneGain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // Subtle beating effect

      // LFO for slow ambient breathing wave
      lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      lfo.connect(lfoGain.gain);

      this.droneGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

      osc1.connect(this.droneGain);
      osc2.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      lfo.start();

      this.droneOscs = [osc1, osc2, lfo];
    } catch (e) {
      console.warn("Error starting drone:", e);
    }
  }

  stopAmbientDrone() {
    if (this.droneGain && this.ctx) {
      try {
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.droneOscs) {
            this.droneOscs.forEach(o => {
              try { o.stop(); } catch(err){}
            });
            this.droneOscs = null;
          }
          this.droneGain = null;
        }, 500);
      } catch (e) {
        this.droneGain = null;
      }
    }
  }

  playTick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playSuccessChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const freqs = [329.63, 440.00, 554.37, 659.25]; // E4, A4, C#5, E5 ethereal chord
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + idx * 0.12 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 1.9);
      });
    } catch (e) {}
  }
}

export const audioService = new DreamAudioService();
