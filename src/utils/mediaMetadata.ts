import { MediaMetadata } from '../types/media';
import { getStoryMetadata } from './assetDiscovery';

export const resolveMediaMetadata = async (
  assetPath: string | null
): Promise<MediaMetadata> => {
  return getStoryMetadata();
};
