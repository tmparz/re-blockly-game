# While Progression Summary

## Done

- Expanded the While stage into 37 ordered levels after removing the former level 46 and adding additional hard While levels.
- Removed the earlier straight-line portal and outer-to-inner spiral levels.
- Kept `if_condition` and `if_else_condition` out of every While level; only `while-for-mixed-patrol` uses `repeat_times` as a late hard mixed-practice level.
- Added 7 more early While practice levels before the existing corridor work: `NOT_DONE`, wall stopping, direction variation, `ON_GEM`, post-loop flow, and simple nested gem checks.
- Added 4 more late While challenges: large row sweep, left-turn perimeter nesting, two-row outer While routines, and front-blocked turn routing.
- Kept progressive topics: wall stopping, turning until open, collection loops, multi-segment corridors, nested While, serpentine cleanup, switchback routes, and long checkpoint routing.
- Replaced repeated U-corridor, corner-station, and small-serpentine designs with distinct gap-check, nested switchback, and room-relay maps.
- Updated English translations for all new While level IDs.
- Updated README count and While-stage description.
- Ran the Feature Shipper hooks doctor check in read-only mode; evolution hooks were missing, so no hook artifacts were expected.
- Fixed one verification finding: `while-warehouse-row-sweep` needed `targetBlocks: 31` because the reference solution uses 31 blocks.
- Removed `while-empty-check-skip`, which was the visible level 46 after the 32-level While expansion.
- Replaced repeated late-stage templates with distinct hard levels: uneven lift shafts, dead-end return, rotation-lock routing, and a final crossroad return challenge.
- Fixed two pre-deploy validation failures in the new hard section: `while-for-mixed-patrol` now reaches its turn corner before climbing, and the former right-turn-compatible route was later replaced because it was too close to adjacent hard While levels.
- Replaced the old level 71 `while-blocked-turn-router` because it was too close to level 62, then replaced `while-double-gate-calibration` because it was too close to level 72. The current level 71 `while-gem-ribbon-switchbacks` uses `While(ON_GEM)` to collect and move through gem ribbons instead of using wall-based rotation.
- Reworked level 75 from an outer-frame scan into `while-triple-nested-scan` / `While：三層迴旋探測`, preserving the triple-nested While concept while reducing overlap with level 73.
- Replaced level 76 `while-multi-condition-cross` with `while-side-opening-navigator`, a side-sensor While route that uses `RIGHT_CLEAR` and `FRONT_BLOCKED` instead of another right-turn perimeter patrol.

## Verification

- `node .\scripts\validate-levels.mjs` -> validated 100 levels.
- `node .\scripts\build-static.mjs` -> built 3 static files.
- Local server smoke check: `http://127.0.0.1:4173/` returned HTTP 200 and served the new While ids.
- Data check: While stage has 37 levels, no `if_condition` / `if_else_condition`, and one intentional `repeat_times` mixed-practice level.
- Duplicate-map check: While stage has 0 exact map duplicates.
- Level 71 duplicate check: no exact map duplicate against any While level, no duplicate solution signature against any While level, no IF usage, and level 71/72 open-cell similarity is 0.185.
- Hard-level duplicate check: level 75/76 open-cell similarity is 0.216, level 73/75 open-cell similarity is 0.068, and no level 70+ pair has a duplicate solution signature.
- Browser check: re-run after deployment if visual evidence is needed.
- Browser console check: 0 error logs.

## Notes

- Playwright/browser automation was not available in the current tool environment, so visual QA used server smoke checks plus level validation.
