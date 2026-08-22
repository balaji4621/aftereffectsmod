import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EngineConfig } from '../types/media';

interface VignetteProps {
  config: EngineConfig['colorGrade'];
}

export const Vignette: React.FC<VignetteProps> = ({ config }) => {
  if (!config.enabled || config.vignetteIntensity <= 0) {
    return null;
  }

  const opacity = config.vignetteIntensity;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, ${opacity * 1.5}) 100%)`,
        mixBlendMode: 'multiply',
      }}
    />
  );
};
