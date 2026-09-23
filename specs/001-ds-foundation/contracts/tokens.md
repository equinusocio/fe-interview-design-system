# Contract: Foundation CSS Custom Properties

Published surface: CSS custom properties on `:root` (loaded via `src/index.css`).

## Spacing (`--space-*`)

| Name | Declared value |
|------|----------------|
| `--space-0` | `0` |
| `--space-4xs` | `0.125rem` |
| `--space-3xs` | `0.25rem` |
| `--space-2xs` | `0.5rem` |
| `--space-xs` | `0.75rem` |
| `--space-s` | `1rem` |
| `--space-m` | `1.25rem` |
| `--space-l` | `1.5rem` |
| `--space-xl` | `2rem` |
| `--space-2xl` | `3rem` |

## Global colors (`--global-*`)

| Name | Declared value |
|------|----------------|
| `--global-foreground` | `#1B2134` |
| `--global-background` | `#FFFFFF` |
| `--global-primary` | `#1B2134` |
| `--global-contrast` | `#C4C5CF` |

## Highlight colors (`--highlight-*`)

| Name | Declared value |
|------|----------------|
| `--highlight-green` | `#B1FFC7` |
| `--highlight-red` | `#FFBFB1` |

## Typography (`--font-*`)

| Name | Declared value |
|------|----------------|
| `--font-scale-m` | `0.875rem` |
| `--font-scale-s` | `0.75rem` |
| `--font-lh` | `1.5` |
| `--font-family-body` | `"Inter"` |

## Base chrome (consumers of the contract)

| Selector | Required declarations |
|----------|------------------------|
| `body` | `color: var(--global-foreground)`; `background-color: var(--global-background)`; `font-family: var(--font-family-body), sans-serif` |
| `*:focus-visible` | `outline: var(--global-primary)` |

## Font loading (document)

- `preconnect` to Google Fonts hosts + stylesheet with `display=swap`.
- Adjacent HTML comment: CDN usage only for this technical take-home.

## Automated test contract

- Assert every name in the tables above is declared inside `:root` in `src/index.css`.
- Do **not** assert declared values in tests.
- Implementation note: Vitest parses the stylesheet source (jsdom does not reliably
  expose custom properties via `getComputedStyle`).
