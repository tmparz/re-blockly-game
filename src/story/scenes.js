// Illustrated backdrops for Story Lab, drawn as SVG so they stay crisp on any screen.
// viewBox is 1600×900; characters stand on the ground around y≈800.

const repeat = (n, draw) => Array.from({ length: n }, (_, i) => draw(i)).join("");
const rand = (seed) => {
  let x = seed;
  return () => ((x = (x * 9301 + 49297) % 233280) / 233280);
};
const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".92">
  <ellipse cx="0" cy="0" rx="70" ry="38"/><ellipse cx="55" cy="-18" rx="55" ry="42"/><ellipse cx="110" cy="4" rx="62" ry="34"/></g>`;
const tree = (x, y, s = 1, leaf = "#4caf50") => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-16" y="-40" width="32" height="140" rx="10" fill="#8d5a3b"/>
  <circle cx="0" cy="-90" r="90" fill="${leaf}"/><circle cx="-60" cy="-40" r="60" fill="${leaf}"/>
  <circle cx="60" cy="-40" r="62" fill="${leaf}"/><circle cx="-25" cy="-120" r="40" fill="#fff" opacity=".12"/></g>`;

const SCENES = {
  home: () => `
    <rect width="1600" height="900" fill="#fde9d2"/>
    ${repeat(9, (i) => `<rect x="${i * 180}" y="0" width="90" height="640" fill="#fbdcbc" opacity=".55"/>`)}
    <rect x="1060" y="120" width="360" height="280" rx="18" fill="#9fd8ff" stroke="#fff" stroke-width="22"/>
    <circle cx="1330" cy="200" r="46" fill="#ffd54f"/>${cloud(1120, 300, .7)}
    <line x1="1240" y1="120" x2="1240" y2="400" stroke="#fff" stroke-width="14"/>
    <rect x="180" y="150" width="220" height="160" rx="10" fill="#fff" stroke="#c98b5d" stroke-width="14"/>
    <path d="M200 290 L270 210 L320 260 L350 230 L385 290Z" fill="#81c784"/><circle cx="350" cy="195" r="18" fill="#ffb74d"/>
    <rect x="0" y="640" width="1600" height="260" fill="#d9a066"/>
    ${repeat(8, (i) => `<rect x="0" y="${650 + i * 32}" width="1600" height="3" fill="#b9814f" opacity=".6"/>`)}
    <ellipse cx="800" cy="820" rx="520" ry="70" fill="#e57373" opacity=".75"/>
    <ellipse cx="800" cy="820" rx="440" ry="52" fill="#ef9a9a" opacity=".8"/>
    <rect x="1120" y="520" width="360" height="150" rx="40" fill="#7e57c2"/><rect x="1100" y="470" width="400" height="90" rx="40" fill="#9575cd"/>
    <rect x="120" y="360" width="16" height="300" fill="#6d4c41"/><path d="M60 360 L196 360 L166 270 L90 270Z" fill="#ffe082"/>`,
  park: () => {
    const r = rand(7);
    return `
    <defs><linearGradient id="sky-park" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd1ff"/><stop offset="1" stop-color="#d8f3ff"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#sky-park)"/>
    <circle cx="1400" cy="140" r="80" fill="#ffe066"/><circle cx="1400" cy="140" r="110" fill="#ffe066" opacity=".25"/>
    ${cloud(180, 150)}${cloud(760, 110, .8)}
    <path d="M0 620 Q300 480 640 600 T1600 560 V900 H0Z" fill="#9ccc65"/>
    <path d="M0 700 Q400 600 900 690 T1600 650 V900 H0Z" fill="#7cb342"/>
    ${tree(180, 600, 1)}${tree(1420, 590, 1.1, "#43a047")}${tree(1250, 640, .7, "#66bb6a")}
    ${repeat(26, () => `<circle cx="${Math.round(r() * 1600)}" cy="${Math.round(760 + r() * 120)}" r="9" fill="${["#ff8a80", "#fff176", "#ffffff", "#ce93d8"][Math.floor(r() * 4)]}"/>`)}`;
  },
  castle: () => `
    <defs><linearGradient id="sky-castle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e4b9c"/><stop offset="1" stop-color="#f3a6c8"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#sky-castle)"/>
    <circle cx="260" cy="150" r="70" fill="#fff6d5"/>
    <g fill="#8e7cc3">
      <rect x="520" y="300" width="560" height="420"/>
      <rect x="440" y="200" width="150" height="520"/><rect x="1010" y="200" width="150" height="520"/>
      ${repeat(7, (i) => `<rect x="${520 + i * 84}" y="260" width="48" height="50"/>`)}
    </g>
    <path d="M430 200 L515 70 L600 200Z M1000 200 L1085 70 L1170 200Z" fill="#6a5acd"/>
    <path d="M515 70 V20 L575 38 L515 56Z M1085 70 V20 L1145 38 L1085 56Z" fill="#ff7043"/>
    <path d="M730 720 V560 A70 70 0 0 1 870 560 V720Z" fill="#4a3b7a"/>
    ${repeat(4, (i) => `<rect x="${478 + (i % 2) * 570}" y="${320 + Math.floor(i / 2) * 150}" width="40" height="64" rx="20" fill="#ffe082"/>`)}
    <rect x="0" y="700" width="1600" height="200" fill="#6d8f5a"/>
    <path d="M700 900 L760 700 H840 L900 900Z" fill="#c9b79c"/>`,
  space: () => {
    const r = rand(3);
    return `
    <defs><linearGradient id="sky-space" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1026"/><stop offset="1" stop-color="#2a2f6b"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#sky-space)"/>
    ${repeat(90, () => `<circle cx="${Math.round(r() * 1600)}" cy="${Math.round(r() * 650)}" r="${(1 + r() * 3).toFixed(1)}" fill="#fff" opacity="${(.4 + r() * .6).toFixed(2)}"/>`)}
    <circle cx="1250" cy="230" r="120" fill="#ff8a65"/><circle cx="1210" cy="200" r="30" fill="#ffab91"/>
    <ellipse cx="1250" cy="230" rx="210" ry="40" fill="none" stroke="#ffe0b2" stroke-width="14" transform="rotate(-15 1250 230)"/>
    <circle cx="300" cy="170" r="50" fill="#b3e5fc"/>
    <path d="M0 720 Q400 650 800 710 T1600 690 V900 H0Z" fill="#9e9e9e"/>
    ${repeat(7, (i) => `<ellipse cx="${120 + i * 230}" cy="${800 + (i % 3) * 30}" rx="${40 + (i % 2) * 20}" ry="14" fill="#7d7d7d"/>`)}`;
  },
  beach: () => `
    <defs><linearGradient id="sky-beach" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fc3f7"/><stop offset="1" stop-color="#e1f5fe"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#sky-beach)"/>
    <circle cx="300" cy="150" r="85" fill="#ffd54f"/>${cloud(900, 140, .9)}
    <rect x="0" y="470" width="1600" height="220" fill="#29b6f6"/>
    ${repeat(10, (i) => `<path d="M${i * 170} 520 q40 -22 80 0 t80 0" fill="none" stroke="#e1f5fe" stroke-width="8" opacity=".8"/>`)}
    <path d="M0 640 Q800 590 1600 640 V900 H0Z" fill="#ffe0a3"/>
    <path d="M1380 820 Q1400 600 1330 430" fill="none" stroke="#8d6e63" stroke-width="30" stroke-linecap="round"/>
    ${repeat(5, (i) => `<path d="M1330 430 q${-160 + i * 80} -40 ${-190 + i * 95} ${60 - Math.abs(i - 2) * 30}" fill="none" stroke="#43a047" stroke-width="26" stroke-linecap="round"/>`)}
    <path d="M160 820 V620" stroke="#fff" stroke-width="10"/><path d="M40 640 Q160 520 280 640Z" fill="#ef5350"/>`,
  ocean: () => {
    const r = rand(11);
    return `
    <defs><linearGradient id="sky-ocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4dd0e1"/><stop offset="1" stop-color="#01579b"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#sky-ocean)"/>
    ${repeat(5, (i) => `<path d="M${200 + i * 300} 0 L${120 + i * 300} 900 L${240 + i * 300} 900Z" fill="#fff" opacity=".07"/>`)}
    ${repeat(30, () => `<circle cx="${Math.round(r() * 1600)}" cy="${Math.round(r() * 700)}" r="${Math.round(6 + r() * 14)}" fill="none" stroke="#e0f7fa" stroke-width="4" opacity=".6"/>`)}
    <path d="M0 740 Q800 690 1600 740 V900 H0Z" fill="#ffe0a3"/>
    ${repeat(6, (i) => `<path d="M${120 + i * 270} 780 q-40 -120 0 -240 q40 -120 0 -220" fill="none" stroke="#2e7d32" stroke-width="22" stroke-linecap="round"/>`)}
    <circle cx="1240" cy="760" r="60" fill="#ff7043"/><circle cx="1300" cy="780" r="44" fill="#ff8a65"/>`;
  },
};

export const SCENE_IDS = Object.keys(SCENES);

export const SCENE_NAMES = {
  home: { en: "🏠 Home", zh: "🏠 家裡" },
  park: { en: "🌳 Park", zh: "🌳 公園" },
  castle: { en: "🏰 Castle", zh: "🏰 城堡" },
  space: { en: "🚀 Space", zh: "🚀 太空" },
  beach: { en: "🏖️ Beach", zh: "🏖️ 海灘" },
  ocean: { en: "🐠 Under the Sea", zh: "🐠 海底" },
};

export function sceneSvg(id) {
  const draw = SCENES[id] ?? SCENES.home;
  return `<svg class="scene-art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${draw()}</svg>`;
}
