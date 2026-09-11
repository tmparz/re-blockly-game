# Reset Map State Summary

## Done

- Added a global `回到起點` / `Reset map` control next to Run, Reset, and Demo.
- The new control restores the current level state to the initial position, direction, and uncollected gem state.
- Blockly blocks are preserved; the existing `重來` / `Reset` button still clears the program.
- The map reset button is disabled while a program is running.

## Verification

- `node .\scripts\validate-levels.mjs`
- `node .\scripts\build-static.mjs`
- Local server smoke check confirmed `http://127.0.0.1:4173/` returns 200 and includes `resetMapButton`.
