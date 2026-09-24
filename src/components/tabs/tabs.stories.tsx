import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";

import { Badge } from "../badge";
import { Tabs } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs.Root,
  parameters: {
    docs: {
      description: {
        component:
          "Compound Tabs (Root / List / Tab / Viewport / Panel). Interactive state lives in Root so RSC hosts can place a client boundary on Root without changing composition.",
      },
    },
  },
} satisfies Meta<typeof Tabs.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const placeholderSurface: React.CSSProperties = {
  backgroundColor: "var(--global-muted)",
  borderRadius: "var(--space-2xs)",
};

type PlaceholderGridProps = {
  /**
   * Number of placeholder tiles.
   * @defaultValue 6
   */
  count?: number;
};

const PlaceholderGrid: React.FC<PlaceholderGridProps> = ({ count = 6 }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(7.5rem, 1fr))",
      gap: "var(--space-s)",
    }}
    aria-hidden="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <div key={index} style={{ ...placeholderSurface, minBlockSize: "4.5rem" }} />
    ))}
  </div>
);

type PlaceholderListProps = {
  /**
   * Number of placeholder rows.
   * @defaultValue 5
   */
  count?: number;
};

const PlaceholderList: React.FC<PlaceholderListProps> = ({ count = 5 }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2xs)",
    }}
    aria-hidden="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <div key={index} style={{ ...placeholderSurface, minBlockSize: "2.5rem" }} />
    ))}
  </div>
);

const DemoPanels = () => (
  <Tabs.Viewport>
    <Tabs.Panel value="general">
      <PlaceholderGrid count={6} />
    </Tabs.Panel>
    <Tabs.Panel value="billing">
      <PlaceholderList count={5} />
    </Tabs.Panel>
    <Tabs.Panel value="goals">
      <PlaceholderGrid count={4} />
    </Tabs.Panel>
  </Tabs.Viewport>
);

export const Pill: Story = {
  render: () => (
    <Tabs.Root variant="pill" defaultValue="general" aria-label="Settings">
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Tab value="goals">Goals</Tabs.Tab>
      </Tabs.List>
      <DemoPanels />
    </Tabs.Root>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs.Root variant="underline" defaultValue="general">
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Tab value="goals">Goals</Tabs.Tab>
      </Tabs.List>
      <DemoPanels />
    </Tabs.Root>
  ),
};

export const WithAddon: Story = {
  render: () => (
    <Tabs.Root variant="pill" defaultValue="general">
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing" addon={<Badge variant="positive">New</Badge>}>
          Billing
        </Tabs.Tab>
        <Tabs.Tab value="goals" addon={<Badge variant="negative">3</Badge>}>
          Goals
        </Tabs.Tab>
      </Tabs.List>
      <DemoPanels />
    </Tabs.Root>
  ),
};

export const DefaultSelectedProp: Story = {
  render: () => (
    <Tabs.Root variant="underline">
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing" selected>
          Billing
        </Tabs.Tab>
        <Tabs.Tab value="goals">Goals</Tabs.Tab>
      </Tabs.List>
      <DemoPanels />
    </Tabs.Root>
  ),
};

export const BadgeVariantsAsAddon: Story = {
  render: () => (
    <Tabs.Root variant="pill" defaultValue="neutral">
      <Tabs.List aria-label="Badge variants">
        <Tabs.Tab value="neutral" addon={<Badge variant="neutral">N</Badge>}>
          Neutral
        </Tabs.Tab>
        <Tabs.Tab value="positive" addon={<Badge variant="positive">P</Badge>}>
          Positive
        </Tabs.Tab>
        <Tabs.Tab value="negative" addon={<Badge variant="negative">N</Badge>}>
          Negative
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Viewport>
        <Tabs.Panel value="neutral">
          <PlaceholderGrid count={3} />
        </Tabs.Panel>
        <Tabs.Panel value="positive">
          <PlaceholderList count={3} />
        </Tabs.Panel>
        <Tabs.Panel value="negative">
          <PlaceholderGrid count={4} />
        </Tabs.Panel>
      </Tabs.Viewport>
    </Tabs.Root>
  ),
};

export const Nested: Story = {
  render: () => (
    <Tabs.Root variant="pill" aria-label="Workspace">
      <Tabs.List aria-label="Workspace">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Viewport>
        <Tabs.Panel value="overview">
          <PlaceholderGrid count={6} />
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <Tabs.Root variant="underline" aria-label="Settings sections">
            <Tabs.List aria-label="Settings sections">
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="billing" selected>
                Billing
              </Tabs.Tab>
              <Tabs.Tab value="team">Team</Tabs.Tab>
            </Tabs.List>
            <Tabs.Viewport>
              <Tabs.Panel value="profile">
                <PlaceholderList count={4} />
              </Tabs.Panel>
              <Tabs.Panel value="billing">
                <PlaceholderGrid count={3} />
              </Tabs.Panel>
              <Tabs.Panel value="team">
                <PlaceholderList count={6} />
              </Tabs.Panel>
            </Tabs.Viewport>
          </Tabs.Root>
        </Tabs.Panel>
      </Tabs.Viewport>
    </Tabs.Root>
  ),
};

const overflowTabs = [
  "Overview",
  "Analytics",
  "Audience",
  "Campaigns",
  "Billing",
  "Integrations",
  "Notifications",
  "Security",
  "Team",
  "Preferences",
] as const;

export const HorizontalOverflow: Story = {
  args: {
    variant: "pill",
    defaultValue: "overview",
  },
  render: ({ ...args }) => (
    <Tabs.Root
      {...args}
      aria-label="Workspace sections"
      aria-labelledby="workspace-sections-list"
    >
      <Tabs.List aria-label="Workspace sections">
        {overflowTabs.map((label) => (
          <Tabs.Tab key={label} value={label.toLowerCase()}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Viewport>
        {overflowTabs.map((label, index) => (
          <Tabs.Panel key={label} value={label.toLowerCase()}>
            {index % 2 === 0 ? <PlaceholderGrid count={6} /> : <PlaceholderList count={5} />}
          </Tabs.Panel>
        ))}
      </Tabs.Viewport>
    </Tabs.Root>
  ),
};

export const ScrollableContent: Story = {
  render: () => (
    <Tabs.Root
      variant="pill"
      defaultValue="general"
      aria-label="Settings"
      style={{ maxBlockSize: "18rem" }}
    >
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Tab value="goals">Goals</Tabs.Tab>
      </Tabs.List>
      <Tabs.Viewport style={{ overflow: "auto", minBlockSize: 0, flex: "1 1 auto" }}>
        <Tabs.Panel value="general">
          <PlaceholderList count={16} />
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <PlaceholderGrid count={12} />
        </Tabs.Panel>
        <Tabs.Panel value="goals">
          <PlaceholderList count={20} />
        </Tabs.Panel>
      </Tabs.Viewport>
    </Tabs.Root>
  ),
};
