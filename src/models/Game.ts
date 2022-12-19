import { CardNumber, Suites } from "../enums/CardTypes";
import { Point } from "../interfaces/Point";
import { Card } from "./Card";
import { CardDeck } from "./CardDeck";
import { CardGroup } from "./CardGroup";
import { ScoreBar } from "./Scorebar";

export class Game {

    public static Height = 1000;
    public static Width = 1400;

    public static readonly Margin = 40;
    
    public scoreBar: ScoreBar;
    public deck: CardDeck;
    public playingGroups: CardGroup[] = [];
    public finishingGroups: CardGroup[] = [];
    public moveableCards: Card[] = [];

    deckLocation: Point = { x: Game.Margin, y: ScoreBar.Height + Game.Margin }

    constructor(private ctx: CanvasRenderingContext2D) {
        this.scoreBar = new ScoreBar(ctx);
        this.deck = new CardDeck(this.deckLocation.x, this.deckLocation.y, ctx);

        const playingGroupsCount = 7;
        const finishingGroupCount = 4;

        for (let i = 1; i <= playingGroupsCount; i++) {
            const updatedX = i === 1 ? this.deckLocation.x : this.deckLocation.x + (Card.Width + Game.Margin) * (i - 1);
            this.playingGroups.push(new CardGroup(updatedX, this.deckLocation.y + Game.Margin + Card.Height, ctx, Suites.club,true))
        }

        const startXOfFinishingGroup = this.playingGroups[3].x;

        for (let i = 1; i <= finishingGroupCount; i++) {
            const updatedX = i === 1 ? startXOfFinishingGroup : startXOfFinishingGroup + (Card.Width + Game.Margin) * (i - 1);
            this.finishingGroups.push(new CardGroup(updatedX, this.deckLocation.y, ctx, i - 1, false))
        }

        Game.Width = Game.Margin + this.playingGroups[this.playingGroups.length - 1].bottomRightPoint.x;
        ctx.canvas.width = Game.Width;

        this.initializeCards();

        this.addEventListener();
    }

    initializeCards(): void {
        let numberOfCards = 7;
        for (let i = this.playingGroups.length - 1; i >= 0; i--) {
            const group = this.playingGroups[i];
            for (let j = 1; j <= numberOfCards; j++) {
                const newCard = this.deck.removeCard() as Card;
                group.add(newCard);
            }
            numberOfCards--;
        }

        this.checkMovableCards();
    }

    checkMovableCards(): void {
        this.moveableCards.slice(0);
        this.playingGroups.forEach(group => {
            this.moveableCards.push(group.cards[group.cards.length - 1]);
        });
        console.log(this.moveableCards);
    }

    draw(): void {
        this.ctx.fillStyle = '#66c05a';
        this.ctx.fillRect(0, 0, Game.Width, Game.Height);
        this.scoreBar.draw();
        this.deck.draw();
        this.playingGroups.forEach(x => x.draw())
        this.finishingGroups.forEach(x => x.draw())
    }

    test(): void {
        this.finishingGroups.forEach(group => {
            const card = new Card(group.suite, CardNumber.ace, group.x, group.y, this.ctx);
            card.showFace = true;
            group.cards.push(card);
        });

        const group = this.playingGroups[0];

        group.add(new Card(group.suite, CardNumber.ace, 0, 0, this.ctx));
        group.add(new Card(group.suite, CardNumber.ace, 0, 0, this.ctx));
        group.add(new Card(group.suite, CardNumber.ace, 0, 0, this.ctx))
    }

    public previousPoint: Point = {x: 0, y: 0}
    public cardOriginalLocation: Point = { x: 0, y: 0}

    private addEventListener(): void {
        this.ctx.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            this.moveableCards.forEach(card => {
                if (this.ctx.isPointInPath(card.path, event.offsetX, event.offsetY)) {
                    this.previousPoint = { x: event.x, y: event.y };
                    this.cardOriginalLocation = {x: card.x, y: card.y};
                    card.isDragging = true;
                    console.log('mouse down');
                }
            })
        });

        this.ctx.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const draggableCard = this.moveableCards.find(x => x.isDragging);
            if (draggableCard) {
                draggableCard.x = event.x - draggableCard.width / 2;
                draggableCard.y = event.y - draggableCard.height / 2;
            }
            this.draw();
            draggableCard?.draw();
        })

        this.ctx.canvas.addEventListener('mouseup', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const draggableCard = this.moveableCards.find(x => x.isDragging);
            if (draggableCard) {

                

                draggableCard.x = this.cardOriginalLocation.x;
                draggableCard.y = this.cardOriginalLocation.y;
            }

            this.moveableCards.forEach(x => x.isDragging = false);
        });
    }

}