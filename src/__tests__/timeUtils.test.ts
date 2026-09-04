import { framesToTime, timeToFrames, fpsToMs, msToFps } from '../timeUtils';

describe('Time Utilities', () => {
  describe('framesToTime', () => {
    it('should convert frames to timecode string', () => {
      expect(framesToTime(0, 30)).toBe("00:00:00:00");
      expect(framesToTime(30, 30)).toBe("00:00:01:00");
      expect(framesToTime(90, 30)).toBe("00:00:03:00");
      expect(framesToTime(150, 30)).toBe("00:00:05:00");
    });
  });

  describe('timeToFrames', () => {
    it('should convert timecode string to frames', () => {
      expect(timeToFrames("00:00:00:00", 30)).toBe(0);
      expect(timeToFrames("00:00:01:00", 30)).toBe(30);
      expect(timeToFrames("00:00:03:00", 30)).toBe(90);
      expect(timeToFrames("00:00:05:00", 30)).toBe(150);
    });
  });

  describe('fpsToMs', () => {
    it('should convert fps to milliseconds per frame', () => {
      expect(fpsToMs(24)).toBeCloseTo(41.666666666666664);
      expect(fpsToMs(30)).toBe(33.333333333333336);
      expect(fpsToMs(60)).toBe(16.666666666666668);
    });
  });

  describe('msToFps', () => {
    it('should convert milliseconds per frame to fps', () => {
      expect(msToFps(41.666666666666664)).toBeCloseTo(24);
      expect(msToFps(33.333333333333336)).toBeCloseTo(30);
      expect(msToFps(16.666666666666668)).toBeCloseTo(60);
    });
  });
});