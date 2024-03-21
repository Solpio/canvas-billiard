import { Ball } from "features/types/ball.interface";

export function calculateBilliardPositions(
	numRows: number,
	spacing: number,
	initialX: number,
	initialY: number
): Ball[] {
	const balls: Ball[] = [];

	for (let row = 0; row < numRows; row++) {
		const numBallsInRow = row + 1;
		const rowSpacing = spacing * row;
		const startX = initialX - rowSpacing / 2;
		const startY = initialY + spacing * row;

		for (let i = 0; i < numBallsInRow; i++) {
			const x = startX + i * spacing;
			const y = startY;
			balls.push({
				x,
				y,
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
			});
		}
	}

	return balls;
}
