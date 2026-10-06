import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "../src/components/tabs";
import {
  nextEnabledTabValue,
  resolveAutoAdvanceInterval,
} from "../src/components/tabs/auto-advance";

const renderAutoAdvance = (
  props: {
    variant?: "pill" | "underline";
    autoAdvance?: boolean;
    autoAdvanceInterval?: number;
    disableBilling?: boolean;
  } = {},
) => {
  const { variant = "underline", autoAdvance = true, autoAdvanceInterval, disableBilling } = props;

  return render(
    <Tabs.Root
      variant={variant}
      defaultValue="general"
      autoAdvance={autoAdvance}
      autoAdvanceInterval={autoAdvanceInterval}
      aria-label="Settings"
    >
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="billing" disabled={disableBilling}>
          Billing
        </Tabs.Tab>
        <Tabs.Tab value="goals">Goals</Tabs.Tab>
      </Tabs.List>
      <Tabs.Viewport>
        <Tabs.Panel value="general">General panel</Tabs.Panel>
        <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
        <Tabs.Panel value="goals">Goals panel</Tabs.Panel>
      </Tabs.Viewport>
    </Tabs.Root>,
  );
};

const installMatchMedia = (initialReduced: boolean) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  let matches = initialReduced;

  const reducedList = {
    get matches() {
      return matches;
    },
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: (_type: string, listener: EventListener) => {
      listeners.add(listener as (event: MediaQueryListEvent) => void);
    },
    removeEventListener: (_type: string, listener: EventListener) => {
      listeners.delete(listener as (event: MediaQueryListEvent) => void);
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  };

  window.matchMedia = ((query: string) => {
    if (query.includes("prefers-reduced-motion")) {
      return reducedList as MediaQueryList;
    }

    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true,
    } as MediaQueryList;
  }) as typeof window.matchMedia;

  return {
    setReduced: (next: boolean) => {
      matches = next;
      const event = { matches: next } as MediaQueryListEvent;
      for (const listener of listeners) {
        listener(event);
      }
    },
  };
};

describe("auto-advance helpers", () => {
  it("falls back to 2000 for invalid intervals", () => {
    expect(resolveAutoAdvanceInterval(undefined)).toBe(2000);
    expect(resolveAutoAdvanceInterval(0)).toBe(2000);
    expect(resolveAutoAdvanceInterval(-1)).toBe(2000);
    expect(resolveAutoAdvanceInterval(Number.NaN)).toBe(2000);
    expect(resolveAutoAdvanceInterval(4000)).toBe(4000);
  });

  it("skips disabled tabs and wraps", () => {
    const regs = [{ value: "general" }, { value: "billing", disabled: true }, { value: "goals" }];
    expect(nextEnabledTabValue(regs, "general")).toBe("goals");
    expect(nextEnabledTabValue(regs, "goals")).toBe("general");
  });
});

describe("Tabs auto-advance", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    installMatchMedia(false);
    vi.useFakeTimers({
      toFake: ["setTimeout", "setInterval", "clearTimeout", "clearInterval", "Date"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = originalMatchMedia;
  });

  it("advances to the next underline tab after 2000ms and wraps", async () => {
    renderAutoAdvance();

    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /goals/i })).toHaveAttribute("aria-selected", "true");

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");
  });

  it("uses a custom interval", async () => {
    renderAutoAdvance({ autoAdvanceInterval: 4000 });

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");
  });

  it("ignores autoAdvance on pill and hides chrome", async () => {
    renderAutoAdvance({ variant: "pill" });

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /auto-advance/i })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(4000);
    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");
  });

  it("hides chrome when autoAdvance is off", () => {
    renderAutoAdvance({ autoAdvance: false });
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /auto-advance/i })).not.toBeInTheDocument();
  });

  it("falls back to 2000ms when interval is invalid", async () => {
    renderAutoAdvance({ autoAdvanceInterval: 0 });

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled tabs", async () => {
    renderAutoAdvance({ disableBilling: true });

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /goals/i })).toHaveAttribute("aria-selected", "true");
  });

  it("does not auto-advance or show chrome when reduced motion is preferred", async () => {
    installMatchMedia(true);
    renderAutoAdvance();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /auto-advance/i })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(4000);
    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");
  });

  it("pauses and resumes with a single control", async () => {
    renderAutoAdvance();

    fireEvent.click(screen.getByRole("button", { name: "Pause auto-advance" }));

    expect(screen.getByRole("button", { name: "Play auto-advance" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Pause auto-advance" })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(4000);
    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("button", { name: "Play auto-advance" }));
    expect(screen.getByRole("button", { name: "Pause auto-advance" })).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");
  });

  it("exposes remaining-time progress that pauses with playback", async () => {
    renderAutoAdvance();

    const progress = screen.getByRole("progressbar", { name: /time remaining/i });
    expect(progress).toHaveAttribute("max", "2000");

    await vi.advanceTimersByTimeAsync(500);
    const mid = Number(progress.getAttribute("value"));
    expect(mid).toBeLessThan(2000);

    fireEvent.click(screen.getByRole("button", { name: "Pause auto-advance" }));
    const frozen = Number(progress.getAttribute("value"));
    await vi.advanceTimersByTimeAsync(1000);
    expect(Number(progress.getAttribute("value"))).toBe(frozen);
  });

  it("reacts live when reduced motion is turned on and off", async () => {
    const media = installMatchMedia(false);
    renderAutoAdvance();

    expect(screen.getByRole("button", { name: "Pause auto-advance" })).toBeInTheDocument();

    act(() => {
      media.setReduced(true);
    });
    expect(screen.queryByRole("button", { name: /auto-advance/i })).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(4000);
    expect(screen.getByRole("tab", { name: /general/i })).toHaveAttribute("aria-selected", "true");

    act(() => {
      media.setReduced(false);
    });
    expect(screen.getByRole("button", { name: "Pause auto-advance" })).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole("tab", { name: /billing/i })).toHaveAttribute("aria-selected", "true");
  });
});
