import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export interface TextRevealProps {
  text: string;
  delayInFrames?: number;
  style?: React.CSSProperties;
  type?: 'word' | 'character';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  delayInFrames = 0,
  style = {},
  type = 'word',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delayInFrames);

  const units = type === 'character' ? text.split('') : text.split(' ');

  return (
    <span style={{ ...style, display: 'inline-flex', flexWrap: 'wrap', gap: type === 'word' ? '0.3em' : '0' }}>
      {units.map((unit, i) => {
        const delay = i * (type === 'character' ? 2 : 4);
        const localFrame = Math.max(0, adjustedFrame - delay);

        const progress = spring({
          frame: localFrame,
          fps,
          config: { damping: 20, stiffness: 300 },
        });

        const translateY = interpolate(progress, [0, 1], [20, 0]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: 	ranslateY(px),
              opacity,
            }}
          >
            {unit}
          </span>
        );
      })}
    </span>
  );
};
