"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { widgetRegistry } from "./registry";

interface AddWidgetSheetProps {
  onAdd: (type: string) => void;
}

/**
 * The widget catalog. It is populated entirely from the registry, so any newly
 * registered widget automatically appears here with no changes to this file.
 */
export function AddWidgetSheet({ onAdd }: AddWidgetSheetProps) {
  const [open, setOpen] = useState(false);
  const widgets = widgetRegistry.list();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add widget
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Widget catalog</SheetTitle>
          <SheetDescription>
            {widgets.length} pluggable widgets available. Pick one to add.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 overflow-auto p-4">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            return (
              <button
                key={widget.type}
                type="button"
                onClick={() => {
                  onAdd(widget.type);
                  setOpen(false);
                }}
                className="flex items-start gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{widget.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {widget.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
