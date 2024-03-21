import React, { useRef, useEffect, useState } from "react";
import Canvas from "shared/Canvas";
import { Ball } from "features/types/ball.interface";
import { calculateBilliardPositions } from "features/helpers/calculateBillardPositions";
import { borderCollision } from "features/helpers/borderCollision";

const friction = 0.99;

interface BilliardProps {
	width: number;
	height: number;
}

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

	balls.forEach((ball, index) => {
		ball.vx *= friction;
		ball.vy *= friction;

		ball.x += ball.vx;
		ball.y += ball.vy;
		borderCollision(ball, canvas);
		for (let j = 0; j < balls.length; j++) {
			const dx = balls[index].x - balls[j].x;
			const dy = balls[index].y - balls[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (index !== j && distance < balls[index].radius + balls[j].radius) {
				const ball1 = ball;
				const ball2 = balls[j];
				const dx = ball2.x - ball1.x;
				const dy = ball2.y - ball1.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Check if balls are colliding
				if (distance < ball1.radius + ball2.radius) {
					// Calculate collision normal
					const nx = dx / distance;
					const ny = dy / distance;

					// Calculate relative velocity
					const dvx = ball2.vx - ball1.vx;
					const dvy = ball2.vy - ball1.vy;
					const dotProduct = nx * dvx + ny * dvy;

					// Apply impulse
					const impulse =
						(2 * dotProduct) / (1 / ball1.radius + 1 / ball2.radius);
					ball1.vx += (impulse * nx) / ball1.radius;
					ball1.vy += (impulse * ny) / ball1.radius;
					ball2.vx -= (impulse * nx) / ball2.radius;
					ball2.vy -= (impulse * ny) / ball2.radius;

					// Separate balls to prevent overlap
					const overlap = (ball1.radius + ball2.radius - distance) / 2;
					const sepX = overlap * nx;
					const sepY = overlap * ny;

					ball1.x -= sepX;
					ball1.y -= sepY;
					ball2.x += sepX;
					ball2.y += sepY;

					// Ensure balls are not overlapping
					while (
						Math.sqrt((ball2.x - ball1.x) ** 2 + (ball2.y - ball1.y) ** 2) <
						ball1.radius + ball2.radius
					) {
						ball1.x -= sepX / 10;
						ball1.y -= sepY / 10;
						ball2.x += sepX / 10;
						ball2.y += sepY / 10;
					}
				}
			}
		}

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
	const [cueStickPosition, setCueStickPosition] = useState<{
		start: { x: number; y: number } | null;
		end: { x: number; y: number } | null;
	}>({ start: null, end: null });
	const rafRef = useRef<number>(0);
	const clickedIndex = useRef(-1);

	const ballsRef = useRef<Ball[]>([
		{
			x: 200,
			y: 200,
			vx: 0,
			vy: 0,
			radius: 25,
			color: "white",
			draw: function (ctx: CanvasRenderingContext2D) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fillStyle = this.color;
				ctx.fill();
			},
		},
		...calculateBilliardPositions(5, 50, 600, 150),
	]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");

		if (!canvas || !ctx) return;
		const animationLoop = () => {
			draw(
				ctx,
				ballsRef.current,
				canvas,
				cueStickPosition.start,
				cueStickPosition.end
			);
			rafRef.current = requestAnimationFrame(animationLoop);
		};
		animationLoop();
		return () => {
			cancelAnimationFrame(rafRef.current);
		};
	}, [cueStickPosition.end, cueStickPosition.start]);

	const handleMouseMove = (event: MouseEvent) => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			setCueStickPosition((prev) => ({
				...prev,
				end: { x: mouseX, y: mouseY },
			}));
		}
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
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
				setCueStickPosition({
					start: {
						x: ballsRef.current[clickedBallIndex].x,
						y: ballsRef.current[clickedBallIndex].y,
					},
					end: null,
				});
			}
		}
	};

	const handleMouseUp = () => {
		if (
			clickedIndex.current > -1 &&
			cueStickPosition.start &&
			cueStickPosition.end
		) {
			const dx = cueStickPosition.start.x - cueStickPosition.end.x;
			const dy = cueStickPosition.start.y - cueStickPosition.end.y;
			const force = 0.1; // Adjust as needed
			const velocityX = dx * force;
			const velocityY = dy * force;
			ballsRef.current[clickedIndex.current].vx = velocityX;
			ballsRef.current[clickedIndex.current].vy = velocityY;
			clickedIndex.current = -1;
			setCueStickPosition({ start: null, end: null });
		}
	};

	return (
		<Canvas
			ref={canvasRef}
			width={width}
			height={height}
			onMouseMove={
				cueStickPosition.start?.x && cueStickPosition.start.y
					? handleMouseMove
					: undefined
			}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		/>
	);
};

export default Billiard;
