import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export interface SlideInProps {
  from?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
  delayInFrames?: number;
  children: React.ReactNode;
}

export const SlideIn: React.FC<SlideInProps> = ({
  from = 'bottom',
  distance = 100,
  delayInFrames = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delayInFrames);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  const transforms: Record<string, string> = {
    left: 	ranslateX(px),
    right: 	ranslateX(px),
    top: 	ranslateY(px),
    bottom: 	ranslateY(px),
  };

  return (
    <AbsoluteFill style={{ transform: transforms[from] }}>
      {children}
    </AbsoluteFill>
  );
};
