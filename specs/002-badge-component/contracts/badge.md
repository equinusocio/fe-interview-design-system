# Contract: Badge

## Public API

```ts
export type BadgeVariant = "neutral" | "positive" | "negative";

export type BadgeProps = React.ComponentPropsWithRef<"span"> & {
  /**
   * Visual status treatment.
   * @defaultValue 'neutral'
   */
  variant?: BadgeVariant;
};

export const Badge: React.FC<BadgeProps>;
```

Import path: `src/components/badge` (via `index.ts`).

## DOM contract

- Root element: `span`
- Root class: CSS-module `.Badge` (hashed)
- Attribute: `data-variant` = resolved variant (`"neutral"` | `"positive"` | `"negative"`)
- Children: rendered as-is inside the root

## Visual contract (CSS)

- Colors: see [data-model.md](../data-model.md) variant → tokens table
- Typography: body S — `font-family` / `font-size` / `line-height` from foundation
  (`--font-family-body`, `--font-scale-s`, `--font-lh`) plus `font-weight: 700`
- `white-space: nowrap`
- Responsive padding / radius / max-block-size per data-model recipe
- Breakpoint: `@media (width > 48em)` only

## Storybook contract

- Story file: `src/components/badge/badge.stories.tsx`
- Must show `neutral`, `positive`, `negative` with the same sample label

## Test contract (`test/badge.test.tsx`)

MUST assert:
1. Children text appears in the document
2. Omitted `variant` → `data-variant="neutral"`
3. Explicit `positive` / `negative` / `neutral` → matching `data-variant`

MUST NOT assert:
- Computed padding/radius/max-height pixel values
- Exact hex colors
