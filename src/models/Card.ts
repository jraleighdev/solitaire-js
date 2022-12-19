
import { CardColor } from "../enums/CardColor";
import { CardNumber, Suites } from "../enums/CardTypes";
import { GameObject } from "./GameObject";

export class Card extends GameObject {

    public static readonly Width = 100;
    public static readonly Height = 200;

    public path: Path2D;
    public suite: Suites;
    public cardNumber: CardNumber;
    public cardColor: CardColor;
    public showFace = false;
    public isDragging = false;

    private faceImage: HTMLImageElement;
    private backImage: HTMLImageElement;
    private ctx: CanvasRenderingContext2D;

    constructor(
        suite: Suites,
        cardNumber: CardNumber,
        x: number,
        y: number,
        ctx: CanvasRenderingContext2D) {
        super(x, y, Card.Height, Card.Width)
        this.path = new Path2D();
        this.path.rect(x, y, this.width, this.height);
        this.suite = suite;
        this.cardNumber = cardNumber;
        this.ctx = ctx;

        switch (this.suite) {
            case (Suites.club):
                this.faceImage = document.getElementById('club') as HTMLImageElement;
                this.cardColor = CardColor.black;
                break;
            case (Suites.spade):
                this.faceImage = document.getElementById('spade') as HTMLImageElement;
                this.cardColor = CardColor.black;
                break;
            case (Suites.heart):
                this.faceImage = document.getElementById('heart') as HTMLImageElement;
                this.cardColor = CardColor.red;
                break;
            case (Suites.diamond):
                this.faceImage = document.getElementById('diamond') as HTMLImageElement;
                this.cardColor = CardColor.red;
                break;
        }

        this.backImage = document.getElementById('cardBack') as HTMLImageElement;
    }

    draw(): void {
        this.path = new Path2D();
        this.path.rect(this.x, this.y, this.width, this.height);
        if (this.showFace) {
            this.drawFace();
        } else {
            this.drawBack();
        }
    }

    drawFace(): void {
        const xOffset = Card.Width / 2;
        const yOffset = Card.Height / 2.5;
        const offsetLeft = 10;
        const offsetRight = 30;
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
        this.ctx.drawImage(
            this.faceImage,
            this.x + xOffset / 2,
            this.y + yOffset / 2,
            this.width - xOffset,
            this.height - yOffset
        );
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px times new roman'
        this.ctx.fillText(this.cardMap[this.cardNumber], this.topLeftPoint.x + offsetLeft, this.topLeftPoint.y + offsetRight)
        this.ctx.fillText(this.cardMap[this.cardNumber], this.bottomRightPoint.x - offsetRight, this.bottomRightPoint.y - offsetLeft)
        this.ctx.restore();
    }

    drawBack(): void {
        const backImageOffset = Card.Width / 3;

        this.ctx.save();
        this.ctx.fillStyle = '#194383';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.ctx.drawImage(
            this.backImage,
            this.x + backImageOffset / 2,
            this.y + backImageOffset / 2,
            this.width - backImageOffset,
            this.height - backImageOffset
        );
        this.ctx.restore();
    }

    click() {

    }

    hover() {

    }

    hoverLeave() {

    }

    cardMap: Record<CardNumber, string> = {
        [CardNumber.ace]: 'A',
        [CardNumber.two]: '2',
        [CardNumber.three]: '3',
        [CardNumber.four]: '4',
        [CardNumber.five]: '5',
        [CardNumber.six]: '6',
        [CardNumber.seven]: '7',
        [CardNumber.eight]: '8',
        [CardNumber.nine]: '9',
        [CardNumber.ten]: '10',
        [CardNumber.jack]: 'J',
        [CardNumber.queen]: 'Q',
        [CardNumber.king]: 'K'
    }
}