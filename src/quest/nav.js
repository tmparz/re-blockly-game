// Quest Lab navigation: unit tabs (one course part at a time), mission dots and map tabs.
import { missionNumber } from "./missions/index.js";
import { pick, t } from "./i18n.js";

const button = (className, onClick) => {
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  el.addEventListener("click", onClick);
  return el;
};
const starsOf = (missions, stars) => missions.reduce((sum, m) => sum + (stars[m.id] ?? 0), 0);

// The dark button switches between Part 2 and Part 3.
export function renderUnitTabs(root, { units, current, stars, onSelect }) {
  root.innerHTML = "";
  const part = units[current].part;
  const other = part === 2 ? 3 : 2;
  const toggle = button("unit-tab part-switch", () => onSelect(units.findIndex((unit) => unit.part === other), 0));
  toggle.textContent = t(`part${part}`);
  toggle.title = t("switchPart", { name: t(`part${other}`) });
  root.append(toggle);
  units.forEach((unit, index) => {
    if (unit.part !== part) return;
    const tab = button("unit-tab", () => onSelect(index, 0));
    tab.setAttribute("aria-pressed", String(index === current));
    tab.innerHTML = `<span class="unit-icon">${unit.icon}</span><span><strong class="full"></strong><strong class="short"></strong><small></small></span>`;
    tab.querySelector(".full").textContent = pick(unit.title);
    tab.querySelector(".short").textContent = pick(unit.short);
    tab.querySelector("small").textContent = `${pick(unit.concept)} · ⭐ ${starsOf(unit.missions, stars)}/${unit.missions.length * 3}`;
    root.append(tab);
  });
}

// 🔮 predict missions get a crystal-ball dot and no number.
export function renderMissionDots(root, { unit, current, stars, onSelect }) {
  root.innerHTML = "";
  unit.missions.forEach((mission, index) => {
    const number = missionNumber(unit, index);
    const dot = button(`mission-dot${number === null ? " predict" : ""}`, () => onSelect(index));
    dot.dataset.stars = stars[mission.id] ?? 0;
    dot.setAttribute("aria-pressed", String(index === current));
    dot.setAttribute("aria-label", `${number === null ? t("predictKicker") : t("mission", { n: number })}: ${pick(mission.title)}`);
    dot.textContent = number === null ? "🔮" : number;
    root.append(dot);
  });
}

export function renderMapTabs(root, { count, current, results, onSelect }) {
  root.hidden = count < 2;
  root.innerHTML = "";
  for (let index = 0; index < count; index += 1) {
    const tab = button("map-tab", () => onSelect(index));
    const outcome = results?.[index];
    tab.dataset.outcome = outcome ? (outcome.ok ? "pass" : "fail") : "";
    tab.innerHTML = `<span class="full">${t("map")}</span>${index + 1}${outcome ? (outcome.ok ? " ✓" : " ✗") : ""}`;
    tab.setAttribute("aria-pressed", String(index === current));
    root.append(tab);
  }
}
