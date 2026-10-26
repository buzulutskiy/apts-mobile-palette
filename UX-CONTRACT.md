# UI contract

## Authority

Business source: the user's approved palette handoff in this chat, plus the
Android Color and Compose toArgb documentation linked in the diagnostics panel.
The generator and palette data remain authoritative for all shades and exclusions.

## Canonical owners

Form: native text inputs and buttons in src/green-check.html; normalization and
errors in color-inspector.js; display state in src/green-check.js.
Tabs: show() in src/app.js, with keyboard handling in src/green-check.js.
Comparison table: read-only generated/Figma cells and editable developer input.
No selection, paging, menus, dates, dialogs or server mutations are part of this UI.

## States

An empty developer value is neutral. Invalid syntax has an associated inline
error and aria-invalid. Exact match includes alpha; matching RGB with different
alpha is explicitly partial. Different RGB never reports success.
An invalid/non-opaque base hides stale results and disables their download.
User values persist while tabs switch. Reset clears them and restores #21C45D.
Hashes open the intended tab. All diagnostic input stays in the current browser.

## Scope

Color parsing supports explicit RGB/ARGB HEX and 32-bit decimal ColorInt.
Ambiguous positive decimal/HEX strings need # or int:. 64-bit Color.value is not
a 32-bit HEX; users are directed to Compose toArgb(). Screen pixels are not tokens.
