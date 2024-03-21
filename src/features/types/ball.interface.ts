export interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	color: string;
	draw: (ctx: CanvasRenderingContext2D) => void;
}
