import { EngineConfig } from '../types/media';

export const defaultConfig: EngineConfig = {
  speed: {
    enabled: true,
    basePlaybackRate: 1.0,
    beatSpeedRamp: false, // Disabled by default for natural frame motion
    beatSlowMo: 0.6,
    rampSpeed: 1.5,
  },
  camera: {
    enabled: true,
    shutterAngle: 180,
    driftIntensity: 0.08,
    shakeIntensity: 0.38,
    zoomPushAmount: 1.05,
  },
  motionBlur: {
    enabled: false, // Set to true for 180° optical physics rendering
    samples: 1,
  },
  transitions: {
    enabled: true,
    defaultDurationFrames: 15,
  },
  typography: {
    enabled: false,
    fontFamily: 'Inter',
    titleText: '',
    subtitleText: '',
  },
  colorGrade: {
    enabled: true,
    contrast: 1.14,
    saturation: 1.22,
    brightness: 1.01,
    exposure: 1.02,
    vignetteIntensity: 0.42,
    temperature: 0.08,
  },
  shader: {
    enabled: true,
    bloomIntensity: 0.22,
    glowRadius: 14,
    sepia: 0,
    hueRotate: 0,
    invert: false,
    duotone: false,
    duotoneColor1: '#00ffff',
    duotoneColor2: '#ff00ff',
  },
  effects: {
    chromaticAberration: true,
    filmGrain: false,
    grainIntensity: 0.035,
    bloom: true,
    rgbSplitOnImpact: true,
  },
  audio: {
    enabled: true,
    masterVolume: 1.0,
    musicDuckAmount: 0.65,
    fadeInSeconds: 0.5,
    fadeOutSeconds: 1.0,
  },
};
