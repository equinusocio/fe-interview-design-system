import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../src/components/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it('defaults data-variant to "neutral"', () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText("Label")).toHaveAttribute("data-variant", "neutral");
  });

  it.each(["neutral", "positive", "negative"] as const)(
    'sets data-variant="%s" when variant is explicit',
    (variant) => {
      render(<Badge variant={variant}>Label</Badge>);
      expect(screen.getByText("Label")).toHaveAttribute("data-variant", variant);
    },
  );

  it("distinguishes positive and negative from neutral", () => {
    const { rerender } = render(<Badge variant="neutral">Label</Badge>);
    const el = screen.getByText("Label");
    expect(el).toHaveAttribute("data-variant", "neutral");

    rerender(<Badge variant="positive">Label</Badge>);
    expect(el).toHaveAttribute("data-variant", "positive");

    rerender(<Badge variant="negative">Label</Badge>);
    expect(el).toHaveAttribute("data-variant", "negative");
  });
});
