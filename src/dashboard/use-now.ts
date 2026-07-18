"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny external "current time" store. Using `useSyncExternalStore` (instead of
 * `useState` + `useEffect`) is the idiomatic way to read a ticking clock: it
 * avoids SSR hydration mismatches (server snapshot is `null`) and does not call
 * `setState` inside an effect.
 */
let current = new Date();
const listeners = new Set<() => void>();
let timer: number | null = null;

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (timer === null) {
    timer = window.setInterval(() => {
      current = new Date();
      for (const listener of listeners) listener();
    }, 1000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

// Stable reference between ticks, so React does not loop.
const getSnapshot = (): Date => current;
const getServerSnapshot = (): Date | null => null;

/** Returns the current time on the client, or `null` during SSR/first paint. */
export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
