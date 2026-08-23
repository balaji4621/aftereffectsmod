import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import audioFeatures from '../generated/audio-features.json';

interface BeatSyncedCameraProps {
  children: React.ReactNode;
}

export const BeatSyncedCamera: React.FC<BeatSyncedCameraProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find corresponding frame feature or fallback
  const frameFeature = audioFeatures.frames[frame] || { subKick: 0, snare: 0, isKickHit: false, isSnareHit: false };

  // Calculate dynamic 3D camera translation & rotation impulses
  const kickImpulse = frameFeature.subKick * 25; // 25px z-zoom on kick
  const snareRotate = frameFeature.snare * 3.5;  // 3.5deg roll rotation on snare

  const translateZ = kickImpulse;
  const rotateZ = snareRotate;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translateZ(${translateZ}px) rotateZ(${rotateZ}deg)`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};
