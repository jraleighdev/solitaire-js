import { Point } from "../interfaces/Point";

export class GameObject {
    
    public x: number;

    public y: number;

    public height: number;

    public width: number;

    get bottomLeftPoint(): Point {
        return { x: this.x, y: this.y + this.height }
    }

    get topLeftPoint(): Point {
        return { x: this.x, y: this.y }
    }

    get topRightPoint(): Point {
        return { x: this.x + this.width, y: this.y}
    }

    get bottomRightPoint(): Point {
        return { x: this.x + this.width, y: this.y + this.height }
    }

    get topCenterPoint(): Point {
        return { x: this.x + this.width / 2, y: this.y }
    }

    get centerPoint(): Point {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 }
    }

    constructor(
        x: number,
        y: number,
        height: number,
        width: number
    ) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    visualizePoints(ctx: CanvasRenderingContext2D) {
        this.arc(ctx, this.bottomLeftPoint);
        this.arc(ctx, this.bottomRightPoint);
        this.arc(ctx, this.topRightPoint);
        this.arc(ctx, this.topLeftPoint);
        this.arc(ctx, this.topCenterPoint);
    }

    private arc(ctx: CanvasRenderingContext2D, point: Point) {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

}