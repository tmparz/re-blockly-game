# Blocky Easy Design System

## Direction

Kid-friendly coding lab, not a marketing landing page. The first screen is the actual playable teaching tool: level list, mission board, and Blockly workspace.

## Visual Rules

- Use a bright learning interface on top of a dark app frame so Blockly feels like a coding lab without becoming visually heavy.
- Main colors: deep navy app shell, white/blue panels, green success, blue action, amber reward, red error, violet loop accents.
- Typography: rounded headings with Baloo-style rhythm; body text uses a readable Traditional Chinese sans font.
- Use real UI icons as inline SVG, not emoji icons.
- Keep repeated level items as compact cards; keep the board and Blockly area as tool panels.

## Interaction Rules

- Every clickable control must have hover and focus feedback.
- The game board must have fixed grid proportions so the map never shifts during movement.
- Blockly actions should produce immediate feedback: status, board animation, and result text.
- Respect reduced motion by disabling long transitions when the user requests it.

## Accessibility Rules

- Buttons have accessible names through visible text.
- Status and result regions use live updates.
- Text contrast must stay high on all panels.
- Mobile layout stacks panels vertically with no horizontal scroll.
