"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Layout, LayoutItem } from "react-grid-layout";

import { createId } from "./id";
import { widgetRegistry } from "./registry";
import { clearDashboard, loadDashboard, saveDashboard } from "./storage";
import type { DashboardItem } from "./types";
import { registerBuiltInWidgets } from "./widgets";

// Ensure the catalog is populated before any dashboard logic runs.
registerBuiltInWidgets();

/** Grid geometry shared by the hook and the view. */
export const GRID_COLS = 12;

/** The default dashboard shown on first visit (nothing persisted yet). */
function createSeed(): { items: DashboardItem[]; layout: LayoutItem[] } {
  const seedTypes = ["clock", "metric", "todo"] as const;
  const items: DashboardItem[] = [];
  const layout: LayoutItem[] = [];
  let x = 0;

  for (const type of seedTypes) {
    const definition = widgetRegistry.get(type);
    if (!definition) continue;
    const id = createId(type);
    const { w, h, minW, minH, maxW, maxH } = definition.defaultSize;
    items.push({ id, type, config: definition.defaultConfig });
    layout.push({ i: id, x, y: 0, w, h, minW, minH, maxW, maxH, static: false });
    x += w;
  }

  return { items, layout };
}

/** Lowest free row across the current layout (for appending new widgets). */
function bottomOf(layout: LayoutItem[]): number {
  return layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
}

export interface DashboardApi {
  /** False during SSR / first paint; the grid is only meaningful once true. */
  mounted: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  items: DashboardItem[];
  layout: LayoutItem[];
  /** Map from instance id to its config, for convenient rendering. */
  addWidget: (type: string) => void;
  removeWidget: (id: string) => void;
  toggleLock: (id: string) => void;
  isLocked: (id: string) => boolean;
  updateConfig: (id: string, patch: object) => void;
  updateItemMeta: (id: string, patch: { title?: string; subtitle?: string }) => void;
  onLayoutChange: (next: Layout) => void;
  resetDashboard: () => void;
}

export function useDashboard(): DashboardApi {
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);

  // Hydrate from localStorage after mount to avoid SSR/client mismatch.
  useEffect(() => {
    const persisted = loadDashboard();
    if (persisted) {
      // Drop any items whose widget type is no longer registered, and migrate
      // each surviving config through its definition's guard (schema drift).
      const survivingIds = new Set<string>();
      const nextItems = persisted.items
        .filter((item) => widgetRegistry.has(item.type))
        .map((item) => {
          survivingIds.add(item.id);
          const definition = widgetRegistry.getOrThrow(item.type);
          const config = definition.migrateConfig
            ? definition.migrateConfig(item.config)
            : item.config;
          return {
            ...item,
            config,
            title: typeof item.title === "string" ? item.title : undefined,
            subtitle: typeof item.subtitle === "string" ? item.subtitle : undefined,
          };
        });
      const nextLayout = persisted.layout.filter((entry) =>
        survivingIds.has(entry.i),
      );
      // One-time hydration from localStorage. This must happen after mount (the
      // store is unavailable during SSR) and is intentionally kept out of a
      // render-time initializer to avoid a server/client hydration mismatch.
      /* eslint-disable react-hooks/set-state-in-effect */
      setItems(nextItems);
      setLayout(nextLayout);
    } else {
      const seed = createSeed();
      setItems(seed.items);
      setLayout(seed.layout);
    }
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist on every change once hydrated.
  const persistTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!mounted) return;
    if (persistTimer.current) window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      saveDashboard({ items, layout });
    }, 200);
    return () => {
      if (persistTimer.current) window.clearTimeout(persistTimer.current);
    };
  }, [mounted, items, layout]);

  const addWidget = useCallback((type: string) => {
    const definition = widgetRegistry.get(type);
    if (!definition) return;
    const id = createId(type);
    const { w, h, minW, minH, maxW, maxH } = definition.defaultSize;
    setItems((prev) => [
      ...prev,
      { id, type, config: definition.defaultConfig },
    ]);
    setLayout((prev) => [
      ...prev,
      { i: id, x: 0, y: bottomOf(prev), w, h, minW, minH, maxW, maxH, static: false },
    ]);
  }, []);

  const removeWidget = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setLayout((prev) => prev.filter((entry) => entry.i !== id));
  }, []);

  const toggleLock = useCallback((id: string) => {
    setLayout((prev) =>
      prev.map((entry) =>
        entry.i === id ? { ...entry, static: !entry.static } : entry,
      ),
    );
  }, []);

  const lockedIds = useMemo(() => {
    const set = new Set<string>();
    for (const entry of layout) if (entry.static) set.add(entry.i);
    return set;
  }, [layout]);

  const isLocked = useCallback((id: string) => lockedIds.has(id), [lockedIds]);

  const updateConfig = useCallback((id: string, patch: object) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              config: { ...(item.config as object), ...patch },
            }
          : item,
      ),
    );
  }, []);

  const updateItemMeta = useCallback(
    (id: string, patch: { title?: string; subtitle?: string }) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const onLayoutChange = useCallback((next: Layout) => {
    setLayout(next.map((entry) => ({ ...entry })));
  }, []);

  const resetDashboard = useCallback(() => {
    clearDashboard();
    const seed = createSeed();
    setItems(seed.items);
    setLayout(seed.layout);
  }, []);

  return {
    mounted,
    editing,
    setEditing,
    items,
    layout,
    addWidget,
    removeWidget,
    toggleLock,
    isLocked,
    updateConfig,
    updateItemMeta,
    onLayoutChange,
    resetDashboard,
  };
}
