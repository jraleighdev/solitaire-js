import { CardParentBase } from "~/interfaces/CardParentBase";
import { Point } from "~/interfaces/Point";
import { CardNumber, Suites } from "../enums/CardTypes";
import { Card } from "./Card";
import { Game } from "./Game";
import { GameObject } from "./GameObject";

export class CardDeck extends GameObject implements CardParentBase {
    
    public cards: Card[] = [];
    public deckPath: Path2D;
    public nextCardPath: Path2D;
    public nextCardStartPoint: Point;
    public displayCard: Card | undefined;

    constructor(x: number, y: number, private ctx: CanvasRenderingContext2D) {
        super(x, y, Card.Height, Card.Width);
        this.nextCardStartPoint = { x: this.x + Card.Width + Game.Margin, y: this.y }
        this.rebuildDeck();
        this.deckPath = new Path2D();
        this.deckPath.rect(x, y, Card.Width, Card.Height);
        this.nextCardPath = new Path2D();
        this.nextCardPath.rect(this.nextCardStartPoint.x, this.nextCardStartPoint.y, Card.Width, Card.Height);
    }

    rebuildDeck(): void {
        this.cards = [];
        const tempArray: Card[] = [];
        const numberOfCards = 52;
        const suiteCount = numberOfCards / 4;
        const secondGroup = suiteCount * 2;
        const thirdGoup = suiteCount * 3;
        for (let i = 1; i <= numberOfCards; i++) {
            let suite: Suites = Suites.club;
            let cardNumber; CardNumber;
            if (i <= suiteCount) {
                cardNumber = i;
                suite = Suites.club
            } else if (i > suiteCount && i <= secondGroup) {
                cardNumber = i - suiteCount;
                suite = Suites.diamond
            } else if (i > secondGroup && i <= thirdGoup) {
                cardNumber = i - secondGroup;
                suite = Suites.heart
            } else if (i > thirdGoup && i <= numberOfCards) {
                cardNumber = i - thirdGoup 
                suite = Suites.spade
            }
            tempArray.push(new Card(suite, cardNumber, this.x, this.y, this.ctx, this));
        }

        let currentIndex = tempArray.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [tempArray[currentIndex], tempArray[randomIndex]] = [
                tempArray[randomIndex], tempArray[currentIndex]];
        }

        this.cards.push(...tempArray);
    }

    draw() {
        if (this.cards.length == 0) { 
            this.ctx.strokeStyle = 'white';
            this.ctx.strokeRect(this.x, this.y, Card.Width, Card.Height)
        } else {
            this.cards[0].draw();
            this.displayCard?.draw();
        }
    }

    nextCard(): void {
        if (this.cards.length === 0) {
            return;
        }        
        for (let i = 0; i <= this.cards.length -1; i++) {
            const card = this.cards[i];
            card.move(this.x, this.y);
            card.showFace = false;
        }
        if (this.displayCard) {
            this.displayCard.move(this.x, this.y);
            this.displayCard.showFace = false;
            this.cards.unshift(this.displayCard);
        }

        this.displayCard = this.remove();
        if (this.displayCard) {
            this.displayCard.move(this.nextCardStartPoint.x, this.nextCardStartPoint.y);
            this.displayCard.showFace = true;
            this.displayCard.draw();
        }
    }

    getCardsAbove(card: Card): Card[] {
        return [card];
    }

    getCardsBelow(card: Card): Card[] {
        return [card];
    }

    add(card: Card): void {
        this.cards.push(card);
    }

    remove(): Card | undefined {
        if (this.cards.length === 0) return undefined;
        const card: Card = this.cards[this.cards.length - 1] as Card;
        this.cards.pop();
        return card;
    }
}