import React, { ForwardedRef, forwardRef, useEffect } from "react";
import styled from "./canvas.module.css";

interface CanvasProps {
	width: number;
	height: number;
}

const Canvas = forwardRef(function Canvas(
	{ height, width }: CanvasProps,
	ref: ForwardedRef<HTMLCanvasElement>
) {
	return (
		<canvas ref={ref} className={styled.canvas} height={height} width={width} />
	);
});

export default Canvas;
