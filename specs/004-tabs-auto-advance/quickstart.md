# Quickstart: Tabs auto-advance

## Prerequisites

- `pnpm install`
- No reduced motion in the OS (or Storybook toolbar) when checking the happy path

## Run

```sh
pnpm test -- test/tabs-auto-advance.test.tsx
pnpm tsc
pnpm check
pnpm storybook
```

Open **Components / Tabs / Auto Advance Underline**.

## Expected

1. Remaining-time bar top-left above the tab list; pause control top-right.
2. Selection advances every 2s (or the story’s interval) and wraps.
3. Pause: selection frozen; control becomes Play. Play: stepping restarts a full wait.
4. Enable OS reduced motion: chrome disappears; tabs stop auto-advancing. Disable: chrome and stepping return.
5. Pill stories unchanged; no extra chrome.

## Contract

See [contracts/tabs-auto-advance.md](./contracts/tabs-auto-advance.md).
