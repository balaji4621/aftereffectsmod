import React from 'react';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export interface FloatingTextProps {
  text: string;
  color?: string;
  fontSize?: number;
  floatSpeed?: number;
  floatRange?: number;
  style?: React.CSSProperties;
}

export const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  color = '#ffffff',
  fontSize = 24,
  floatSpeed = 0.05,
  floatRange = 10,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const y = Math.sin(frame * floatSpeed) * floatRange;
  const opacity = interpolate(
    Math.sin(frame * floatSpeed * 0.5),
    [-1, 1],
    [0.6, 1],
  );

  return (
    <div
      style={{
        color,
        fontSize,
        fontWeight: 'bold',
        transform: 	ranslateY(px),
        opacity,
        textAlign: 'center',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
