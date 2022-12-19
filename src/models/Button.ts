import { GameObject } from "./GameObject";

export class Button extends GameObject {

    public hoverColor = '#203657'

    public path: Path2D;
    public color: string;

    private action: Function;
    private currentColor: string;
    private image: HTMLImageElement;
    private readonly imageOffset = 2;

    constructor(color: string, x: number, y: number, height: number, width: number, private ctx: CanvasRenderingContext2D, action: Function, image: HTMLImageElement) {
        super(x, y, height, width)
        this.color = color;
        this.currentColor = color;
        this.path = new Path2D();
        this.path.rect(x, y, width, height);
        this.action = action;
        this.image = image;
    }

    draw(): void {
        this.ctx.save();
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fill(this.path);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke(this.path)
        this.ctx.drawImage(
            this.image,
            this.x + this.imageOffset,
            this.y + this.imageOffset,
            this.width - this.imageOffset * 2,
            this.height - this.imageOffset * 2
        )
        this.ctx.restore();
    }

    click() {
        this.action();
    }

    hover() {
        this.currentColor = this.hoverColor;
    }

    hoverLeave() {
        this.currentColor = this.color;
    }
}