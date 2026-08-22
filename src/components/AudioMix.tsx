import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AudioAnalysisResult, EngineConfig, MediaMetadata } from '../types/media';

interface AudioMixProps {
  metadata: MediaMetadata;
  audioAnalysis: AudioAnalysisResult;
  config: EngineConfig['audio'];
}

export const AudioMix: React.FC<AudioMixProps> = ({ metadata, config }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rawSrc = metadata.musicTrack || metadata.primaryVideo;

  if (!config.enabled || !rawSrc) {
    return null;
  }

  const cleanSrc = rawSrc.replace(/^public[/\\]/, '').replace(/^\//, '');

  // Smooth 0.5s attack fade-in & 1.0s release fade-out volume envelope
  const fadeInFrames = Math.round(fps * config.fadeInSeconds);
  const fadeOutFrames = Math.round(fps * config.fadeOutSeconds);

  let envelopeVolume = 1.0;

  if (frame < fadeInFrames) {
    const t = frame / fadeInFrames;
    envelopeVolume = t * t;
  } else if (frame > durationInFrames - fadeOutFrames) {
    const t = (durationInFrames - frame) / fadeOutFrames;
    envelopeVolume = Math.max(0, t * t);
  }

  const finalVolume = envelopeVolume * config.masterVolume;

  return <Audio src={staticFile(cleanSrc)} volume={finalVolume} />;
};
