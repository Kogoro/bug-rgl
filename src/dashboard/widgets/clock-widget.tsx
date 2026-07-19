"use client";

import { Clock } from "lucide-react";

import { useNow } from "../use-now";
import { defineWidget, type WidgetContext } from "../types";

interface ClockConfig {
  hour12: boolean;
  showSeconds: boolean;
}

function ClockWidget({ config }: WidgetContext<ClockConfig>) {
  // `null` during SSR/first paint; ticks every second on the client.
  const now = useNow();

  const time = now?.toLocaleTimeString(undefined, {
    hour12: config.hour12,
    hour: "2-digit",
    minute: "2-digit",
    second: config.showSeconds ? "2-digit" : undefined,
  });
  const date = now?.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
      <span className="text-4xl font-semibold tabular-nums tracking-tight">
        {time ?? "--:--"}
      </span>
      <span className="text-sm text-muted-foreground">{date ?? "\u00a0"}</span>
    </div>
  );
}

export const clockWidget = defineWidget<ClockConfig>({
  type: "clock",
  name: "Clock",
  description: "A live local time and date display.",
  icon: Clock,
  defaultSize: { w: 3, h: 4, minW: 2, minH: 3 },
  defaultConfig: { hour12: false, showSeconds: true },
  component: ClockWidget,
  configSchema: [
    {
      key: "hour12",
      label: "12-hour clock",
      description: "Show AM/PM instead of 24-hour time.",
      type: "boolean",
    },
    { key: "showSeconds", label: "Show seconds", type: "boolean" },
  ],
  migrateConfig: (raw) => {
    const value = (raw ?? {}) as Partial<ClockConfig>;
    return {
      hour12: Boolean(value.hour12),
      showSeconds: value.showSeconds ?? true,
    };
  },
});
