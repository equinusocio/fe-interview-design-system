# Research: Design System Foundation Tokens

## Inter delivery

- **Decision**: Google Fonts CDN with `preconnect` to `fonts.googleapis.com` /
  `fonts.gstatic.com` and stylesheet using `display=swap`. HTML comment states
  CDN is only for this technical take-home.
- **Rationale**: Spec clarification; matches performant web-font guidance;
  zero binary assets in-repo.
- **Alternatives considered**: Self-host font files (more setup, better for
  production); CSS `@import` only (worse waterfall, no preconnect).

## Token publication surface

- **Decision**: All foundation tokens as CSS custom properties on `:root` in
  `src/index.css`.
- **Rationale**: Explicit requester + constitution (handcrafted CSS tokens).
- **Alternatives considered**: SCSS variables/maps (not the published CSS
  contract); JS theme object (overkill for this feature).

## Spacing units

- **Decision**: Convert Figma px → rem with base 16 (`px / 16`); keep `--space-0`
  as `0` (unitless).
- **Rationale**: Spec FR-002; rem scales with root font size.
- **Alternatives considered**: Keep px (rejected by spec); em (component-relative,
  wrong for global scale).

## Base chrome wiring

- **Decision**: `body` uses `color`, `background-color`, and `font-family` via
  tokens; `*:focus-visible { outline: var(--global-primary); }`. Remove
  competing placeholder `:root` vars and demo-only body rules that fight the
  foundation (large `font-size`, centered grid).
- **Rationale**: Spec clarification US2 / FR-009.
- **Alternatives considered**: Tokens-only without body wiring (invisible to
  reviewers).

## Font family token vs fallback

- **Decision**: `--font-family-body: "Inter"` (family name only); append
  `sans-serif` fallback on the `body` `font-family` declaration.
- **Rationale**: Spec FR-005 clarification.
- **Alternatives considered**: Full stack inside the token (harder to compose).

## Inter weights

- **Decision**: Load default Inter regular (400) via Google Fonts for foundation.
- **Rationale**: Deferred from clarify; body text does not need multi-weight yet.
- **Alternatives considered**: 400+500+600 (extra bytes; revisit when Tabs/Badge
  need emphasis weights).

## Automated testing strategy

- **Decision**: Vitest reads `src/index.css` from disk and asserts each required
  custom property name is declared inside the `:root { … }` block. Do **not**
  assert values. (jsdom does not reliably expose CSS variables via
  `getComputedStyle` / CSSOM.)
- **Rationale**: Spec clarification; presence guards deletions without brittle
  rem/px comparison in jsdom.
- **Alternatives considered**: Assert declared rem strings; assert computed px;
  CSSOM/`getComputedStyle` (unsupported reliably under jsdom).

## Storybook

- **Decision**: Out of scope for this feature. Global CSS already imported by
  the Vite app; Storybook can import the same CSS when components land.
- **Rationale**: Token presence is validated by Vitest; constitution Storybook
  gate targets component variants, not token-only MVP.
- **Alternatives considered**: Dedicated Storybook docs page for tokens (defer).
