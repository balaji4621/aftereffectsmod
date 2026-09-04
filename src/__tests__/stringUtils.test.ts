import { truncateString, capitalizeFirstLetter, formatFileSize } from '../stringUtils';

describe('String Utilities', () => {
  describe('truncateString', () => {
    it('should truncate a string to specified length', () => {
      expect(truncateString("Hello World", 5)).toBe("Hello");
      expect(truncateString("Hello World", 3)).toBe("Hel");
      expect(truncateString("Hi", 10)).toBe("Hi"); // No truncation needed
      expect(truncateString("", 5)).toBe(""); // Empty string
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("world")).toBe("World");
      expect(capitalizeFirstLetter("")).toBe(""); // Empty string
      expect(capitalizeFirstLetter("a")).toBe("A"); // Single character
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes in human readable format', () => {
      expect(formatFileSize(0)).toBe("0 B");
      expect(formatFileSize(1023)).toBe("1023 B");
      expect(formatFileSize(1024)).toBe("1.00 KB");
      expect(formatFileSize(1024 * 1024)).toBe("1.00 MB");
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1.00 GB");
    });
  });
});