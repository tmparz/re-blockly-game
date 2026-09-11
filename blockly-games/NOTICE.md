# Blockly Games — local touch adaptation

Original project: https://github.com/google/blockly-games
Original games: https://blockly.games/
Copyright Google LLC and Blockly Games contributors. Apache-2.0; see
`bird-game/LICENSE` for the bundled license text.

This directory contains local copies of the compiled Turtle, Movie, Music,
Pond Tutor, and Pond Duck games, their game assets, Blockly, ACE, SoundJS,
and Music soundfonts. The five game bundles were downloaded on 2026-09-11.

Local changes are applied by `scripts/patch-blockly-games.mjs`:

- number and angle fields open a large touch numeric keypad;
- Music pitch fields open touch note buttons instead of requiring keyboard text;
- only the bundled English and Traditional Chinese language packs are enabled;
- sharing and gallery links are hidden because this static copy has no backend.

The original game rules, levels, and Blockly validation remain in the bundled
runtime. The patch checks exact upstream signatures so a vendor update must be
reviewed and revalidated before replacing the compiled bundles.
