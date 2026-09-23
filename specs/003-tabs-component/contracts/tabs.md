# Contract: Tabs public API

## Import

```ts
import { Tabs } from "../src/components/tabs";
// or
import { Tabs } from "@/components/tabs";
```

## Composition

```tsx
<Tabs.Root variant="pill" defaultValue="general" aria-label="Settings">
  <Tabs.List>
    <Tabs.Tab value="general" selected>
      General
    </Tabs.Tab>
    <Tabs.Tab value="billing" addon={<Badge variant="positive">New</Badge>}>
      Billing
    </Tabs.Tab>
    <Tabs.Tab value="goals">Goals</Tabs.Tab>
  </Tabs.List>
  <Tabs.Viewport>
    <Tabs.Panel value="general">…</Tabs.Panel>
    <Tabs.Panel value="billing">…</Tabs.Panel>
    <Tabs.Panel value="goals">…</Tabs.Panel>
  </Tabs.Viewport>
</Tabs.Root>
```

Note: `aria-label` for the tablist MAY be passed on `Root` and forwarded to `List`,
or set directly on `List`.

## Props (summary)

| Part | Key props |
|------|-----------|
| Root | `variant?`, `value?`, `defaultValue?`, `onValueChange?`, HTML div props |
| List | HTML div props; role forced `tablist` |
| Tab | `value`, `selected?`, `addon?`, children, HTML button props (role `tab`) |
| Viewport | HTML div props |
| Panel | `value`, children, HTML div props; role `tabpanel` |

## A11y observables

- List: `role="tablist"`
- Tab: `role="tab"`, `aria-selected`, `aria-controls`, `tabIndex` 0/−1 (roving)
- Panel: `role="tabpanel"`, `aria-labelledby`, `hidden` when inactive, `tabIndex={0}` when active

## Keyboard

- Tab: enter/leave list on active tab
- Arrow Left/Right: move focus + select (wrap)
- Home/End: optional; implement Home/End to first/last for completeness
