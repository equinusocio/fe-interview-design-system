# Research: Tabs Auto-Advance

## 1. Public API shape

**Decision**: `autoAdvance?: boolean` (default `false`) on `Tabs.Root`. Separate `autoAdvanceInterval?: number` in **milliseconds**, default `2000`. Interval alone does not enable auto-advance.

**Rationale**: Spec split enablement vs wait. Boolean matches “prop present / true”. Milliseconds chosen in clarify (default 2000).

**Alternatives considered**: Single numeric prop (0 = off) — conflates enablement and duration. Seconds — rejected in clarify.

## 2. Reduced motion

**Decision**: `window.matchMedia("(prefers-reduced-motion: reduce)")` with `addEventListener("change", …)`. When `matches`, `chromeActive` is false: no timeout, no chrome. Toggle live. `autoAdvance={true}` does not override.

**Rationale**: Spec FR-013 + clarify (hide chrome, live). WCAG 2.3.3 / user OS setting.

**Alternatives considered**: Start paused but allow play — rejected. Snapshot on mount — rejected.

## 3. Timer vs CSS animation as source of truth

**Decision**: `setTimeout` drives tab change. Remaining-time UI is a native `<progress>` whose `max` is the resolved interval and `value` is remaining ms; CSS may animate a visual fill via `--tabs-auto-advance-remaining` (0–1) without driving selection.

**Rationale**: Tests with fake timers; AT must not hear every frame (`aria-live` omitted). Pause/play restarts full wait (spec assumption).

**Alternatives considered**: CSS animation `animationend` as stepper — harder to fake in jsdom and to pause/restart cleanly.

## 4. Next tab selection

**Decision**: Walk Root registry in registration order; skip `disabled`; wrap. Empty enabled list → no step. User `setValue` while running restarts the wait; while paused, stay paused.

**Rationale**: Spec FR-003, FR-010, FR-011. Registry already exists; extend with `disabled`.

**Alternatives considered**: DOM query of `[role=tab]:not([disabled])` — extra coupling to List markup.

## 5. Chrome placement and a11y

**Decision**: Render chrome as first child of `.Root` (before consumer children) so it sits above the list: progress start (inline-start), play/pause end. Native `<button type="button">` with accessible name Play/Pause auto-advance. Native `<progress>` with `aria-label` for remaining time. No `role="toolbar"` unless grouping needs a name; a labelled group (`div` + `aria-label`) is enough.

**Rationale**: No ARIA is better than Bad ARIA. Tabs APG stays on List/Tab/Panel.

**Alternatives considered**: `role="timer"` live updates — floods AT.
