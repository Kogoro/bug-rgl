"use client";

import { ArrowDownRight, ArrowUpRight, Gauge } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { defineWidget, type WidgetContext } from "../types";

interface MetricConfig {
  label: string;
  value: number;
  unit: string;
  /** Percentage change vs. previous period. */
  delta: number;
}

function MetricWidget({ config, isEditing, updateConfig }: WidgetContext<MetricConfig>) {
  if (isEditing) {
    return (
      <div className="no-drag flex h-full flex-col justify-center gap-2">
        <div className="grid gap-1">
          <Label htmlFor="metric-label" className="text-xs">
            Label
          </Label>
          <Input
            id="metric-label"
            value={config.label}
            onChange={(event) => updateConfig({ label: event.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1">
            <Label htmlFor="metric-value" className="text-xs">
              Value
            </Label>
            <Input
              id="metric-value"
              type="number"
              value={config.value}
              onChange={(event) =>
                updateConfig({ value: Number(event.target.value) || 0 })
              }
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="metric-unit" className="text-xs">
              Unit
            </Label>
            <Input
              id="metric-unit"
              value={config.unit}
              onChange={(event) => updateConfig({ unit: event.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="metric-delta" className="text-xs">
            Delta %
          </Label>
          <Input
            id="metric-delta"
            type="number"
            value={config.delta}
            onChange={(event) =>
              updateConfig({ delta: Number(event.target.value) || 0 })
            }
          />
        </div>
      </div>
    );
  }

  const positive = config.delta >= 0;
  const DeltaIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {config.label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-semibold tabular-nums tracking-tight">
          {config.value.toLocaleString()}
        </span>
        {config.unit && (
          <span className="text-lg text-muted-foreground">{config.unit}</span>
        )}
      </div>
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          positive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        )}
      >
        <DeltaIcon className="size-3" />
        {Math.abs(config.delta)}%
      </span>
    </div>
  );
}

export const metricWidget = defineWidget<MetricConfig>({
  type: "metric",
  name: "Metric",
  description: "A KPI card with a value and trend. Editable in edit mode.",
  icon: Gauge,
  defaultSize: { w: 3, h: 3, minW: 2, minH: 3 },
  defaultConfig: { label: "Revenue", value: 12840, unit: "$", delta: 12.5 },
  component: MetricWidget,
  migrateConfig: (raw) => {
    const value = (raw ?? {}) as Partial<MetricConfig>;
    return {
      label: typeof value.label === "string" ? value.label : "Metric",
      value: Number.isFinite(value.value) ? Number(value.value) : 0,
      unit: typeof value.unit === "string" ? value.unit : "",
      delta: Number.isFinite(value.delta) ? Number(value.delta) : 0,
    };
  },
});
