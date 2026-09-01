import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export interface AnimatedCounterProps {
  from?: number;
  to: number;
  durationInFrames?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  durationInFrames,
  prefix = '',
  suffix = '',
  decimals = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: maxDuration } = useVideoConfig();
  const duration = durationInFrames ?? maxDuration;

  const progress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 200 },
  });

  const value = interpolate(progress, [0, 1], [from, to]);

  return (
    <span style={style}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
