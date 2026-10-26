# APTS mobile palette handoff

Product: a compact Russian developer reference for a palette, not a marketing page.
Keep the accepted three panels and the added HEX diagnostics visually consistent.

## Source of truth

The conversation's accepted palette contract is implemented by palette-engine.js
and palette-data.json. They own the one shared coefficient table and fixed values.
The diagnostic adapter color-inspector.js only normalizes notation; it must not
modify color generation. No change to the Swift/Kotlin generator is required.

## Appearance

Runtime styling is owned by src/page.html and src/green-check.css. Preserve the
existing system font, white cards, light gray background, compact 12–14px labels,
7–9px radii, and purple focus/accent. No hero blocks, illustrations, or animations.
Palette chips show actual values; diagnostic table differences also use text.
Code blocks retain the existing offline syntax highlighter.

## Layout and behavior

Five tabs: palette, plain-language algorithm explanation, HEX diagnostics, Figma comparison, source code. Diagnostic
code examples and editable fields reflow to one column below 800px. The dense
six-column comparison table scrolls within an explicitly labeled region on phones.
All calculations run locally; there are no remote submits, accounts, or storage.
Locale is ru-RU. The existing controls are native buttons and text inputs.

## Verification

npm test; npm run build; browser checks of exact match, different RGB, alpha
mismatch, different alpha/HEX formats, invalid base, malformed value, keyboard and narrow view.
