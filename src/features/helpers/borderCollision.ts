import { Ball } from "features/types/ball.interface";

export const borderCollision = (ball: Ball, canvas: HTMLCanvasElement) => {
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
