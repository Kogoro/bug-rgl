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
import { Switch } from "@/components/ui/switch";
import type { AnyWidgetDefinition, WidgetConfigField } from "./types";

interface WidgetSettingsDialogProps {
  definition: AnyWidgetDefinition;
  config: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}

/**
 * A generic, registry-driven settings form. It reads `definition.configSchema`,
 * renders a control per field, and populates each with the instance's current
 * value. Edits are written straight back via `onChange`. Returns `null` for
 * widgets that declare no schema, so only configurable widgets show the action.
 */
export function WidgetSettingsDialog({
  definition,
  config,
  onChange,
}: WidgetSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const fields = definition.configSchema ?? [];
  if (fields.length === 0) return null;

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
          {fields.map((field) => (
            <WidgetConfigControl
              key={field.key}
              field={field}
              value={config[field.key]}
              onChange={(value) => onChange({ [field.key]: value })}
            />
          ))}
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
