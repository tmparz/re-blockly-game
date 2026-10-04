// Story Lab top bar: the track switch plus one numbered dot per task (capstones get a ✨ name).
import { pick, t } from "./i18n.js";

export function renderNav(root, { tracks, track, index: current, done, capstones, onSelect }) {
  root.innerHTML = "";
  // The dark button shows the current track; tapping it moves on to the next one.
  const names = Object.keys(tracks);
  const other = names[(names.indexOf(track) + 1) % names.length];
  const trackButton = document.createElement("button");
  trackButton.type = "button";
  trackButton.className = "task-dot track-switch";
  trackButton.textContent = t(`track_${track}`);
  trackButton.title = t("switchTo", { name: t(`track_${other}`) });
  trackButton.addEventListener("click", () => onSelect(0, other));
  root.append(trackButton);
  tracks[track].forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    const capstone = capstones[item.id];
    button.className = `task-dot${capstone ? " mine" : ""}`;
    button.textContent = capstone ? `✨ ${t(capstone)}` : String(index + 1);
    button.dataset.done = String(Boolean(done[item.id]));
    button.setAttribute("aria-pressed", String(index === current));
    button.setAttribute("aria-label", pick(item.title));
    button.title = pick(item.title);
    button.addEventListener("click", () => onSelect(index));
    root.append(button);
  });
}
