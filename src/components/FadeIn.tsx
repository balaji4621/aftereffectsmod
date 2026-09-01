import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface FadeInProps {
  durationInFrames?: number;
  delayInFrames?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  durationInFrames = 30,
  delayInFrames = 0,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - delayInFrames;

  const opacity = interpolate(
    adjustedFrame,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ ...style, opacity }}>
      {children}
    </AbsoluteFill>
  );
};
