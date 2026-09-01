import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export interface ScaleInProps {
  from?: number;
  to?: number;
  delayInFrames?: number;
  children: React.ReactNode;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  from = 0,
  to = 1,
  delayInFrames = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delayInFrames);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const scale = interpolate(progress, [0, 1], [from, to]);

  return (
    <AbsoluteFill style={{ transform: scale() }}>
      {children}
    </AbsoluteFill>
  );
};
