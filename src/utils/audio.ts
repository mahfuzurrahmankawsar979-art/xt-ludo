/**
 * XT LUDO Procedural Web Audio Engine
 * Zero external audio files required. Completely offline, ultra-fast and crisp.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Sound effect: Dice Roll tumbling
   */
  public playDiceRoll() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const clicks = 6;
    for (let i = 0; i < clicks; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.random() * 240, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  /**
   * Sound effect: Individual Step Hop (ঘর পার হওয়ার মধুর সাউন্ড)
   * Ascending melodic marimba pop for every step traversed
   */
  public playStepHop(stepIndex: number = 0, totalSteps: number = 6) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Ascend gently with each step
    const baseFreq = 480 + (stepIndex / Math.max(1, totalSteps)) * 280;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.09);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Sound effect: Exiting Home Yard (ঘর থেকে গুটি বের হওয়ার জাম্প সাউন্ড)
   */
  public playTokenExit() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Sound effect: Token Knock / Capture opponent (গুটি খাওয়ার পাওয়ারফুল সাউন্ড)
   * Impact crack + warp/slide back to yard
   */
  public playCapture() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Heavy Punch / Hit Impact
    const impactOsc = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impactOsc.type = 'sawtooth';
    impactOsc.frequency.setValueAtTime(420, now);
    impactOsc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

    impactGain.gain.setValueAtTime(0.5, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    impactOsc.connect(impactGain);
    impactGain.connect(ctx.destination);

    impactOsc.start(now);
    impactOsc.stop(now + 0.2);

    // 2. Descending Slide / Send Home whistle
    const slideOsc = ctx.createOscillator();
    const slideGain = ctx.createGain();
    slideOsc.type = 'sine';
    slideOsc.frequency.setValueAtTime(750, now + 0.1);
    slideOsc.frequency.exponentialRampToValueAtTime(140, now + 0.35);

    slideGain.gain.setValueAtTime(0.3, now + 0.1);
    slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    slideOsc.connect(slideGain);
    slideGain.connect(ctx.destination);

    slideOsc.start(now + 0.1);
    slideOsc.stop(now + 0.36);

    // Haptic vibration feedback for mobile knockout
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([70, 40, 90]);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Sound effect: Reaching Safe Zone or Home
   */
  public playSafeZone() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  /**
   * Sound effect: Rolling a 6 (Lucky / Bonus Turn)
   */
  public playSixRoll() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    });
  }

  /**
   * Sound effect: Victory Fanfare
   */
  public playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfare = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.2 },
      { f: 1046.5, d: 0.5 }
    ];

    let offset = 0;
    fanfare.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + offset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + n.d + 0.05);

      offset += n.d * 0.9;
    });
  }

  /**
   * Subtle tick for secret zone tap
   */
  public playSecretTap() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }
}

export const sound = new SoundEngine();
