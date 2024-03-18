import React, { useRef, useEffect } from "react";
import Canvas from "shared/Canvas";

interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	color: string;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

interface BilliardProps {
	width: number;
	height: number;
}

const draw = (
	ctx: CanvasRenderingContext2D | null,
	balls: Ball[],
	canvas: HTMLCanvasElement
) => {
	if (!ctx) return;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.stroke();

	balls.forEach((ball) => {
		ball.x += ball.vx;
		ball.y += ball.vy;
		if (
			ball.y + ball.radius + ball.vy > canvas.height ||
			ball.y - ball.radius + ball.vy < 0
		) {
			ball.vy = -ball.vy;
		}
		if (
			ball.x + ball.radius + ball.vx > canvas.width ||
			ball.x - ball.radius + ball.vx < 0
		) {
			ball.vx = -ball.vx;
		}
		ball.draw(ctx);
	});
};

const Billiard: React.FC<BilliardProps> = ({ width, height }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafRef = useRef<number>(0);

	const ballsRef = useRef<Ball[]>([
		{
			x: 200,
			y: 200,
			vx: 0,
			vy: 0,
			radius: 25,
			color: "blue",
			draw: function (ctx: CanvasRenderingContext2D) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = this.color;
				ctx.fill();
			},
		},
	]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (!canvas || !ctx) return;
		const animationLoop = () => {
			draw(ctx, ballsRef.current, canvas);
			rafRef.current = requestAnimationFrame(animationLoop);
		};

		animationLoop();
		return () => {
			cancelAnimationFrame(rafRef.current);
		};
	}, []);

	return <Canvas ref={canvasRef} width={width} height={height} />;
};

export default Billiard;
