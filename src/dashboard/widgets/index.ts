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

let registered = false;

/** Idempotently register the built-in widgets into the shared registry. */
export function registerBuiltInWidgets(): void {
  if (registered) return;
  widgetRegistry.registerAll(builtInWidgets);
  registered = true;
}
