export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

export const groupBy = <T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> =>
  arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);

export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

export const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

export const first = <T>(arr: T[]): T | undefined => arr[0];

export const compact = <T>(arr: (T | null | undefined)[]): T[] =>
  arr.filter(Boolean) as T[];

export const flatten = <T>(arr: (T | T[])[]): T[] =>
  arr.reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) acc.push(...item);
    else acc.push(item);
    return acc;
  }, []);

export const zip = <T, U>(a: T[], b: U[]): [T, U][] =>
  a.map((item, i) => [item, b[i]]);
