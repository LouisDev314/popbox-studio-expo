export const debounce = <T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T => {
  let timer: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
};
