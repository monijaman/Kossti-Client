import { useEffect, useState } from "react";

// This generic version T allows you to pass any type, including an array of Column objects. Now, you can use it in your KanbanBoard component without issues:

interface BounceProps<T> {
  value: T;
  delay: number;
}

function useDebounce<T>({ value, delay }: BounceProps<T>): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
