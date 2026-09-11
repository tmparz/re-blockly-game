import { levelTranslations01 } from "./levels/levels-01.js";
import { levelTranslations02 } from "./levels/levels-02.js";
import { levelTranslations03 } from "./levels/levels-03.js";

export const LEVEL_TRANSLATIONS = {
  en: {
    ...levelTranslations01,
    ...levelTranslations02,
    ...levelTranslations03,
  },
};
