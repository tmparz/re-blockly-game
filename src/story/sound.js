// Tiny Web Audio synth: no sound files to download, works offline.
let context = null;
let muted = false;

function audio() {
  if (muted) return null;
  try {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === "suspended") context.resume();
    return context;
  } catch {
    return null;
  }
}

function tone(ac, { type = "sine", from, to = from, start = 0, length = 0.15, volume = 0.25 }) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const t = ac.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + length);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + length);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + length + 0.02);
}

function noise(ac, { start = 0, length = 0.12, volume = 0.3 }) {
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * length), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  const gain = ac.createGain();
  gain.gain.value = volume;
  src.buffer = buffer;
  src.connect(gain).connect(ac.destination);
  src.start(ac.currentTime + start);
}

const SOUNDS = {
  pop: (ac) => tone(ac, { from: 900, to: 180, length: 0.09 }),
  boing: (ac) => {
    tone(ac, { type: "triangle", from: 180, to: 620, length: 0.18 });
    tone(ac, { type: "triangle", from: 620, to: 260, start: 0.18, length: 0.22 });
  },
  drum: (ac) => {
    tone(ac, { from: 150, to: 45, length: 0.25, volume: 0.5 });
    noise(ac, { length: 0.08, volume: 0.15 });
  },
  magic: (ac) => [880, 1109, 1319, 1760, 2217].forEach((f, i) =>
    tone(ac, { type: "triangle", from: f, start: i * 0.07, length: 0.25, volume: 0.15 })),
  cheer: (ac) => {
    [523, 659, 784, 1047].forEach((f, i) => tone(ac, { type: "square", from: f, start: i * 0.1, length: 0.18, volume: 0.08 }));
    noise(ac, { start: 0.35, length: 0.5, volume: 0.12 });
  },
  step: (ac) => tone(ac, { from: 300, to: 220, length: 0.05, volume: 0.06 }),
};

export const SOUND_IDS = ["pop", "boing", "drum", "magic", "cheer"];

export function play(name) {
  const ac = audio();
  if (ac && SOUNDS[name]) SOUNDS[name](ac);
}

export function setMuted(value) {
  muted = value;
}
