"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { decodeLocalValue } from "@/lib/local-state-value";

const fallback = new Map<string, string>();
const eventName = "lms-local-state";

function read(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return fallback.get(key) ?? window.localStorage.getItem(key);
  } catch {
    return fallback.get(key) ?? null;
  }
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null) fallback.clear();
    else fallback.delete(event.key);
    listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, listener);
  };
}

/** Browser-local demo state. This does not write to the institutional database. */
export function useLocalState<T>(key: string, initial: T, validate?: (value: unknown) => value is T) {
  const snapshot = useSyncExternalStore(subscribe, () => read(key), () => null);
  const value = useMemo(() => {
    return decodeLocalValue(snapshot, initial, validate);
  }, [snapshot, initial, validate]);
  const setValue = useCallback((update: T | ((previous: T) => T)) => {
    const previous = decodeLocalValue(read(key), initial, validate);
    const next = typeof update === "function" ? (update as (value: T) => T)(previous) : update;
    const serialized = JSON.stringify(next);
    fallback.set(key, serialized);
    try { window.localStorage.setItem(key, serialized); } catch { /* Continue in memory when storage is unavailable. */ }
    window.dispatchEvent(new Event(eventName));
  }, [key, initial, validate]);
  return [value, setValue] as const;
}
