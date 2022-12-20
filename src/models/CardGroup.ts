import { CardParentBase } from "~/interfaces/CardParentBase";
import { CardNumber, Suites } from "../enums/CardTypes";
import { Card } from "./Card";
import { GameObject } from "./GameObject";

export class CardGroup extends GameObject implements CardParentBase {

    public allowAnyType;
    public suite: Suites;
    public cards: Card[] = [];
    public path: Path2D;

    private ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D, type: Suites, allowAnyType = true) {
        super(x, y, Card.Height, Card.Width);
        this.suite = type;
        this.ctx = ctx;
        this.allowAnyType = allowAnyType;
        this.path = new Path2D();
        this.path.rect(this.x, this.y, this.width, this.height);
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
        const newX = this.x;
        const newY = this.cards.length === 0 || !this.allowAnyType ? this.y : this.y + Card.Offset * this.cards.length;
        card.move(newX, newY);
        card.parent = this;
        this.cards.push(card);
    }

    public remove(): Card | undefined {
        if (this.cards.length === 0) return undefined;
        const card: Card = this.cards[this.cards.length - 1] as Card;
        this.cards.pop();
        this.flipCardBeneath();
        return card;
    }

    public flipCardBeneath() {
        if (this.cards.length === 0) return;
        const card: Card = this.cards[this.cards.length - 1] as Card;
        if (!card.showFace) card.showFace = true;
     }

    public canCardBePlacedFinal(card: Card): boolean {
        if (this.cards.length === 0 && card.cardNumber === CardNumber.ace) {
            this.suite = card.suite;
            return true;
        } else if (this.cards.length) {
            if (card.suite !== this.suite) return false;

            if (card.cardNumber === this.cards[this.cards.length - 1].cardNumber + 1) {
                return true;
            }
        }

        return false;
    }

    public canCardBePlacedPlaying(card: Card): boolean {
        if (this.cards.length === 0 && card.cardNumber === CardNumber.king) {
            return true;
        } else if (this.cards.length) {
            const checkingCard = this.cards[this.cards.length - 1];
            if (checkingCard.cardColor === card.cardColor) return false;

            if (checkingCard.cardNumber - 1 === card.cardNumber) {
                return true;
            }
        }

        return false;
    }

    public getCardsBelow(card: Card): Card[] {
        const tempArray: Card[] = [];
        const index = this.cards.indexOf(card);
        if (index < this.cards.length - 1) {
            for (let i = index; i <=  this.cards.length - 1; i++) {
                this.cards[i].setPrevious();
                tempArray.push(this.cards[i]);
            }
        }
        return tempArray;
    }

    public getCardsAbove(card: Card): Card[] {
        return [card];
    }

    private drawSingleCard(): void {
        this.cards[0].draw();
    }

    private drawStackedCard(): void {
        for (let i = 0; i <= this.cards.length - 1; i++) {
            const card = this.cards[i];
            card.draw(i < this.cards.length - 1);
        }
    }

    private drawOutLine(): void {
        this.ctx.save();
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(this.x, this.y, Card.Width, Card.Height)
        this.ctx.restore();
    }
}