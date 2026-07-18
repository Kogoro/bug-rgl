"use client";

import ReactGridLayout, {
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import { LayoutDashboard, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AddWidgetSheet } from "./add-widget-sheet";
import { widgetRegistry } from "./registry";
import { GRID_COLS, useDashboard } from "./use-dashboard";
import { WidgetFrame } from "./widget-frame";

export function Dashboard() {
  const { width, containerRef, mounted: widthReady } = useContainerWidth();
  const dashboard = useDashboard();
  const {
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
    onLayoutChange,
    resetDashboard,
  } = dashboard;

  const ready = mounted && widthReady;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4 sm:p-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="size-6" />
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border px-3 py-1.5">
            <Switch
              id="edit-mode"
              checked={editing}
              onCheckedChange={setEditing}
            />
            <Label htmlFor="edit-mode" className="cursor-pointer text-sm">
              Edit mode
            </Label>
          </div>

          {editing && (
            <>
              <AddWidgetSheet
                onAdd={(type) => {
                  addWidget(type);
                  toast.success(
                    `${widgetRegistry.get(type)?.name ?? "Widget"} added`,
                  );
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  resetDashboard();
                  toast("Dashboard reset to defaults");
                }}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 rounded-xl border border-dashed bg-muted/30 p-2"
      >
        {!ready && (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Loading dashboard…
          </div>
        )}

        {ready && items.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">
              Your dashboard is empty.
            </p>
            {editing ? (
              <AddWidgetSheet onAdd={addWidget} />
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Enter edit mode to add widgets
              </Button>
            )}
          </div>
        )}

        {ready && items.length > 0 && (
          <ReactGridLayout
            className="layout"
            width={width}
            layout={layout}
            gridConfig={{ cols: GRID_COLS, rowHeight: 44, maxRows: 200 }}
            dragConfig={{
              enabled: editing,
              handle: ".widget-drag-handle",
              cancel: ".no-drag",
            }}
            resizeConfig={{ enabled: editing }}
            compactor={verticalCompactor}
            onLayoutChange={onLayoutChange}
          >
            {items.map((item) => {
              const definition = widgetRegistry.get(item.type);
              if (!definition) return null;
              return (
                <WidgetFrame
                  key={item.id}
                  definition={definition}
                  item={item}
                  editing={editing}
                  locked={isLocked(item.id)}
                  onToggleLock={() => toggleLock(item.id)}
                  onRemove={() => {
                    removeWidget(item.id);
                    toast(`${definition.name} removed`);
                  }}
                  onUpdateConfig={(patch) => updateConfig(item.id, patch)}
                />
              );
            })}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
}
