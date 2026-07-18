"use client";

import { StickyNote } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { defineWidget, type WidgetContext } from "../types";

interface NotesConfig {
  text: string;
}

function NotesWidget({ config, updateConfig }: WidgetContext<NotesConfig>) {
  return (
    <Textarea
      value={config.text}
      onChange={(event) => updateConfig({ text: event.target.value })}
      placeholder="Jot something down…"
      // `no-drag` keeps grid dragging from hijacking text selection/typing.
      className="no-drag h-full min-h-0 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
    />
  );
}

export const notesWidget = defineWidget<NotesConfig>({
  type: "notes",
  name: "Notes",
  description: "A free-form sticky note. Edits persist automatically.",
  icon: StickyNote,
  defaultSize: { w: 4, h: 5, minW: 2, minH: 3 },
  defaultConfig: { text: "" },
  component: NotesWidget,
  migrateConfig: (raw) => {
    const value = (raw ?? {}) as Partial<NotesConfig>;
    return { text: typeof value.text === "string" ? value.text : "" };
  },
});
