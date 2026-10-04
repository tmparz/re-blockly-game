// Progress lives only in this browser (no accounts needed in class).
const STORAGE_KEY = "blocky-quest-v1";

export function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // tries: failed runs per mission, so the teacher's class table can show where a student is stuck.
    return { stars: saved?.stars ?? {}, code: saved?.code ?? {}, last: saved?.last ?? null, tries: saved?.tries ?? {} };
  } catch {
    return { stars: {}, code: {}, last: null, tries: {} };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private mode or blocked storage: the mission still works, it just won't be remembered.
  }
}
