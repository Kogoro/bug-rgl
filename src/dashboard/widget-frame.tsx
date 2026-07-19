"use client";

import type { ComponentPropsWithRef } from "react";
import { GripVertical, Lock, LockOpen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { WidgetSettingsDialog } from "./widget-settings-dialog";
import type { AnyWidgetDefinition, DashboardItem } from "./types";

/**
 * `ComponentPropsWithRef<"div">` captures everything react-grid-layout injects
 * into a grid item child via `cloneElement` and its Draggable/Resizable
 * wrappers: `ref`, `className`, `style`, `children` (the resize handle) and,
 * crucially, `onMouseDown` / `onMouseUp` / `onTouchEnd`. These handlers are how
 * dragging is initiated, so the frame MUST forward them to the root node.
 */
interface WidgetFrameProps extends ComponentPropsWithRef<"div"> {
  definition: AnyWidgetDefinition;
  item: DashboardItem;
  editing: boolean;
  locked: boolean;
  onToggleLock: () => void;
  onRemove: () => void;
  onUpdateConfig: (patch: object) => void;
  onUpdateMeta: (patch: { title?: string; subtitle?: string }) => void;
}

export function WidgetFrame({
  definition,
  item,
  editing,
  locked,
  onToggleLock,
  onRemove,
  onUpdateConfig,
  onUpdateMeta,
  children,
  ...gridItemProps
}: WidgetFrameProps) {
  const Icon = definition.icon;
  const WidgetComponent = definition.component;

  const title = item.title?.trim();
  const subtitle = item.subtitle?.trim();
  const hasTitle = Boolean(title);
  // Outside edit mode the header only appears when a title is configured; in
  // edit mode it is always shown so drag/settings/lock/remove stay reachable.
  const showHeader = editing || hasTitle;

  return (
    <div {...gridItemProps}>
      <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {showHeader && (
          <div
            className={cn(
              "widget-drag-handle flex items-center gap-2 border-b px-3 py-2",
              editing ? "cursor-move select-none" : "cursor-default",
            )}
          >
            {editing && (
              <GripVertical className="size-4 shrink-0 text-muted-foreground" />
            )}
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium leading-tight">
                {title || definition.name}
              </span>
              {subtitle && (
                <span className="truncate text-xs leading-tight text-muted-foreground">
                  {subtitle}
                </span>
              )}
            </div>

            {editing && (
              <div className="no-drag flex items-center gap-1">
                <WidgetSettingsDialog
                  definition={definition}
                  item={item}
                  onConfigChange={onUpdateConfig}
                  onMetaChange={onUpdateMeta}
                />
                <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onToggleLock}
                    aria-pressed={locked}
                    aria-label={locked ? "Unlock widget" : "Lock widget"}
                  >
                    {locked ? (
                      <Lock className="size-4" />
                    ) : (
                      <LockOpen className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {locked ? "Locked (static)" : "Unlocked"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    onClick={onRemove}
                    aria-label="Remove widget"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
              </div>
            )}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-auto p-3">
          <WidgetComponent
            id={item.id}
            config={item.config}
            isEditing={editing}
            updateConfig={onUpdateConfig}
          />
        </div>
      </div>

      {/* react-grid-layout injects its resize handle here. */}
      {children}
    </div>
  );
}
