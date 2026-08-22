import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EngineConfig } from '../types/media';

interface ShaderPassProps {
  config: EngineConfig['shader'];
  children: React.ReactNode;
}

export const ShaderPass: React.FC<ShaderPassProps> = ({ config, children }) => {
  if (!config || !config.enabled) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const bloomGlow = config.bloomIntensity > 0
    ? `drop-shadow(0 0 ${config.glowRadius}px rgba(255, 255, 255, ${config.bloomIntensity}))`
    : '';

  const sepiaFilter = config.sepia > 0 ? `sepia(${config.sepia})` : '';
  const hueFilter = config.hueRotate !== 0 ? `hue-rotate(${config.hueRotate}deg)` : '';
  const invertFilter = config.invert ? 'invert(1)' : '';

  const combinedFilters = [bloomGlow, sepiaFilter, hueFilter, invertFilter]
    .filter(Boolean)
    .join(' ');

  return (
    <AbsoluteFill style={{ filter: combinedFilters || undefined }}>
      {children}

      {/* Optional Duotone Shader Pass Overlay */}
      {config.duotone && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${config.duotoneColor1} 0%, ${config.duotoneColor2} 100%)`,
            mixBlendMode: 'color',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
