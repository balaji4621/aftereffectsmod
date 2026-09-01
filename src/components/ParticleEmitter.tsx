import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  opacity: number;
  lifetime: number;
}

export interface ParticleEmitterProps {
  count?: number;
  color?: string;
  spread?: number;
  gravity?: number;
}

export const ParticleEmitter: React.FC<ParticleEmitterProps> = ({
  count = 50,
  color = '#ffffff',
  spread = 360,
  gravity = 0.1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particles: Particle[] = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      size: 2 + (i % 5) * 1.5,
      speed: 2 + (i % 7) * 0.5,
      angle: ((i * spread) / count) * (Math.PI / 180),
      opacity: 1 - (i % 3) * 0.2,
      lifetime: fps * 2,
    }));
  }, [count, spread, fps]);

  return (
    <AbsoluteFill>
      {particles.map((p) => {
        const progress = (frame % p.lifetime) / p.lifetime;
        const x = p.x + Math.cos(p.angle) * p.speed * frame;
        const y = p.y + Math.sin(p.angle) * p.speed * frame + gravity * frame * frame;
        const opacity = interpolate(progress, [0, 0.8, 1], [p.opacity, p.opacity, 0]);

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: calc(50% + px),
              top: calc(50% + px),
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
