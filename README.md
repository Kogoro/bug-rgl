# bug-rgl

A small [Next.js](https://nextjs.org/) App Router playground for [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout).

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS 4
- react-grid-layout 2 (hooks API)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Notes

Use **Toggle Edit** to enable drag/resize, **Add** to insert widgets, and **Lock** on a widget to mark it static.

## Pluggable Dashboard POC

A proof-of-concept dashboard with **registry-driven, pluggable widgets** lives at
[`/dashboard`](http://localhost:3000/dashboard). It is built on
[shadcn/ui](https://ui.shadcn.com/) components and `react-grid-layout`.

### Try it

- Open `/dashboard`, toggle **Edit mode**.
- **Add widget** opens a catalog rendered straight from the registry.
- Drag widgets by their header, resize from the corner, **lock** (make static) or
  **remove** them. Layout and per-widget config persist to `localStorage`.

### Architecture

The dashboard shell and the widgets are decoupled by a registry — neither imports
the other. Everything lives under `src/dashboard/`:

| Concern | File | Responsibility |
| --- | --- | --- |
| Contracts | `types.ts` | `WidgetDefinition`, `WidgetContext`, `DashboardItem`, `defineWidget()` |
| Catalog | `registry.ts` | `WidgetRegistry` + shared singleton |
| Widgets | `widgets/*.tsx` | Self-contained widgets authored via `defineWidget()` |
| Plug-in seam | `widgets/index.ts` | Registers built-in widgets into the registry |
| State | `use-dashboard.ts` | Items, layout, edit mode, config, persistence |
| Persistence | `storage.ts` | Versioned `localStorage` load/save with validation |
| Frame | `widget-frame.tsx` | Card chrome, drag handle, lock/remove actions |
| Catalog UI | `add-widget-sheet.tsx` | Add-widget palette (data from the registry) |
| Shell | `dashboard.tsx` | Toolbar + `react-grid-layout` grid |

### Add a new widget

1. Create `src/dashboard/widgets/my-widget.tsx` and export a definition:

   ```tsx
   export const myWidget = defineWidget<{ label: string }>({
     type: "my-widget",
     name: "My widget",
     description: "…",
     icon: SomeLucideIcon,
     defaultSize: { w: 4, h: 4, minW: 2, minH: 2 },
     defaultConfig: { label: "Hello" },
     component: ({ config }) => <div>{config.label}</div>,
   });
   ```

2. Add it to the `builtInWidgets` array in `widgets/index.ts`.

That's it — it appears in the catalog and can be placed, moved, resized, locked,
configured, and persisted with no changes to the shell.
