import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import { defaultConfig } from './utils/config';
import { getStoryMetadata } from './utils/assetDiscovery';

export const Root: React.FC = () => {
  const metadata = getStoryMetadata();

  return (
    <>
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={metadata.durationInFrames}
        fps={metadata.fps}
        width={metadata.width}
        height={metadata.height}
        defaultProps={{
          metadata,
          config: defaultConfig,
        }}
      />
    </>
  );
};
