import { useCallback, useRef } from 'react';

const useDebounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
};

export default useDebounce;
