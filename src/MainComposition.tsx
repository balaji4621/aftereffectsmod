import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { EngineConfig, MediaMetadata } from './types/media';
import { defaultConfig } from './utils/config';
import { analyzeAudioAndScenes } from './utils/audioAnalysis';
import { EffectsStack } from './components/EffectsStack';
import { getStoryMetadata } from './utils/assetDiscovery';

interface MainCompositionProps {
  metadata?: MediaMetadata;
  config?: EngineConfig;
}

export const MainComposition: React.FC<MainCompositionProps> = ({
  metadata = getStoryMetadata(),
  config = defaultConfig,
}) => {
  const { fps } = useVideoConfig();

  const metadataToUse = metadata && metadata.clips && metadata.clips.length > 0 ? metadata : getStoryMetadata();

  // Deterministically compute audio peak analysis and scene timeline segments
  const { audioAnalysis, scenes } = useMemo(() => {
    return analyzeAudioAndScenes(metadataToUse.clips, fps);
  }, [metadataToUse.clips, fps]);

  return (
    <AbsoluteFill>
      <EffectsStack
        metadata={metadataToUse}
        audioAnalysis={audioAnalysis}
        scenes={scenes}
        config={config}
      />
    </AbsoluteFill>
  );
};
