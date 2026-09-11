import { boot } from "./app/lifecycle.js";
import { readProgress } from "./app/storage.js";
import { runtime } from "./app/runtime.js";

runtime.progress = readProgress();
window.addEventListener("DOMContentLoaded", boot);
