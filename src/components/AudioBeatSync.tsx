import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { getProceduralCameraOffset } from '../utils/effects';

interface AudioBeatSyncProps {
  children: React.ReactNode;
}

export const AudioBeatSync: React.FC<AudioBeatSyncProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Passo Bem Solto (Super Slowed) Phonk Beat Cycle (~95 BPM => 19 frames @ 30 FPS)
  const beatInterval = 19;
  const beatIndex = Math.floor(frame / beatInterval);
  const frameInBeat = frame % beatInterval;

  const isMajorKick = beatIndex % 2 === 0;

  // Primary Kick Spring Physics (Damped Decaying Oscillation)
  const kickSpring = spring({
    frame: frameInBeat,
    fps,
    config: { damping: 10, stiffness: 280, mass: 0.7 },
  });

  const kickIntensity = (1 - kickSpring) * (isMajorKick ? 1.0 : 0.65);
  const isPeak = frameInBeat < 3;

  // Secondary Rhythm Pulse for Mid-Frequency Snare (offset by 9 frames)
  const snareFrame = (frameInBeat + 9) % beatInterval;
  const snareSpring = spring({
    frame: snareFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const snareIntensity = (1 - snareSpring) * 0.4;

  // Combined Motion Vector
  const drift = getProceduralCameraOffset(frame, 0.09);

  // Explosive positional & rotational beat shake
  const shakeX = Math.sin(frame * 3.2) * kickIntensity * 38 + Math.cos(frame * 2.1) * snareIntensity * 12;
  const shakeY = Math.cos(frame * 3.8) * kickIntensity * 32 + Math.sin(frame * 2.4) * snareIntensity * 10;
  const shakeRot = Math.sin(frame * 4.2) * kickIntensity * 3.8;

  // Punchy Eased Zoom Impact
  const beatZoom = interpolate(kickSpring, [0, 1], [1.09, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // RGB Split / Chromatic Aberration offset on beat drop
  const rgbOffset = isPeak ? kickIntensity * 15 : snareIntensity * 6;

  // Exposure Flash Pulse on drop
  const brightness = 1.0 + (isPeak ? kickIntensity * 0.35 : snareIntensity * 0.1);

  return (
    <AbsoluteFill
      style={{
        filter: `brightness(${brightness})`,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${beatZoom}) translate3d(${drift.x + shakeX}px, ${drift.y + shakeY}px, 0px) rotate(${drift.rotate + shakeRot}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {rgbOffset > 1 ? (
          <AbsoluteFill>
            <AbsoluteFill
              style={{
                transform: `translateX(${-rgbOffset}px)`,
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 3px rgba(255,40,40,0.9))',
              }}
            >
              {children}
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                transform: `translateX(${rgbOffset}px)`,
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 3px rgba(40,40,255,0.9))',
              }}
            >
              {children}
            </AbsoluteFill>
          </AbsoluteFill>
        ) : (
          children
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
