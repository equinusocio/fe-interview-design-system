# Data Model: Design System Foundation Tokens

Static design-token entities (no runtime persistence). Identity = CSS custom
property name on `:root`.

## DesignToken

| Field | Description |
|-------|-------------|
| name | Custom property name (e.g. `--space-m`) |
| category | `spacing` \| `global-color` \| `highlight-color` \| `typography` |
| value | Declared CSS value (hex, rem, unitless, or font family) |

### Validation rules

- Name MUST be unique on `:root`.
- Spacing non-zero lengths MUST use `rem` (base 16 from Figma px).
- Color scope limited to `--global-*` and `--highlight-*` categories.
- Automated tests validate **name presence only**.

## SpacingScale (collection)

Ordered steps: `0`, `4xs`, `3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`
→ tokens `--space-*` with values from [contracts/tokens.md](./contracts/tokens.md).

## SemanticGlobalColor (collection)

`foreground`, `background`, `primary`, `contrast` → `--global-*`.

## HighlightColor (collection)

`green`, `red` → `--highlight-*`.

## TypographyToken (collection)

`scale-m`, `scale-s`, `lh`, `family-body` → `--font-*`.

## Relationships

- Base page chrome **consumes** DesignTokens (`body` → global colors +
  `font-family-body`; `:focus-visible` → `global-primary`).
- Future components (Tabs/Badge) **consume** the same tokens; not modeled here.
