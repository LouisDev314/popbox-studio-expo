import { useEffect, useState } from 'react';

const useDebounceInput = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  let timer: NodeJS.Timeout;

  useEffect(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounceInput;
