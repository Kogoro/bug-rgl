import { widgetRegistry } from "../registry";
import type { AnyWidgetDefinition } from "../types";
import { chartWidget } from "./chart-widget";
import { clockWidget } from "./clock-widget";
import { metricWidget } from "./metric-widget";
import { notesWidget } from "./notes-widget";
import { todoWidget } from "./todo-widget";

/**
 * The set of built-in widgets. To plug in a new widget, author it as a
 * `defineWidget(...)` module and add it to this array — nothing in the
 * dashboard shell needs to change.
 */
export const builtInWidgets: readonly AnyWidgetDefinition[] = [
  clockWidget,
  metricWidget,
  chartWidget,
  notesWidget,
  todoWidget,
];

// Authoring guard: two built-ins must never share a `type`.
const seenTypes = new Set<string>();
for (const widget of builtInWidgets) {
  if (seenTypes.has(widget.type)) {
    throw new Error(`Duplicate built-in widget type "${widget.type}".`);
  }
  seenTypes.add(widget.type);
}

/**
 * Idempotently register the built-in widgets into the shared registry. Safe to
 * call repeatedly and across HMR re-evaluations: types already present in the
 * (persistent) registry singleton are skipped rather than re-registered.
 */
export function registerBuiltInWidgets(): void {
  for (const widget of builtInWidgets) {
    if (!widgetRegistry.has(widget.type)) {
      widgetRegistry.register(widget);
    }
  }
}
