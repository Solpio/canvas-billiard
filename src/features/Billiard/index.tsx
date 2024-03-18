import React, { useRef, useEffect, useState } from "react";
import Canvas from "shared/Canvas";

const friction = 0.99;
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

const borderCollision = (ball: Ball, canvas: HTMLCanvasElement) => {
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
};

const draw = (
	ctx: CanvasRenderingContext2D | null,
	balls: Ball[],
	canvas: HTMLCanvasElement,
	cueStickStart: { x: number; y: number } | null,
	cueStickEnd: { x: number; y: number } | null
) => {
	if (!ctx) return;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.stroke();

	balls.forEach((ball) => {
		ball.vx *= friction;
		ball.vy *= friction;

		ball.x += ball.vx;
		ball.y += ball.vy;

		borderCollision(ball, canvas);
		ball.draw(ctx);
	});

	if (cueStickStart && cueStickEnd) {
		ctx.beginPath();
		ctx.moveTo(cueStickStart.x, cueStickStart.y);
		ctx.lineTo(cueStickEnd.x, cueStickEnd.y);
		ctx.strokeStyle = "white";
		ctx.stroke();
	}
};

const Billiard: React.FC<BilliardProps> = ({ width, height }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [cueStickStart, setCueStickStart] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [cueStickEnd, setCueStickEnd] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const rafRef = useRef<number>(0);
	const clickedIndex = useRef(-1);

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
			draw(ctx, ballsRef.current, canvas, cueStickStart, cueStickEnd);
			rafRef.current = requestAnimationFrame(animationLoop);
		};
		console.log(cueStickStart, cueStickEnd);
		animationLoop();
		return () => {
			cancelAnimationFrame(rafRef.current);
		};
	}, [cueStickStart, cueStickEnd]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (!canvas || !ctx) return;
		const handleMouseDown = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			const clickedBallIndex = ballsRef.current.findIndex((ball) => {
				const dx = ball.x - mouseX;
				const dy = ball.y - mouseY;
				return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
			});
			if (clickedBallIndex !== -1) {
				clickedIndex.current = clickedBallIndex;
				ballsRef.current[clickedBallIndex].vy = 0;
				ballsRef.current[clickedBallIndex].vx = 0;
				setCueStickStart({
					x: ballsRef.current[clickedBallIndex].x,
					y: ballsRef.current[clickedBallIndex].y,
				});
			}
			canvas.addEventListener("mousemove", handleMouseMove);
		};

		const handleMouseMove = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			setCueStickEnd({
				x: mouseX,
				y: mouseY,
			});
		};

		const handleMouseUp = () => {
			if (clickedIndex.current > -1) {
				clickedIndex.current = -1;
				setCueStickStart(null);
				setCueStickEnd(null);
			}
			canvas.removeEventListener("mousemove", handleMouseMove);
		};
		canvas.addEventListener("mouseup", handleMouseUp);
		canvas.addEventListener("mousedown", handleMouseDown);
		return () => {
			canvas.removeEventListener("mouseup", handleMouseUp);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mousedown", handleMouseDown);
			cancelAnimationFrame(rafRef.current);
		};
	}, []);

	return <Canvas ref={canvasRef} width={width} height={height} />;
};

export default Billiard;
