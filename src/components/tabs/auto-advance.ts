export const DEFAULT_AUTO_ADVANCE_INTERVAL_MS = 2000;

export type AutoAdvanceTabRegistration = {
  readonly value: string;
  readonly selected?: boolean;
  readonly disabled?: boolean;
};

export const resolveAutoAdvanceInterval = (interval: number | undefined): number => {
  if ("number" !== typeof interval || !Number.isFinite(interval) || interval <= 0) {
    return DEFAULT_AUTO_ADVANCE_INTERVAL_MS;
  }

  return interval;
};

export const nextEnabledTabValue = (
  registrations: readonly AutoAdvanceTabRegistration[],
  current: string,
): string | undefined => {
  const enabled = registrations.filter((registration) => !registration.disabled);

  if (0 === enabled.length) {
    return undefined;
  }

  const index = enabled.findIndex((registration) => registration.value === current);

  if (index < 0) {
    return enabled[0]?.value;
  }

  const nextIndex = (index + 1) % enabled.length;

  return enabled[nextIndex]?.value;
};
