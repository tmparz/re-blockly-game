// One language setting for the whole site (student pages default to English; 中文 one tap away).
// Quest Lab already used this key, so existing choices carry over.
export const LANG_KEY = "blocky-quest-lang";
const LEGACY_LEVELS_KEY = "blocky-easy-language";

function readLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY) ?? localStorage.getItem(LEGACY_LEVELS_KEY);
    return saved === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

export const lang = readLang();

export function setLang(next) {
  try {
    localStorage.setItem(LANG_KEY, next === "zh" ? "zh" : "en");
    localStorage.removeItem(LEGACY_LEVELS_KEY);
  } catch {
    // Storage can be blocked; the page still works in the default language.
  }
  location.reload();
}

export const pick = (value) => (value && typeof value === "object" ? value[lang] ?? value.en : value);
