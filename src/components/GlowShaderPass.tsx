import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface GlowShaderPassProps {
  children?: React.ReactNode;
  threshold?: number;
  radiusPx?: number;
  intensity?: number;
}

export const GlowShaderPass: React.FC<GlowShaderPassProps> = ({
  children,
  threshold = 40,
  radiusPx = 25,
  intensity = 1.2,
}) => {
  const frame = useCurrentFrame();

  // Dynamic bloom & neon aura pulse interpolation
  const pulse = Math.sin(frame * 0.12);
  const currentRadius = radiusPx + pulse * 8;
  const currentOpacity = interpolate(pulse, [-1, 1], [0.35, 0.75]) * intensity;

  return (
    <AbsoluteFill style={{ position: 'relative' }}>
      {children}
      
      {/* Procedural Bloom & Neon Aura Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          filter: `drop-shadow(0px 0px ${currentRadius}px rgba(0, 242, 254, ${currentOpacity}))`,
          opacity: currentOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
