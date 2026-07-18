"use client";

import { BarChart3, Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { defineWidget, type WidgetContext } from "../types";

interface ChartConfig {
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
      <div className="flex min-h-0 flex-1 items-end gap-1.5">
        {config.data.map((value, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center justify-end gap-1"
            title={String(value)}
          >
            <div
              className="w-full rounded-t-sm bg-primary/80 transition-[height] duration-500 ease-out"
              style={{ height: `${(value / max) * 100}%` }}
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
  description: "A lightweight bar chart with randomizable data.",
  icon: BarChart3,
  defaultSize: { w: 6, h: 5, minW: 3, minH: 4 },
  defaultConfig: { data: [42, 65, 38, 74, 55, 88, 47] },
  component: ChartWidget,
  migrateConfig: (raw) => {
    const value = (raw ?? {}) as Partial<ChartConfig>;
    const data = Array.isArray(value.data)
      ? value.data.filter((n): n is number => Number.isFinite(n))
      : [];
    return { data: data.length > 0 ? data : randomSeries() };
  },
});
