import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface LensFlarePassProps {
  children?: React.ReactNode;
  flareColor?: string;
  intensity?: number;
}

export const LensFlarePass: React.FC<LensFlarePassProps> = ({
  children,
  flareColor = '#00F2FE',
  intensity = 1.0,
}) => {
  const frame = useCurrentFrame();

  // Anamorphic horizontal flare movement
  const flareX = interpolate(Math.sin(frame * 0.08), [-1, 1], [15, 85]);
  const flareY = interpolate(Math.cos(frame * 0.05), [-1, 1], [20, 40]);
  const opacity = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.25, 0.6]) * intensity;

  return (
    <AbsoluteFill style={{ position: 'relative' }}>
      {children}

      {/* Anamorphic Lens Flare Line Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity,
          background: `radial-gradient(ellipse 120% 15% at ${flareX}% ${flareY}%, ${flareColor} 0%, rgba(112, 0, 255, 0.4) 45%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
