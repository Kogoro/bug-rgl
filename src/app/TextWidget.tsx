'use client';

import { ComponentPropsWithRef, ComponentPropsWithoutRef, MouseEventHandler, useRef, useState } from 'react';
import React from 'react';

type TextWidgetProps = {isLocked?:boolean, onLock?: MouseEventHandler};

const TextWidget = React.forwardRef((props: ComponentPropsWithRef<"div"> & TextWidgetProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    let { isLocked=false, style, className, onMouseDown, onMouseUp, onTouchEnd, children, onLock=null} = props;

	function handleLock(event: React.MouseEvent<Element, MouseEvent>) : void {
        if (onLock) {
			onLock(event)
		}
	}

    return (
		<div style={{...style}} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd} className={className}>
			<div className="bg-slate-400 h-full w-full flex flex-col">
				<span>Is locked: {isLocked? "true":"false"}</span>
                <button className='border-t-neutral-500 bg-slate-300'
                onClick={handleLock}
                >Lock</button>
				{children}
			</div>
        </div>
	);
});
TextWidget.displayName = "TextWidget";
export default TextWidget;
