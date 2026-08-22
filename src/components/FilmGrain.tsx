import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';
import { EngineConfig } from '../types/media';

interface FilmGrainProps {
  config: EngineConfig['effects'];
}

export const FilmGrain: React.FC<FilmGrainProps> = ({ config }) => {
  const frame = useCurrentFrame();

  if (!config.filmGrain) {
    return null;
  }

  // Deterministic seed modulation per frame
  const noiseSeed = Math.abs(Math.floor(noise2D('grain-seed', frame, 0) * 1000));
  const opacity = config.grainIntensity;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            seed={noiseSeed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
      </svg>
    </AbsoluteFill>
  );
};
