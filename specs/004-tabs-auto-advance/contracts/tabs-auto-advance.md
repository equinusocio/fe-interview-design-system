# Contract: Tabs auto-advance

Extends [003 Tabs public API](../../003-tabs-component/contracts/tabs.md).

## Root props (additive)

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `autoAdvance` | `boolean` | `false` | Enables session when `variant="underline"` and reduced motion is not preferred. |
| `autoAdvanceInterval` | `number` | `2000` | Milliseconds. Invalid (NaN, ≤0, non-finite) → `2000`. Does not enable auto-advance by itself. |

## Chrome (when `chromeActive`)

- First visual row inside Root, above `Tabs.List`.
- Remaining-time: `<progress>` (or equivalent native progress), top/inline-start. `max` = resolved interval, `value` = remaining ms. Accessible name describing remaining time. No live region ticking every frame.
- Control: one `<button type="button">` top/inline-end. Name **Pause auto-advance** while running, **Play auto-advance** while paused. Exactly one visible.

When `chromeActive` is false: no progress, no play/pause, no timer.

## Observables (tests)

- Underline + `autoAdvance` + default interval + no reduced motion: after `2000` ms fake time, selection moves to next tab; after last, first.
- Custom interval `4000`: no change at `2000`; change at `4000`.
- `autoAdvance` on pill: no chrome, no auto change after two default waits.
- `autoAdvance` omitted: no chrome.
- Reduced motion `matches: true`: no chrome, no auto change even with `autoAdvance`.
- `matchMedia` `change` to reduce: chrome gone, timer stopped; `change` back: chrome + running.
- Pause: no change after two intervals; Play: resumes; only one of the two names in the document at a time.
- Disabled tab skipped.
- Invalid interval falls back to 2000.
- Existing tablist keyboard still works.

## Catalog

Story `AutoAdvanceUnderline`: `variant="underline"`, `autoAdvance`, optional non-default interval, looping panels, chrome visible (when motion not reduced).
