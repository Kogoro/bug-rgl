import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Dashboard bounded context — ubiquitous language.
 *
 * - `WidgetDefinition`: the registered blueprint for a kind of dashboard item.
 * - `WidgetRegistry`: the catalog that owns every available `WidgetDefinition`.
 * - `DashboardItem`: a placed instance of a widget on a specific dashboard.
 * - `WidgetContext`: everything a widget instance needs in order to render.
 *
 * A widget is "pluggable": it is authored in isolation, described by a
 * `WidgetDefinition`, and registered into the `WidgetRegistry`. The dashboard
 * shell knows nothing about concrete widgets — it only speaks to the registry.
 */

/** Grid footprint + drag/resize constraints for a widget, in grid units. */
export interface WidgetSize {
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

/** Runtime context handed to a widget instance's component. */
export interface WidgetContext<TConfig> {
  /** Stable instance id (unique per placed widget). */
  readonly id: string;
  /** The instance's current, validated configuration. */
  readonly config: TConfig;
  /** Whether the dashboard is currently in edit mode. */
  readonly isEditing: boolean;
  /** Merge a partial patch into this instance's configuration. */
  readonly updateConfig: (patch: Partial<TConfig>) => void;
}

export type WidgetComponent<TConfig> = ComponentType<WidgetContext<TConfig>>;

/**
 * The blueprint for a kind of widget. Authored via {@link defineWidget} so the
 * config type is inferred and checked at the authoring site.
 */
export interface WidgetDefinition<TConfig> {
  /** Unique, stable, machine key (also used as the persistence discriminator). */
  readonly type: string;
  /** Human-facing name shown in the widget catalog. */
  readonly name: string;
  /** Short description shown in the widget catalog. */
  readonly description: string;
  /** Catalog icon. */
  readonly icon: LucideIcon;
  /** Default grid footprint used when the widget is first added. */
  readonly defaultSize: WidgetSize;
  /** Default configuration for a freshly-added instance. */
  readonly defaultConfig: TConfig;
  /** Renders a single instance of this widget. */
  readonly component: WidgetComponent<TConfig>;
  /**
   * Optional guard that coerces/validates persisted JSON back into a valid
   * config. Protects against schema drift in the persisted dashboard.
   */
  readonly migrateConfig?: (raw: unknown) => TConfig;
}

/**
 * Type-erased definition used for storage inside the registry. The concrete
 * `TConfig` is intentionally hidden here; type-safety is preserved at the
 * authoring boundary (`defineWidget`) and restored at the render boundary,
 * where a definition is always paired with its own config.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyWidgetDefinition = WidgetDefinition<any>;

/** A placed widget instance persisted as part of a dashboard. */
export interface DashboardItem {
  /** Unique instance id. */
  readonly id: string;
  /** References {@link WidgetDefinition.type}. */
  readonly type: string;
  /** Instance configuration (shape owned by the widget definition). */
  readonly config: unknown;
}

/**
 * Authoring helper. Using this instead of a bare object literal lets TypeScript
 * infer `TConfig` from `defaultConfig` and check the component + migrate guard
 * against it, while returning a type-erased definition ready for the registry.
 */
export function defineWidget<TConfig>(
  definition: WidgetDefinition<TConfig>,
): AnyWidgetDefinition {
  return definition as AnyWidgetDefinition;
}
