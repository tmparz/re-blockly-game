# While Progression Plan

## Acceptance Criteria

- While stage contains exactly 37 levels in order after removing the old level 46 and adding additional hard While levels near the end.
- The earlier straight-portal and outer-to-inner spiral levels are removed.
- While levels do not offer `if_condition` or `if_else_condition`; only the final hard section has one `repeat_times` mixed-practice level.
- Every while level has Chinese source text and English translations.
- Demo solutions pass validation and respect block limits.
- Early While levels include more small practice steps before multi-segment corridors.
- Late While levels include more long-route and nested While challenges.
- Late While levels avoid repeating the same row-sweep/perimeter templates.

## Implementation Notes

- Keep changes scoped to level content, English level translations, README count/description, and evidence notes.
- Reuse existing While condition support: `FRONT_CLEAR`, `FRONT_BLOCKED`, `NOT_DONE`, and `ON_GEM`.
- Use wall-defined paths where the teaching goal depends on sensors or stop conditions.
