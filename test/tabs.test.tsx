import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "../src/components/badge";
import { Tabs } from "../src/components/tabs";

const renderTabs = (
  props: {
    variant?: "pill" | "underline";
    defaultValue?: string;
    value?: string;
    onValueChange?: (v: string) => void;
    selectedBilling?: boolean;
    withAddon?: boolean;
  } = {},
) => {
  const {
    variant = "pill",
    defaultValue,
    value,
    onValueChange,
    selectedBilling,
    withAddon,
  } = props;

  return render(
    <Tabs.Root
      variant={variant}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab
          value="billing"
          selected={selectedBilling}
          addon={withAddon ? <Badge variant="positive">New</Badge> : undefined}
        >
          Billing
        </Tabs.Tab>
        <Tabs.Tab value="goals">Goals</Tabs.Tab>
      </Tabs.List>
      <Tabs.Viewport data-testid="viewport">
        <Tabs.Panel value="general">General panel</Tabs.Panel>
        <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
        <Tabs.Panel value="goals">Goals panel</Tabs.Panel>
      </Tabs.Viewport>
    </Tabs.Root>,
  );
};

describe("Tabs.Root", () => {
  it("selects defaultValue panel on init", async () => {
    renderTabs({ defaultValue: "billing" });
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
    expect(screen.getByText("Billing panel")).toBeVisible();
    expect(screen.getByText("General panel")).not.toBeVisible();
  });

  it("supports controlled value and onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs.Root variant="pill" value="general" onValueChange={onValueChange}>
        <Tabs.List aria-label="Settings">
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Viewport>
          <Tabs.Panel value="general">General panel</Tabs.Panel>
          <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
        </Tabs.Viewport>
      </Tabs.Root>,
    );

    await user.click(screen.getByRole("tab", { name: /billing/i }));
    expect(onValueChange).toHaveBeenCalledWith("billing");

    rerender(
      <Tabs.Root variant="pill" value="billing" onValueChange={onValueChange}>
        <Tabs.List aria-label="Settings">
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Viewport>
          <Tabs.Panel value="general">General panel</Tabs.Panel>
          <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
        </Tabs.Viewport>
      </Tabs.Root>,
    );

    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");
  });

  it("uses Tab selected prop as uncontrolled default", async () => {
    renderTabs({ selectedBilling: true });
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
    expect(screen.getByText("Billing panel")).toBeVisible();
  });

  it("keeps default-selected tab selectable after switch", async () => {
    const user = userEvent.setup();
    renderTabs({ selectedBilling: true });
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
    await user.click(screen.getByRole("tab", { name: /goals/i }));
    expect(screen.getByText("Goals panel")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: /billing/i }));
    expect(screen.getByText("Billing panel")).toBeVisible();
  });
  it("falls back to the first tab when no defaultValue or selected", async () => {
    renderTabs({});
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
    expect(screen.getByText("General panel")).toBeVisible();
  });
});

describe("Tabs.List", () => {
  it("exposes tablist with accessible name", () => {
    renderTabs({ defaultValue: "general" });
    expect(screen.getByRole("tablist", { name: "Settings" })).toBeInTheDocument();
  });
});

describe("Tabs.Tab", () => {
  it("reflects Root variant and selected state", async () => {
    renderTabs({ variant: "underline", defaultValue: "general" });
    const general = screen.getByRole("tab", { name: /general/i });
    expect(general).toHaveAttribute("data-variant", "underline");
    expect(general).toHaveAttribute("data-selected", "true");
    expect(general).toHaveAttribute("aria-selected", "true");
  });

  it("renders addon after the label", () => {
    renderTabs({ defaultValue: "general", withAddon: true });
    const billing = screen.getByRole("tab", { name: /billing/i });
    expect(within(billing).getByText("New")).toBeInTheDocument();
    expect(within(billing).getByText("New")).toHaveAttribute("data-variant", "positive");
  });
});

describe("Tabs.Viewport", () => {
  it("hosts panels without breaking association", async () => {
    renderTabs({ defaultValue: "goals" });
    const viewport = screen.getByTestId("viewport");
    expect(within(viewport).getByText("Goals panel")).toBeVisible();
    expect(within(viewport).getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      screen.getByRole("tab", { name: /goals/i }).id,
    );
  });
});

describe("Tabs.Panel", () => {
  it("keeps inactive panels mounted and hidden", async () => {
    renderTabs({ defaultValue: "general" });
    const general = screen.getByText("General panel");
    const billing = screen.getByText("Billing panel");
    expect(general).toBeVisible();
    expect(billing).not.toBeVisible();
    expect(billing.closest("[role='tabpanel']")).toHaveAttribute("hidden");
  });
});

describe("Tabs integration", () => {
  it("switches panels on pointer activation", async () => {
    const user = userEvent.setup();
    renderTabs({ defaultValue: "general" });
    await user.click(screen.getByRole("tab", { name: /goals/i }));
    expect(screen.getByText("Goals panel")).toBeVisible();
    expect(screen.getByText("General panel")).not.toBeVisible();
  });

  it("moves focus and selection with arrow keys (automatic activation)", async () => {
    const user = userEvent.setup();
    renderTabs({ defaultValue: "general" });
    const general = screen.getByRole("tab", { name: /general/i });
    general.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveFocus();
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Billing panel")).toBeVisible();
  });

  it("wires aria-controls between tab and panel", async () => {
    renderTabs({ defaultValue: "general" });
    const tab = screen.getByRole("tab", { name: /general/i });
    const panel = screen.getByText("General panel").closest("[role='tabpanel']");
    expect(tab).toHaveAttribute("aria-controls", panel?.id);
  });

  it("ignores orphan panel values without throwing", () => {
    expect(() =>
      render(
        <Tabs.Root defaultValue="general">
          <Tabs.List aria-label="Settings">
            <Tabs.Tab value="general">General</Tabs.Tab>
          </Tabs.List>
          <Tabs.Viewport>
            <Tabs.Panel value="general">General panel</Tabs.Panel>
            <Tabs.Panel value="orphan">Orphan</Tabs.Panel>
          </Tabs.Viewport>
        </Tabs.Root>,
      ),
    ).not.toThrow();
    expect(screen.getByText("General panel")).toBeVisible();
  });
});
