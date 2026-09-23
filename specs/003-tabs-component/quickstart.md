# Quickstart: Tabs Component

## Prerequisites

- `pnpm install`
- Foundation tokens + Badge already in repo

## Validate

```bash
pnpm test
pnpm tsc
pnpm check
pnpm storybook
```

## Manual Storybook checks

1. Open **Components/Tabs** — Pill / Underline / WithAddon stories
2. Keyboard: Tab into list, arrows switch panels, Tab into panel
3. Resize across 48em — List/Tab spacing changes
4. Underline: indicator tracks selected tab (anchor) or static fallback

## Expected

- Exactly one visible panel
- Badge addon after label when provided
- All `pnpm test` Tabs describes green
