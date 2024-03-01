"use client";

import { MouseEventHandler, useRef, useState } from "react";
import ReactGridLayout, { Layout, WidthProvider } from "react-grid-layout";
import TextWidget from "./TextWidget";

var gridItems: Layout[] = [
	{
		i: "n0",
		x: 0,
		y: Infinity, // puts it at the bottom
		w: 4,
		h: 4,
		static: false,
	},
];
const DecoratedReactGridLayout = WidthProvider(ReactGridLayout);
var ref: React.RefObject<HTMLDivElement>;

export default function Home() {
	var ref = useRef<HTMLDivElement>(null);

	const [edit, setEdit] = useState(false);
	const [grid, setGrid] = useState(gridItems);
	const [counter, setCounter] = useState(1);

	function addElement() {
		let el: Layout;
		el = {
			i: "n" + counter + 1,
			x: 0,
			y: Infinity, // puts it at the bottom
			w: 4,
			h: 4,
			static: false,
		};
		setCounter(counter + 1);
		setGrid(grid.concat([el]));
	}

	function changeLayoutPosition(newLayouts: Layout[]): void {
		grid.forEach((el) => {
			newLayouts.forEach((layout) => {
				if (el.i == layout.i) {
					el.x = layout.x;
					el.y = layout.y;
					el.w = layout.w;
					el.h = layout.h;
				}
			});
		});
		setGrid(grid);
	}

	function createWidget(el: Layout, onLock: MouseEventHandler): any {
		return (
			<TextWidget
				key={el.i}
				data-grid={el}
				ref={ref}
				onLock={(e) => {
					onLock(e);
				}}
				isLocked={el.static}
			></TextWidget>
		);
	}

	function toggleLock(el: Layout): void {
		grid.forEach((gel) => {
			if (gel.i == el.i) {
				gel.static = !el.static;
			}
			setGrid(grid);
		});
	}

	return (
		<main className="">
			<div className="flex flex-row gap-3 pb-4">
				<span>Edit Mode is {edit ? "enabled" : "disabled"}</span>
				<button className="border-t-neutral-500 bg-slate-300" onClick={() => setEdit(!edit)}>
					Toggle Edit
				</button>
				<button
					className="border-t-neutral-500 bg-slate-300"
					onClick={() => addElement()}>
					Add
				</button>
			</div>
			<DecoratedReactGridLayout
				className="layout min-h-screen bg-white"
				cols={20}
				rowHeight={10}
				maxRows={100}
				compactType={"vertical"}
				measureBeforeMount={false}
				isDraggable={edit}
				isResizable={edit}
				isBounded={false}
				allowOverlap={false}
				onLayoutChange={(newLayouts: Layout[]) => {
					changeLayoutPosition(newLayouts);
				}}
				innerRef={ref}
			>
				{grid.map((el: Layout) =>
					createWidget(el, (e) => {
						toggleLock(el);
					})
				)}
			</DecoratedReactGridLayout>
		</main>
	);
}
