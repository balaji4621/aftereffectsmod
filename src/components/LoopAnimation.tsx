import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LoopAnimationProps {
  durationInFrames?: number;
  children: React.ReactNode;
}

export const LoopAnimation: React.FC<LoopAnimationProps> = ({
  durationInFrames = 60,
  children,
}) => {
  const frame = useCurrentFrame();
  const loopFrame = frame % durationInFrames;

  return (
    <AbsoluteFill
      style={{
        position: 'relative',
        animation: 
one,
      }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              _loopFrame: loopFrame,
            })
          : child,
      )}
    </AbsoluteFill>
  );
};
