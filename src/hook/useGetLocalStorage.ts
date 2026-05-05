import { useState } from "react";

export default function useGetLocalStorage<T>(key: string) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return {} as T;

    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : ({} as T);
  });

  return storedValue;
}
