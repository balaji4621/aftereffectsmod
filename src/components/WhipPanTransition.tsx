import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface WhipPanTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  durationFrames?: number;
}

export const WhipPanTransition: React.FC<WhipPanTransitionProps> = ({
  children,
  direction = 'right',
  durationFrames = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  let translateX = 0;
  let translateY = 0;

  if (direction === 'right') {
    translateX = interpolate(progress, [0, 1], [-100, 0]);
  } else if (direction === 'left') {
    translateX = interpolate(progress, [0, 1], [100, 0]);
  } else if (direction === 'down') {
    translateY = interpolate(progress, [0, 1], [-100, 0]);
  } else if (direction === 'up') {
    translateY = interpolate(progress, [0, 1], [100, 0]);
  }

  const blurAmount = interpolate(progress, [0, 0.5, 1], [0, 16, 0]);

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${translateX}%, ${translateY}%)`,
        filter: `blur(${blurAmount}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
