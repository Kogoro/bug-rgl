"use client";

import type { Layout, LayoutItem } from "react-grid-layout";
import ReactGridLayout, {
  useContainerWidth,
  verticalCompactor,
} from "react-grid-layout";
import { useState } from "react";
import TextWidget from "./TextWidget";

const INITIAL_LAYOUT: LayoutItem[] = [
  {
    i: "n0",
    x: 0,
    y: Infinity,
    w: 4,
    h: 4,
    static: false,
  },
];

export default function Home() {
  const { width, containerRef, mounted } = useContainerWidth();
  const [edit, setEdit] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>(INITIAL_LAYOUT);

  function addElement() {
    setLayout((items) => {
      const nextId = items.length;
      return [
        ...items,
        {
          i: `n${nextId}`,
          x: 0,
          y: Infinity,
          w: 4,
          h: 4,
          static: false,
        },
      ];
    });
  }

  function handleLayoutChange(nextLayout: Layout) {
    setLayout([...nextLayout]);
  }

  function toggleLock(id: string) {
    setLayout((items) =>
      items.map((item) =>
        item.i === id ? { ...item, static: !item.static } : item,
      ),
    );
  }

  return (
    <main className="min-h-screen p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="mb-4 flex flex-row items-center gap-3">
        <span>Edit mode is {edit ? "enabled" : "disabled"}</span>
        <button
          type="button"
          className="border border-slate-400 bg-[var(--accent-muted)] px-3 py-1"
          onClick={() => setEdit((value) => !value)}
        >
          Toggle Edit
        </button>
        <button
          type="button"
          className="border border-slate-400 bg-[var(--accent-muted)] px-3 py-1"
          onClick={addElement}
        >
          Add
        </button>
      </div>

      <div ref={containerRef} className="min-h-screen bg-[var(--surface)]">
        {mounted && (
          <ReactGridLayout
            className="layout"
            width={width}
            layout={layout}
            gridConfig={{ cols: 20, rowHeight: 10, maxRows: 100 }}
            dragConfig={{ enabled: edit, bounded: false }}
            resizeConfig={{ enabled: edit }}
            compactor={verticalCompactor}
            onLayoutChange={handleLayoutChange}
          >
            {layout.map((item) => (
              <TextWidget
                key={item.i}
                isLocked={Boolean(item.static)}
                onLock={() => toggleLock(item.i)}
              />
            ))}
          </ReactGridLayout>
        )}
      </div>
    </main>
  );
}
