import { DiscoveredAsset, MediaMetadata, VideoClipInfo } from '../types/media';

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v', '.mkv'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.aac', '.m4a', '.ogg'];

export const classifyFile = (filename: string): DiscoveredAsset['type'] => {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  return 'unknown';
};

export const getStoryMetadata = (): MediaMetadata => {
  const primaryClip: VideoClipInfo = {
    filename: 'source_video.mp4',
    durationInSeconds: 30.34,
    durationInFrames: 908,
    width: 1080,
    height: 1920,
    fps: 30,
  };

  const clips = [primaryClip];
  const durationInFrames = primaryClip.durationInFrames;

  return {
    clips,
    primaryVideo: primaryClip.filename,
    musicTrack: 'passo_bem_solto.mp3',
    hasVideo: true,
    hasAudio: true,
    width: 1080,
    height: 1920,
    fps: 30,
    durationInSeconds: durationInFrames / 30,
    durationInFrames,
    aspectRatio: 9 / 16,
    isPortrait: true,
  };
};
