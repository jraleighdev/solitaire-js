import { CardNumber, Suites } from "../enums/CardTypes";
import { Card } from "./Card";
import { GameObject } from "./GameObject";

export class CardDeck extends GameObject {
    
    public cards: Card[] = [];

    constructor(x: number, y: number, private ctx: CanvasRenderingContext2D) {
        super(x, y, Card.Height, Card.Width);
        this.rebuildDeck();
    }

    rebuildDeck(): void {
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
            tempArray.push(new Card(suite, cardNumber, this.x, this.y, this.ctx));
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
            this.cards[this.cards.length - 1].draw();
        }
    }

    removeCard(): Card | undefined {
        if (this.cards.length === 0) return undefined;
        const card: Card = this.cards[this.cards.length - 1] as Card;
        this.cards.pop();
        return card;
    }
}