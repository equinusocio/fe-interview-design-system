# Quickstart: Design System Foundation Tokens

## Prerequisites

- Node `>=24`, `pnpm` (see `packageManager` in `package.json`)
- Feature branch `001-ds-foundation`

## Setup

```bash
pnpm install
```

## Validate tokens (automated)

```bash
pnpm test
```

**Expected**: Vitest passes; presence suite confirms all required custom
properties from [contracts/tokens.md](./contracts/tokens.md) exist on `:root`.

## Validate visually

```bash
pnpm dev
```

1. Open the app URL from Vite.
2. Confirm body text uses Inter (after font load) with dark foreground on white
   background.
3. Tab to a focusable control (add a temporary `<button>` if needed) and confirm
   `:focus-visible` outline uses primary color.
4. In DevTools → Computed / `:root`, spot-check token names from the contract.

## Font CDN note

`index.html` loads Inter from Google Fonts for this take-home only — see the
HTML comment next to the font links.
