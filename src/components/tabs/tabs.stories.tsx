import type { Meta, StoryObj } from "@storybook/react-vite";

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

const DemoPanels = () => (
  <Tabs.Viewport>
    <Tabs.Panel value="general">General settings content.</Tabs.Panel>
    <Tabs.Panel value="billing">Billing settings content.</Tabs.Panel>
    <Tabs.Panel value="goals">Goals content.</Tabs.Panel>
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
        <Tabs.Panel value="neutral">Neutral badge addon</Tabs.Panel>
        <Tabs.Panel value="positive">Positive badge addon</Tabs.Panel>
        <Tabs.Panel value="negative">Negative badge addon</Tabs.Panel>
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
        <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
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
              <Tabs.Panel value="profile">Profile settings.</Tabs.Panel>
              <Tabs.Panel value="billing">Billing settings.</Tabs.Panel>
              <Tabs.Panel value="team">Team settings.</Tabs.Panel>
            </Tabs.Viewport>
          </Tabs.Root>
        </Tabs.Panel>
      </Tabs.Viewport>
    </Tabs.Root>
  ),
};
