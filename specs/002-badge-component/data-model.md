# Data Model: Badge Component

## Entities

### Badge

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `children` | `React.ReactNode` | yes (can be empty) | — | Label/content |
| `variant` | `"neutral" \| "positive" \| "negative"` | no | `"neutral"` | Status treatment |
| native span props | `React.ComponentPropsWithoutRef<"span">` | no | — | Spread on root; `ref` supported via React 19 prop if using WithRef |

**Relationships**: None in this feature (Tabs composition out of scope).

**Validation rules**:
- Public `variant` union is closed (three values only).
- Default applies when `variant` omitted.
- Root exposes `data-variant` equal to the resolved variant string.

### Responsive size recipe (derived, not props)

| Viewport | Padding-block | Padding-inline | Border-radius | Max-block-size |
|----------|---------------|----------------|---------------|----------------|
| Mobile (default) | `--space-4xs` | `--space-3xs` | `--space-2xs` | `round(nearest, 1.375rem, 2px)` |
| Desktop `width > 48em` | `--space-3xs` | `--space-2xs` | `--space-xs` | `round(nearest, 1.625rem, 2px)` |

### Variant → tokens

| Variant | Background | Foreground |
|---------|------------|------------|
| `neutral` | `--global-contrast` | `--global-foreground` |
| `positive` | `--highlight-green` | `--global-foreground` |
| `negative` | `--highlight-red` | `--global-foreground` |

## State transitions

None — pure presentational; no internal state.
