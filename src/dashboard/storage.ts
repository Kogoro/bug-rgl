import type { LayoutItem } from "react-grid-layout";

import type { DashboardItem } from "./types";

const STORAGE_KEY = "dashboard-poc";
const VERSION = 1;

/** The full, serializable shape of a saved dashboard. */
export interface PersistedDashboard {
  version: number;
  items: DashboardItem[];
  layout: LayoutItem[];
}

/** Load a saved dashboard from localStorage, or `null` when absent/invalid. */
export function loadDashboard(): PersistedDashboard | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDashboard;
    if (
      parsed?.version !== VERSION ||
      !Array.isArray(parsed.items) ||
      !Array.isArray(parsed.layout)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Persist a dashboard to localStorage. Best-effort; ignores quota errors. */
export function saveDashboard(state: Omit<PersistedDashboard, "version">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: VERSION, ...state }),
    );
  } catch {
    // Ignore: persistence is a convenience, not a correctness requirement.
  }
}

/** Remove any saved dashboard. */
export function clearDashboard(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
