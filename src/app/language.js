// The 100 levels follow the site-wide language setting (English by default, see src/shared/lang.js).
import { LANG_KEY, lang } from "../shared/lang.js";

export const LANGUAGE_KEY = LANG_KEY;

export function readLanguage() {
  return lang;
}

export const currentLang = lang;
