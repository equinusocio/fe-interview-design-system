import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: {
    variant: "neutral",
  },
};

export const Positive: Story = {
  args: {
    variant: "positive",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Badge variant="neutral">Badge</Badge>
      <Badge variant="positive">Badge</Badge>
      <Badge variant="negative">Badge</Badge>
    </div>
  ),
};
