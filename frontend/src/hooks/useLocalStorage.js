import { useCallback, useState } from "react";
import storage from "@/utils/storage";

/**
 * React-friendly wrapper around `utils/storage` for simple, component-local
 * persisted state (e.g. settings toggles). For app-wide state (auth, chat
 * history) prefer the dedicated contexts instead.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => storage.get(key, initialValue));

  const update = useCallback(
    (nextValue) => {
      setValue((prev) => {
        const resolved = typeof nextValue === "function" ? nextValue(prev) : nextValue;
        storage.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}
