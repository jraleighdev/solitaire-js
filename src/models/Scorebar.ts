import { Button } from "./Button";
import { Game } from "./Game";

export class ScoreBar {
    public static readonly Height = 60;
    public static readonly Color = '#35792c';
    public static readonly FontColor = 'white';
    public static readonly Font = '30px Arial';
    public static readonly FontSize = 20;
    public static readonly ButtonWidth = 40;
    public static readonly ButtonHeight = 40;
    public static readonly ButtonColor = '#254620';

    public restartImage: HTMLImageElement = document.getElementById('restart') as HTMLImageElement;

    public restartButton: Button;

    get Score(): number {
        return this._score;
    }

    set Score(value: number) {
        this._score = value;
    }

    private _score = 0;

    constructor(private ctx: CanvasRenderingContext2D) {
        this.restartButton = new Button(
            ScoreBar.ButtonColor, 
            20, 
            (ScoreBar.Height / 2) - (ScoreBar.ButtonHeight / 2), 
            ScoreBar.ButtonWidth, ScoreBar.ButtonHeight,
            this.ctx,
            this.restart,
            this.restartImage);

        this.addEventListener();
    }   

    draw(): void {
        this.drawBackGround();
        this.drawScore();
        this.restartButton.draw();
    }

    private drawScore(): void {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial'
        this.ctx.fillText(`Score: ${this.Score.toString()}`, Game.Width / 2, ScoreBar.Height / 2 + ScoreBar.FontSize / 2);
        this.ctx.restore();
    }

    private drawBackGround(): void {
        this.ctx.save();
        this.ctx.fillStyle = ScoreBar.Color;
        this.ctx.fillRect(0, 0, Game.Width, ScoreBar.Height);
        this.ctx.restore();
    }

    private restart(): void {
        console.log('hello');
    }

    private addEventListener(): void {
        // mouse hover
        this.ctx.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.ctx.isPointInPath(this.restartButton.path, event.offsetX, event.offsetY)) {
                this.restartButton.hover();
            } else {
                this.restartButton.hoverLeave();
            }
        });

        // mouse click
        this.ctx.canvas.addEventListener('click', (event: MouseEvent) => {
            if (this.ctx.isPointInPath(this.restartButton.path, event.offsetX, event.offsetY)) {
                this.restartButton.click();
            }
        })
    }
}