## Summary

This PR lays the design-system foundation tokens needed by later components, then ships **Badge** and the take-home **Tabs** compound component—with Storybook stories, Vitest coverage, and Speckit specs under `specs/002-*` / `specs/003-*`.

## Foundation

Tokens live on `:root` in `src/index.css` and drive shared chrome:

- **Semantic colors**: `--global-foreground`, `--global-background`, `--global-primary`, `--global-muted` (borders / resting chrome), `--global-contrast` (light surface for hover fills).
- **Spacing & type**: `--space-*`, `--font-scale-*`, `--font-family-body` (Inter).
- **Focus**: `*:focus-visible` uses a `2px` primary outline with offset so keyboard focus stays visible.

Storybook preview loads the same token sheet so stories match the app.

## Badge

Small presentational label for status / counts (often composed into Tabs via `addon`).

- API: `children` + `variant`: `neutral` | `positive` | `negative` (default `neutral`).
- Renders a `span` with `data-variant`; styles are token-backed (padding, radius, highlight fills).
- Responsive density (tighter on mobile, roomier above `48em`).
- No interaction logic—pure UI atom.

## Tabs

Composable tabs widget aligned with [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

```tsx
<Tabs.Root variant="pill" defaultValue="general" aria-label="Settings">
  <Tabs.List>
    <Tabs.Tab value="general">General</Tabs.Tab>
    <Tabs.Tab value="billing" addon={<Badge variant="positive">New</Badge>}>
      Billing
    </Tabs.Tab>
  </Tabs.List>
  <Tabs.Viewport>
    <Tabs.Panel value="general">…</Tabs.Panel>
    <Tabs.Panel value="billing">…</Tabs.Panel>
  </Tabs.Viewport>
</Tabs.Root>
```

### How it works

| Part | Role |
|------|------|
| **Root** | Context + selection state. `variant` (`pill` \| `underline`), controlled `value` / uncontrolled `defaultValue`, `onValueChange`. Forwards list naming via `aria-label` / `aria-labelledby`. |
| **List** | `role="tablist"`. Hosts tabs; underline variant mounts the moving indicator. |
| **Tab** | `role="tab"`. Required `value`; optional `selected` (seeds uncontrolled default, stays selectable); optional `addon` after the label. Roving `tabIndex` + arrow / Home / End with **automatic** activation. |
| **Viewport** | Layout wrapper for panels. |
| **Panel** | `role="tabpanel"`. Stays **mounted**; inactive panels use `hidden`. Focusable when active if no focusable child. |

**Selection precedence (uncontrolled):** `defaultValue` → first `Tab` with `selected` → first tab. Controlled `value` always wins.

**Visuals:** `pill` (bordered capsule, primary fill when selected) vs `underline` (label + indicator under the active tab via CSS **anchor positioning**, with a static fallback). Resting label color is primary; list gaps and pill padding follow Figma mobile/desktop tokens.

**RSC-friendly shape:** same JSX tree; interactive state lives in Root context so a host can put the client boundary on Root without flattening the API.

## Test plan

- [x] `pnpm test` — Badge + Tabs (all five parts + keyboard/selection)
- [x] `pnpm check` / typecheck clean
- [x] Storybook: Badge variants; Tabs pill / underline / addon
- [x] Keyboard: Tab into list → arrows select → Tab into panel
- [x] Underline indicator tracks selected tab in supporting browsers
