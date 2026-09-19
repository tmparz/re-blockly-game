import { LEVEL_ORDER } from "./level-order.js";
import { levels01 } from "./levels/levels-01.js";
import { levels02 } from "./levels/levels-02.js";
import { levels03 } from "./levels/levels-03.js";
import { levels04 } from "./levels/levels-04.js";
import { levels05 } from "./levels/levels-05.js";
import { levels06 } from "./levels/levels-06.js";
import { levels07 } from "./levels/levels-07.js";
import { levels08 } from "./levels/levels-08.js";
import { levels09 } from "./levels/levels-09.js";
import { levels10 } from "./levels/levels-10.js";
import { levels11 } from "./levels/levels-11.js";
import { levels12 } from "./levels/levels-12.js";
import { levels13 } from "./levels/levels-13.js";
import { levels14 } from "./levels/levels-14.js";
import { levels15 } from "./levels/levels-15.js";
import { levels16 } from "./levels/levels-16.js";
import { levels17 } from "./levels/levels-17.js";
import { levels18 } from "./levels/levels-18.js";
import { levels19 } from "./levels/levels-19.js";
import { levels20 } from "./levels/levels-20.js";
import { levels21 } from "./levels/levels-21.js";

const allLevels = [
  ...levels01,
  ...levels02,
  ...levels03,
  ...levels04,
  ...levels05,
  ...levels06,
  ...levels07,
  ...levels08,
  ...levels09,
  ...levels10,
  ...levels11,
  ...levels12,
  ...levels13,
  ...levels14,
  ...levels15,
  ...levels16,
  ...levels17,
  ...levels18,
  ...levels19,
  ...levels20,
  ...levels21,
];

const byId = new Map(allLevels.map((level) => [level.id, level]));
if (byId.size !== allLevels.length || new Set(LEVEL_ORDER).size !== allLevels.length ||
    LEVEL_ORDER.some((id) => !byId.has(id))) {
  throw new Error("Curriculum order must contain every level ID exactly once.");
}
export const LEVELS = LEVEL_ORDER.map((id) => byId.get(id));
export const LEGACY_LEVEL_IDS = allLevels.map((level) => level.id);
