import { runtime } from "./runtime.js";

export function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  if (!runtime.audioContext) {
    runtime.audioContext = new AudioContextClass();
  }
  return runtime.audioContext;
}

export async function prepareAudio() {
  const context = getAudioContext();
  if (!context) {
    return;
  }
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      // Audio is optional; browsers may block it until a later gesture.
    }
  }
}

export function playTone(frequency, start, duration, type = "sine", volume = 0.08) {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export function vibrate(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export function playSuccessSound() {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    return;
  }
  const now = context.currentTime;
  playTone(523.25, now, 0.16, "sine", 0.08);
  playTone(659.25, now + 0.09, 0.16, "sine", 0.08);
  playTone(783.99, now + 0.18, 0.22, "triangle", 0.09);
  vibrate(30);
}

export function playFailSound() {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    return;
  }
  const now = context.currentTime;
  playTone(220, now, 0.16, "sawtooth", 0.055);
  playTone(174.61, now + 0.13, 0.2, "sawtooth", 0.05);
  vibrate([30, 45, 30]);
}
