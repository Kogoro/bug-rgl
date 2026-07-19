"use client";

import { ArrowDownRight, ArrowUpRight, Gauge } from "lucide-react";

import { cn } from "@/lib/utils";
import { defineWidget, type WidgetContext } from "../types";

interface MetricConfig {
  label: string;
  value: number;
  unit: string;
  /** Percentage change vs. previous period. */
  delta: number;
}

function MetricWidget({ config }: WidgetContext<MetricConfig>) {
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
  description: "A KPI card with a value and trend. Configurable via settings.",
  icon: Gauge,
  defaultSize: { w: 3, h: 3, minW: 2, minH: 3 },
  defaultConfig: { label: "Revenue", value: 12840, unit: "$", delta: 12.5 },
  component: MetricWidget,
  configSchema: [
    { key: "label", label: "Label", type: "text", placeholder: "e.g. Revenue" },
    { key: "value", label: "Value", type: "number" },
    { key: "unit", label: "Unit", type: "text", placeholder: "e.g. $, %, ms" },
    { key: "delta", label: "Delta (%)", type: "number", step: 0.1 },
  ],
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
