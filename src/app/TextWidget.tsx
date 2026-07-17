"use client";

import type { CSSProperties, MouseEventHandler, ReactNode, Ref } from "react";

type TextWidgetProps = {
  className?: string;
  style?: CSSProperties;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  onMouseUp?: MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  children?: ReactNode;
  isLocked?: boolean;
  onLock?: MouseEventHandler<HTMLButtonElement>;
  ref?: Ref<HTMLDivElement>;
};

export default function TextWidget({
  className,
  style,
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  children,
  isLocked = false,
  onLock,
  ref,
}: TextWidgetProps) {
  return (
    <div
      ref={ref}
      style={style}
      className={className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex h-full w-full flex-col bg-slate-400 p-2">
        <span>Is locked: {isLocked ? "true" : "false"}</span>
        <button
          type="button"
          className="mt-2 border border-slate-500 bg-[var(--accent-muted)] px-2 py-1"
          onClick={onLock}
        >
          Lock
        </button>
        {children}
      </div>
    </div>
  );
}
