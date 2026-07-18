"use client";

import { useState } from "react";
import { ListChecks, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { createId } from "../id";
import { defineWidget, type WidgetContext } from "../types";

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

interface TodoConfig {
  items: TodoItem[];
}

function TodoWidget({ config, updateConfig }: WidgetContext<TodoConfig>) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const text = draft.trim();
    if (!text) return;
    updateConfig({
      items: [...config.items, { id: createId("todo"), text, done: false }],
    });
    setDraft("");
  }

  function toggleItem(id: string) {
    updateConfig({
      items: config.items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    });
  }

  function removeItem(id: string) {
    updateConfig({ items: config.items.filter((item) => item.id !== id) });
  }

  const remaining = config.items.filter((item) => !item.done).length;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="no-drag flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addItem();
          }}
          placeholder="Add a task…"
          className="h-8"
        />
        <Button size="icon" className="size-8 shrink-0" onClick={addItem}>
          <Plus className="size-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>

      <ScrollArea className="no-drag min-h-0 flex-1">
        <ul className="flex flex-col gap-1 pr-3">
          {config.items.length === 0 && (
            <li className="py-4 text-center text-sm text-muted-foreground">
              No tasks yet.
            </li>
          )}
          {config.items.map((item) => (
            <li
              key={item.id}
              className="group flex items-center gap-2 rounded-md px-1 py-1 hover:bg-muted"
            >
              <Checkbox
                checked={item.done}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  item.done && "text-muted-foreground line-through",
                )}
              >
                {item.text}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                aria-label={`Remove ${item.text}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        {remaining} of {config.items.length} remaining
      </p>
    </div>
  );
}

export const todoWidget = defineWidget<TodoConfig>({
  type: "todo",
  name: "To-do list",
  description: "A small checklist you can tick off.",
  icon: ListChecks,
  defaultSize: { w: 4, h: 6, minW: 3, minH: 4 },
  defaultConfig: {
    items: [
      { id: "seed-1", text: "Drag me around in edit mode", done: false },
      { id: "seed-2", text: "Resize me from the corner", done: false },
      { id: "seed-3", text: "Add more widgets", done: true },
    ],
  },
  component: TodoWidget,
  migrateConfig: (raw) => {
    const value = (raw ?? {}) as Partial<TodoConfig>;
    const items = Array.isArray(value.items) ? value.items : [];
    return {
      items: items
        .filter((item): item is TodoItem => Boolean(item) && typeof item === "object")
        .map((item) => ({
          id: typeof item.id === "string" ? item.id : createId("todo"),
          text: typeof item.text === "string" ? item.text : "",
          done: Boolean(item.done),
        })),
    };
  },
});
