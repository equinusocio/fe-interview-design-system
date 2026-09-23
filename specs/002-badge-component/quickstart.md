# Quickstart: Badge Component

## Prerequisites

- Node `>=24`, `pnpm` per `package.json`
- Foundation tokens present in `src/index.css` (`001-ds-foundation`)

## Validate

```bash
pnpm test
pnpm tsc
pnpm check
pnpm storybook
```

### Expected outcomes

1. **`pnpm test`**: `test/badge.test.tsx` passes — children render; default
   `data-variant="neutral"`; explicit variants distinguishable.
2. **`pnpm tsc`**: no type errors on `Badge` / `BadgeProps`.
3. **`pnpm check`**: Biome clean for new Badge files.
4. **`pnpm storybook`**: open Badge stories; same label on `neutral` /
   `positive` / `negative`; visually distinct fills; resize across ~768px to
   spot-check padding/radius/height (visual review vs Figma).

## Manual responsive check

1. Open Badge story.
2. Narrow viewport (≤768px): tighter padding, smaller radius/height.
3. Widen past `48em`: larger padding/radius/max-height.
4. Confirm label stays single-line with a long string.

## Contract reference

See [contracts/badge.md](./contracts/badge.md) and [data-model.md](./data-model.md).
