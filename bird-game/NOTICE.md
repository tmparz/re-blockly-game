# Blockly Games Bird — local touch adaptation

Original: https://blockly.games/bird?lang=en
Source project: https://github.com/google/blockly-games
Copyright Google LLC and Blockly Games contributors. Apache-2.0; see LICENSE.
The bundled runtime includes Blockly and Closure components with their original
copyright/license notices retained. Public game assets downloaded 2026-09-11.

Local changes: scripts/patch-bird.mjs patches the compiled text/number and angle
editors to use touch-input.js. Values still pass through the original Blockly
validator and change-event path. touch-input.css adds a modal numeric keypad.
Workspace initial scale is 0.8 to leave more room on tablets.
boot.js restricts languages to the bundled English and Traditional Chinese packs
and disables the unbundled debug mode. Ten original levels and game logic remain.
Server-backed sharing is hidden; no sharing backend is provided.

The patch intentionally checks exact upstream signatures. Do not replace the
vendor bundle without reviewing and reapplying the patch and testing both editor
types. This directory contains third-party compiled code, outside the project's
300-line authored-source limit.
