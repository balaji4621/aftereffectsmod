import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export interface RotateInProps {
  from?: number;
  to?: number;
  delayInFrames?: number;
  children: React.ReactNode;
}

export const RotateIn: React.FC<RotateInProps> = ({
  from = -90,
  to = 0,
  delayInFrames = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delayInFrames);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const rotation = interpolate(progress, [0, 1], [from, to]);

  return (
    <AbsoluteFill style={{ transform: otate(deg) }}>
      {children}
    </AbsoluteFill>
  );
};
