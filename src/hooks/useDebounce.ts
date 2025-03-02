import { useRef } from "react";

export function useDebounce<T>(callback: (args: T) => void, delay: number) {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  return (args: T) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      callback(args);
    }, delay);
  };
}
