import React, { ForwardedRef, forwardRef } from "react";
import styled from "./canvas.module.css";

interface CanvasProps {
	width: number;
	height: number;
	onMouseMove: ((e: any) => void) | undefined;
	onMouseDown: (e: any) => void;
	onMouseUp: (e: any) => void;
}

const Canvas = forwardRef(function Canvas(
	{ height, width, onMouseMove, onMouseUp, onMouseDown }: CanvasProps,
	ref: ForwardedRef<HTMLCanvasElement>
) {
	return (
		<canvas
			ref={ref}
			className={styled.canvas}
			height={height}
			width={width}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onMouseDown={onMouseDown}
		/>
	);
});

export default Canvas;
