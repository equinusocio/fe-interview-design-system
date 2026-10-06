# Data model: Tabs Auto-Advance

## Entities

### Auto-advance session (Root-owned)

| Field | Type | Rules |
|-------|------|--------|
| `autoAdvance` | boolean | Opt-in. Default `false`. |
| `autoAdvanceInterval` | number (ms) | Valid if finite and `> 0`. Else `2000`. |
| `variant` | `'pill' \| 'underline'` | Chrome + timer only if `underline`. |
| `prefersReducedMotion` | boolean | Live from `matchMedia`. |
| `chromeActive` | derived | `autoAdvance && underline && !prefersReducedMotion` |
| `playback` | `'running' \| 'paused'` | Meaningful only when `chromeActive`. Starts `'running'` when chrome becomes active. |
| `remainingMs` | number | `0…resolvedInterval`. Restarts to full interval on play, on auto-step, and on user tab activation while running. Frozen while paused. |

### Tab registration (extended)

| Field | Type | Rules |
|-------|------|--------|
| `value` | string | Unique in document-order first-match (existing). |
| `selected` | boolean? | Existing seed. |
| `disabled` | boolean? | Auto-step skips these. |

## State transitions

```text
chromeInactive  --(chromeActive true)-->  running
running         --(pause)-->              paused
paused          --(play)-->               running (remaining = full interval)
running|paused  --(chromeActive false)--> chromeInactive (timer cleared)
running         --(timeout)-->            running (next enabled tab, remaining reset)
running         --(user select)-->        running (remaining reset)
paused          --(user select)-->        paused
```

`chromeActive false` includes: `autoAdvance` false, pill, reduced motion (including live `change`).
