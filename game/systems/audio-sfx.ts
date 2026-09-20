// Native Web Audio Synthesizer for Spend It All (zero external assets)

export interface AudioSettings {
  muted: boolean;
  volume: number; // 0.0 to 1.0
}

const STORAGE_KEY = 'sia_audio_settings';

let audioCtx: AudioContext | null = null;
let currentSettings: AudioSettings = {
  muted: false,
  volume: 0.55,
};
const listeners = new Set<(settings: AudioSettings) => void>();

function initSettings() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      currentSettings = {
        muted: typeof parsed.muted === 'boolean' ? parsed.muted : false,
        volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(1, parsed.volume)) : 0.55,
      };
    }
  } catch {
    // Ignore storage parse errors
  }
}

initSettings();

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function notify() {
  for (const listener of listeners) {
    try {
      listener({ ...currentSettings });
    } catch {
      // Ignore listener error
    }
  }
}

export function getAudioSettings(): AudioSettings {
  return { ...currentSettings };
}

export function setAudioMuted(muted: boolean): AudioSettings {
  currentSettings.muted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
  }
  notify();
  return { ...currentSettings };
}

export function toggleAudioMute(): AudioSettings {
  return setAudioMuted(!currentSettings.muted);
}

export function setAudioVolume(volume: number): AudioSettings {
  currentSettings.volume = Math.max(0, Math.min(1, volume));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
  }
  notify();
  return { ...currentSettings };
}

export function subscribeAudioSettings(listener: (settings: AudioSettings) => void): () => void {
  listeners.add(listener);
  listener({ ...currentSettings });
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Play a light, crisp tactile click sound
 */
export function playClickSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(680, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

  const vol = currentSettings.volume * 0.25;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * Play a subtle mechanical ticker sound
 */
export function playTickSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.025);

  const vol = currentSettings.volume * 0.18;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.03);
}

/**
 * Play a dual-tone sparkling coin chime
 */
export function playCoinSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.3;

  [1046.5, 1318.5].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.04;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.15);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.24);
  });
}

/**
 * Play a rich, satisfying purchase chime (rising major chord)
 */
export function playPurchaseSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.28;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.045;

    osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.28);
  });
}

/**
 * Play an achievement celebration fanfare
 */
export function playAchievementSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.35;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.055;
    const duration = 0.35 + idx * 0.08;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });
}

/**
 * Play a cosmic resonance sound for prestige/dynasty ascension
 */
export function playPrestigeSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.38;
  const chords = [130.81, 196.0, 261.63, 392.0, 523.25]; // C3, G3, C4, G4, C5

  chords.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.07;
    const duration = 0.9 + idx * 0.15;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.01, startTime + duration);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });
}

/**
 * Play a morning market news chime
 */
export function playWeatherSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.26;
  const notes = [440, 554.37, 659.25]; // A4, C#5, E5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.07;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.32);
  });
}

/**
 * Play a gentle, elegant dual-tone notification reminder chime
 */
export function playNotificationSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.28;
  const notes = [587.33, 880.0]; // D5, A5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.09;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.42);
  });
}

/**
 * Play a rich, celebratory arpeggio fanfare for daily check-in rewards
 */
export function playDailyClaimSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.34;
  const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C4, E4, G4, C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.065;
    const duration = 0.5 + idx * 0.08;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.005, startTime + duration);

    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });
}

/**
 * Play a serene, resonant sacred bell / chime for prayer contemplation and alarms
 */
export function playPrayerBellSound() {
  if (currentSettings.muted || currentSettings.volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const vol = currentSettings.volume * 0.28;
  const freqs = [432, 864, 1296];

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.015;
    const duration = 1.3 - idx * 0.22;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.998, startTime + duration);

    const harmonicVol = vol / (idx + 1);
    gain.gain.setValueAtTime(harmonicVol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  });
}
