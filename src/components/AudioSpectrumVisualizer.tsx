import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

interface AudioSpectrumVisualizerProps {
  barCount?: number;
  color?: string;
  maxHeightPx?: number;
}

export const AudioSpectrumVisualizer: React.FC<AudioSpectrumVisualizerProps> = ({
  barCount = 16,
  color = '#00F2FE',
  maxHeightPx = 80,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '40px',
        gap: '6px',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: barCount }).map((_, idx) => {
        const freqOffset = idx * 0.4;
        const height = Math.abs(Math.sin(frame * 0.15 + freqOffset)) * maxHeightPx + 10;
        const opacity = 0.5 + Math.cos(frame * 0.1 + freqOffset) * 0.4;

        return (
          <div
            key={idx}
            style={{
              width: '6px',
              height: `${height}px`,
              backgroundColor: color,
              borderRadius: '4px',
              opacity,
              boxShadow: `0 0 10px ${color}`,
              transition: 'height 0.05s ease',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
