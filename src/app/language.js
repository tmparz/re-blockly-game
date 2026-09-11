export const LANGUAGE_KEY = "blocky-easy-language";

export function readLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

export const currentLang = readLanguage();
