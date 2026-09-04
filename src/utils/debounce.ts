export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
      lastArgs = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.flush = () => {
    if (timeoutId !== null && lastArgs !== null) {
      fn(...lastArgs);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.pending = () => timeoutId !== null;

  return debounced as DebouncedFunction<T>;
};
