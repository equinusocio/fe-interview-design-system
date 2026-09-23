import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const tokensCss = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../src/index.css"),
  "utf8",
);

const REQUIRED_TOKENS = [
  "--space-0",
  "--space-4xs",
  "--space-3xs",
  "--space-2xs",
  "--space-xs",
  "--space-s",
  "--space-m",
  "--space-l",
  "--space-xl",
  "--space-2xl",
  "--global-foreground",
  "--global-background",
  "--global-primary",
  "--global-contrast",
  "--highlight-green",
  "--highlight-red",
  "--font-scale-m",
  "--font-scale-s",
  "--font-lh",
  "--font-family-body",
] as const;

/** Extract property names declared inside the first `:root { … }` block. */
function rootCustomProperties(css: string): Set<string> {
  const match = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!match) {
    return new Set();
  }

  const names = new Set<string>();
  for (const propMatch of match[1].matchAll(/(--[\w-]+)\s*:/g)) {
    names.add(propMatch[1]);
  }
  return names;
}

describe("foundation design tokens", () => {
  const rootTokens = rootCustomProperties(tokensCss);

  it("defines a :root block in src/index.css", () => {
    expect(rootTokens.size).toBeGreaterThan(0);
  });

  it.each(REQUIRED_TOKENS)("exposes %s on :root", (token) => {
    expect(rootTokens.has(token), `expected ${token} to be present on :root`).toBe(true);
  });
});
