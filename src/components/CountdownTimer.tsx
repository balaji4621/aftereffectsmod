import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface CountdownTimerProps {
  from?: number;
  style?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  from = 5,
  style = {},
  digitStyle = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const secondsLeft = Math.max(0, from - Math.floor(frame / fps));
  const frameInSecond = frame % fps;

  const scale = interpolate(
    frameInSecond,
    [0, 5, fps],
    [1.3, 1, 0.9],
    { extrapolateRight: 'clamp' },
  );

  const opacity = interpolate(
    frameInSecond,
    [0, 3, fps - 5, fps],
    [0, 1, 1, 0.5],
    { extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 120,
        fontWeight: 'bold',
        color: '#ffffff',
        transform: scale(),
        opacity,
        ...style,
      }}
    >
      <span style={digitStyle}>{secondsLeft}</span>
    </div>
  );
};
