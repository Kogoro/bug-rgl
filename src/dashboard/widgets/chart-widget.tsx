"use client";

import { BarChart3, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { defineWidget, type WidgetContext } from "../types";

/** Allowed bar colors (map to theme chart tokens). */
const CHART_COLORS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const;
type ChartColor = (typeof CHART_COLORS)[number];

interface ChartConfig {
  color: ChartColor;
  /** Bar values; rendered as a simple, dependency-free bar chart. */
  data: number[];
}

function randomSeries(length = 7): number[] {
  return Array.from({ length }, () => Math.round(20 + Math.random() * 80));
}

function ChartWidget({ config, updateConfig }: WidgetContext<ChartConfig>) {
  const max = Math.max(1, ...config.data);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex min-h-0 flex-1 items-stretch gap-1.5">
        {config.data.map((value, index) => (
          <div
            key={index}
            className="flex h-full flex-1 flex-col justify-end"
            title={String(value)}
          >
            <div
              className="w-full rounded-t-sm transition-[height] duration-500 ease-out"
              style={{
                height: `${Math.max(2, (value / max) * 100)}%`,
                backgroundColor: `var(--${config.color})`,
              }}
            />
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="no-drag self-start"
        onClick={() => updateConfig({ data: randomSeries(config.data.length) })}
      >
        <Shuffle className="size-3.5" />
        Randomize
      </Button>
    </div>
  );
}

export const chartWidget = defineWidget<ChartConfig>({
  type: "chart",
  name: "Bar chart",
  description: "A lightweight bar chart. Set a title and color in settings.",
  icon: BarChart3,
  defaultSize: { w: 6, h: 5, minW: 3, minH: 4 },
  defaultConfig: {
    color: "chart-1",
    data: [42, 65, 38, 74, 55, 88, 47],
  },
  component: ChartWidget,
  configSchema: [
    {
      key: "color",
      label: "Bar color",
      type: "select",
      options: [
        { label: "Orange", value: "chart-1" },
        { label: "Teal", value: "chart-2" },
        { label: "Blue", value: "chart-3" },
        { label: "Yellow", value: "chart-4" },
        { label: "Amber", value: "chart-5" },
      ],
    },
  ],
  migrateConfig: (raw) => {
    const value = (raw ?? {}) as Partial<ChartConfig>;
    const data = Array.isArray(value.data)
      ? value.data.filter((n): n is number => Number.isFinite(n))
      : [];
    const color = CHART_COLORS.includes(value.color as ChartColor)
      ? (value.color as ChartColor)
      : "chart-1";
    return {
      color,
      data: data.length > 0 ? data : randomSeries(),
    };
  },
});
