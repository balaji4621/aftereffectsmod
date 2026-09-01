import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export interface PulseGlowProps {
  color?: string;
  speed?: number;
  intensity?: number;
  children?: React.ReactNode;
}

export const PulseGlow: React.FC<PulseGlowProps> = ({
  color = '#ff0066',
  speed = 1,
  intensity = 20,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * speed * Math.PI * 2);
  const glowAmount = interpolate(pulse, [-1, 1], [0, intensity]);

  return (
    <AbsoluteFill
      style={{
        filter: drop-shadow(0 0 px ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
