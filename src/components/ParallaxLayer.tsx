import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export interface ParallaxLayerProps {
  speed: number;
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  speed,
  children,
  direction = 'horizontal',
}) => {
  const frame = useCurrentFrame();

  const translateX = direction === 'horizontal' ? frame * speed : 0;
  const translateY = direction === 'vertical' ? frame * speed : 0;

  return (
    <AbsoluteFill
      style={{
        transform: 	ranslate(px, px),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
