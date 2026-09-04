import { shuffle, chunk, flatten, removeDuplicates } from '../arrayUtils';

describe('Array Utilities', () => {
  describe('shuffle', () => {
    it('should shuffle an array', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...original]); // Spread to avoid mutating original
      // Check that it contains the same elements
      expect(shuffled.sort()).toEqual(original.sort());
      // Check that it's likely different (very unlikely to be same by chance)
      expect(shuffled).not.toEqual(original); // This could fail rarely but that's ok for a test
    });
  });

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]]);
      expect(chunk([1, 2, 3, 4, 5], 10)).toEqual([[1, 2, 3, 4, 5]]);
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
      expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
      expect(flatten([1, 2, 3])).toEqual([1, 2, 3]); // Already flat
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate values from array', () => {
      expect(removeDuplicates([1, 2, 2, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      expect(removeDuplicates([1, 1, 1, 1])).toEqual([1]);
      expect(removeDuplicates([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]); // No duplicates
      expect(removeDuplicates([])).toEqual([]);
    });
  });
});