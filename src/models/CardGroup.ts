import { Suites } from "../enums/CardTypes";
import { Card } from "./Card";
import { GameObject } from "./GameObject";

export class CardGroup extends GameObject {

    public allowAnyType;
    public suite: Suites;
    public cards: Card[] = [];

    private ctx: CanvasRenderingContext2D;
    private cardOffset = 20;
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, type: Suites, allowAnyType = true) {
        super(x, y, Card.Height, Card.Width);
        this.suite = type;
        this.ctx = ctx;
        this.allowAnyType = allowAnyType;
    }

    draw() {
        if (this.cards.length > 0) {
            if (this.allowAnyType) {
                this.drawStackedCard();
            } else {
                this.drawSingleCard();
            }
        } else {
            this.drawOutLine();
        }
    }   

    public add(card: Card): void {
        card.x = this.x;
        card.y = this.cards.length === 0 ? this.y : this.y + this.cardOffset * this.cards.length;
        this.cards.push(card);
    }

    public remove(): Card | undefined {
        if (this.cards.length === 0) return undefined;
        const card: Card = this.cards[this.cards.length - 1] as Card;
        this.cards.pop();
        return card;
    }

    private drawSingleCard(): void {
        this.cards[0].draw();
    }

    private drawStackedCard(): void {
        for (let i = 0; i <= this.cards.length - 1; i++) {
            const card = this.cards[i];
            card.showFace = i === this.cards.length - 1;
            card.draw();
        }
    }

    private drawOutLine(): void {
        this.ctx.save();
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(this.x, this.y, Card.Width, Card.Height)
        this.ctx.restore();
    }
}