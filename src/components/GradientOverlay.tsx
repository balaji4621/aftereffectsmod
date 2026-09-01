import React from 'react';
import { AbsoluteFill } from 'remotion';

export interface GradientOverlayProps {
  direction?: string;
  colors?: string[];
  opacity?: number;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  direction = 'to bottom',
  colors = ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)'],
  opacity = 1,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: linear-gradient(, ),
        opacity,
      }}
    />
  );
};
