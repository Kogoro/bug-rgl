import type { AnyWidgetDefinition } from "./types";

/**
 * The widget catalog. This is the single seam through which the dashboard shell
 * discovers what can be placed on a dashboard. Concrete widgets never import the
 * shell and the shell never imports concrete widgets — both depend only on the
 * registry, keeping the widget set fully pluggable.
 */
export class WidgetRegistry {
  private readonly definitions = new Map<string, AnyWidgetDefinition>();

  /** Register a widget definition. Throws on duplicate `type` (fail fast). */
  register(definition: AnyWidgetDefinition): this {
    if (this.definitions.has(definition.type)) {
      throw new Error(
        `Widget type "${definition.type}" is already registered.`,
      );
    }
    this.definitions.set(definition.type, definition);
    return this;
  }

  /** Register many definitions at once. */
  registerAll(definitions: readonly AnyWidgetDefinition[]): this {
    for (const definition of definitions) this.register(definition);
    return this;
  }

  /** Whether a widget type is known to the registry. */
  has(type: string): boolean {
    return this.definitions.has(type);
  }

  /** Look up a definition, or `undefined` if the type is unknown. */
  get(type: string): AnyWidgetDefinition | undefined {
    return this.definitions.get(type);
  }

  /** Look up a definition or throw if the type is unknown. */
  getOrThrow(type: string): AnyWidgetDefinition {
    const definition = this.definitions.get(type);
    if (!definition) {
      throw new Error(`Unknown widget type "${type}".`);
    }
    return definition;
  }

  /** All registered definitions, in registration order. */
  list(): AnyWidgetDefinition[] {
    return [...this.definitions.values()];
  }
}

/** Process-wide singleton catalog. */
export const widgetRegistry = new WidgetRegistry();
