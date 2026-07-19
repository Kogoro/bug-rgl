"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type {
  AnyWidgetDefinition,
  DashboardItem,
  WidgetConfigField,
} from "./types";

interface WidgetSettingsDialogProps {
  definition: AnyWidgetDefinition;
  item: DashboardItem;
  /** Update the widget's own configuration (schema-driven). */
  onConfigChange: (patch: Record<string, unknown>) => void;
  /** Update the frame-level title/subtitle. */
  onMetaChange: (patch: { title?: string; subtitle?: string }) => void;
}

/**
 * The per-widget settings dialog. Every widget can set a frame-level title and
 * subtitle (which control the header/title bar), and widgets that declare a
 * `configSchema` also get a form populated from their current config. All
 * controls are pre-filled from the instance's current values.
 */
export function WidgetSettingsDialog({
  definition,
  item,
  onConfigChange,
  onMetaChange,
}: WidgetSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const fields = definition.configSchema ?? [];
  const config = item.config as Record<string, unknown>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={`Configure ${definition.name}`}
        >
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="no-drag sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{definition.name} settings</DialogTitle>
          <DialogDescription>
            Configure this widget. Changes apply immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="widget-title">Title</Label>
            <Input
              id="widget-title"
              value={item.title ?? ""}
              placeholder={`e.g. ${definition.name}`}
              onChange={(event) => onMetaChange({ title: event.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Shown as the header. Leave empty to hide the header when not
              editing.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="widget-subtitle">Subtitle</Label>
            <Input
              id="widget-subtitle"
              value={item.subtitle ?? ""}
              placeholder="Optional"
              onChange={(event) =>
                onMetaChange({ subtitle: event.target.value })
              }
            />
          </div>

          {fields.length > 0 && (
            <>
              <Separator />
              {fields.map((field) => (
                <WidgetConfigControl
                  key={field.key}
                  field={field}
                  value={config[field.key]}
                  onChange={(value) => onConfigChange({ [field.key]: value })}
                />
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface WidgetConfigControlProps {
  field: WidgetConfigField;
  value: unknown;
  onChange: (value: unknown) => void;
}

function WidgetConfigControl({ field, value, onChange }: WidgetConfigControlProps) {
  const id = `cfg-${field.key}`;
  const hint = field.description ? (
    <p className="text-xs text-muted-foreground">{field.description}</p>
  ) : null;

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-0.5">
          <Label htmlFor={id}>{field.label}</Label>
          {hint}
        </div>
        <Switch
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Select value={String(value ?? "")} onValueChange={onChange}>
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hint}
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Input
          id={id}
          type="number"
          value={Number.isFinite(value as number) ? (value as number) : 0}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(event) =>
            onChange(event.target.value === "" ? 0 : Number(event.target.value))
          }
        />
        {hint}
      </div>
    );
  }

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint}
    </div>
  );
}
