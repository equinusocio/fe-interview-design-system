import type React from "react";

import styles from "./tabs.module.css";

export type TabsAutoAdvanceChromeProps = {
  /**
   * Milliseconds left in the current wait.
   */
  remainingMs: number;
  /**
   * Resolved wait duration in milliseconds.
   */
  intervalMs: number;
  /**
   * Whether the timer is currently stepping.
   */
  playback: "running" | "paused";
  onPause: () => void;
  onPlay: () => void;
};

const PauseIcon: React.FC = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
    <rect x="3" y="2" width="4" height="12" rx="0.5" fill="currentColor" />
    <rect x="9" y="2" width="4" height="12" rx="0.5" fill="currentColor" />
  </svg>
);

const PlayIcon: React.FC = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
    <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
  </svg>
);

export const TabsAutoAdvanceChrome: React.FC<TabsAutoAdvanceChromeProps> = ({
  remainingMs,
  intervalMs,
  playback,
  onPause,
  onPlay,
}) => {
  const isRunning = "running" === playback;
  const ratio = 0 === intervalMs ? 0 : remainingMs / intervalMs;
  const dynamicStyle = {
    "--tabs-auto-advance-ratio": String(ratio),
  } as React.CSSProperties;

  const handlePlaybackClick = () => {
    if (isRunning) {
      onPause();
      return;
    }

    onPlay();
  };

  return (
    <div className={styles.AutoAdvance}>
      <progress
        className={styles.Progress}
        style={dynamicStyle}
        max={intervalMs}
        value={remainingMs}
        aria-label="Time remaining until next tab"
      />
      <button
        type="button"
        className={styles.Playback}
        aria-label={isRunning ? "Pause auto-advance" : "Play auto-advance"}
        onClick={handlePlaybackClick}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
};
