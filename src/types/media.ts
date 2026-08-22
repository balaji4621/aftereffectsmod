export type AssetType =
  | 'video'
  | 'audio'
  | 'image'
  | 'font'
  | 'subtitle'
  | 'overlay'
  | 'unknown';

export interface DiscoveredAsset {
  filename: string;
  relativePath: string;
  type: AssetType;
  extension: string;
}

export interface VideoClipInfo {
  filename: string;
  durationInSeconds: number;
  durationInFrames: number;
  width: number;
  height: number;
  fps: number;
}

export interface MediaMetadata {
  clips: VideoClipInfo[];
  primaryVideo: string | null;
  musicTrack: string | null;
  hasVideo: boolean;
  hasAudio: boolean;
  width: number;
  height: number;
  fps: number;
  durationInSeconds: number;
  durationInFrames: number;
  aspectRatio: number;
  isPortrait: boolean;
}

export type AudioEventType =
  | 'beat'
  | 'impact'
  | 'speech_start'
  | 'speech_end'
  | 'silence'
  | 'transition';

export interface AudioEvent {
  frame: number;
  intensity: number;
  type: AudioEventType;
}

export interface SceneSegment {
  startFrame: number;
  endFrame: number;
  durationFrames: number;
  clipFilename: string;
  energyLevel: 'low' | 'medium' | 'high';
  suggestedTransition: 'wipe' | 'slide' | 'fade' | 'zoom' | 'flash' | 'rgb_split';
}

export interface AudioAnalysisResult {
  hasAudioTrack: boolean;
  hasDialogue: boolean;
  dialogueSegments: Array<{ startFrame: number; endFrame: number }>;
  events: AudioEvent[];
  peakFrames: number[];
}

export interface EngineConfig {
  speed: {
    enabled: boolean;
    basePlaybackRate: number;
    beatSpeedRamp: boolean;
    beatSlowMo: number;
    rampSpeed: number;
  };
  camera: {
    enabled: boolean;
    shutterAngle: number;
    driftIntensity: number;
    shakeIntensity: number;
    zoomPushAmount: number;
  };
  motionBlur: {
    enabled: boolean;
    samples: number;
  };
  transitions: {
    enabled: boolean;
    defaultDurationFrames: number;
  };
  typography: {
    enabled: boolean;
    fontFamily: string;
    titleText: string;
    subtitleText: string;
  };
  colorGrade: {
    enabled: boolean;
    contrast: number;
    saturation: number;
    brightness: number;
    exposure: number;
    vignetteIntensity: number;
    temperature: number;
  };
  shader: {
    enabled: boolean;
    bloomIntensity: number;
    glowRadius: number;
    sepia: number;
    hueRotate: number;
    invert: boolean;
    duotone: boolean;
    duotoneColor1: string;
    duotoneColor2: string;
  };
  effects: {
    chromaticAberration: boolean;
    filmGrain: boolean;
    grainIntensity: number;
    bloom: boolean;
    rgbSplitOnImpact: boolean;
  };
  audio: {
    enabled: boolean;
    masterVolume: number;
    musicDuckAmount: number;
    fadeInSeconds: number;
    fadeOutSeconds: number;
  };
}
