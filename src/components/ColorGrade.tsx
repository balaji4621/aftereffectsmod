import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EngineConfig } from '../types/media';

interface ColorGradeProps {
  config: EngineConfig['colorGrade'];
  children: React.ReactNode;
}

export const ColorGrade: React.FC<ColorGradeProps> = ({ config, children }) => {
  if (!config.enabled) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const contrast = config.contrast;
  const saturation = config.saturation;
  const brightness = config.brightness * config.exposure;

  return (
    <AbsoluteFill
      style={{
        filter: `contrast(${contrast}) saturate(${saturation}) brightness(${brightness})`,
      }}
    >
      {children}

      {/* Shadows Teal & Highlights Warm Color Grading Pass */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(255, 230, 200, 0.04) 0%, rgba(15, 23, 42, 0.08) 100%)',
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
