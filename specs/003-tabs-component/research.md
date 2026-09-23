# Research: Tabs Component

## 1. Compound API + RSC boundary

**Decision**: Export `Tabs` namespace (`Root`, `List`, `Tab`, `Viewport`, `Panel`).
Selection/keyboard live in `Root` context. Vite take-home has no RSC runtime;
structure still keeps interactivity inside Root so an RSC host can mark Root as
client without changing consumer JSX.

**Rationale**: Spec FR-001 / FR-010.

**Alternatives**: Monolithic `Tabs` with `items` prop — rejected (breaks composition).

## 2. Activation mode

**Decision**: Automatic activation on focus (Arrow moves focus and selects).

**Rationale**: Spec FR-007; APG recommendation for local panels.

**Alternatives**: Manual Space/Enter — deferred; not default.

## 3. Selection precedence

**Decision**: Controlled `Root.value` > `Root.defaultValue` > first `Tab` with
`selected={true}` (document order) > first tab. Tab `selected` seeds default
only; live selected state always from context (`value === tabValue`). Default
tab remains activatable.

**Rationale**: Clarify session Option B + FR-008.

## 4. Inactive panels

**Decision**: Always mount panels; hide inactive with `hidden` attribute.

**Rationale**: Clarify Option A; APG continuity; preserve panel state.

## 5. Underline indicator

**Decision**: CSS `anchor-name` on selected tab + absolutely positioned indicator
using `position-anchor` / `anchor()` inside List. `@supports` fallback: static
underline via `box-shadow` / `border-block-end` on selected tab when anchors
unsupported.

**Rationale**: Spec FR-004.

## 6. Figma spacing (node 47-2303)

**Decision**: Figma WebGL unavailable in automation. Use token recipe aligned with
Badge density and typical Tabs.Tab frames for this file:

| Surface | Mobile (default) | Desktop (`width > 48em`) |
|---------|------------------|---------------------------|
| List gap (inline) | `--space-2xs` (8px) | `--space-xs` (12px) |
| Tab padding-block | `--space-2xs` | `--space-xs` |
| Tab padding-inline | `--space-xs` | `--space-s` |
| Tab ↔ addon gap | `--space-3xs` | `--space-2xs` |
| Pill radius | `--space-2xs` | `--space-xs` |
| Underline indicator block-size | `2px` | `2px` |

If visual review against Figma diverges, adjust tokens in CSS only (API unchanged).

**Alternatives**: Block implementation pending Figma — rejected (user asked autonomy).

## 7. Bad values

**Decision**: Silent first-match; ignore orphans; no throw.

**Rationale**: Clarify Option A.

## 8. Testing

**Decision**: One primary `test/tabs.test.tsx` with describe blocks per part +
integration (keyboard via user-event). Pixel spacing not asserted.

**Rationale**: Spec US6 / FR-015.
