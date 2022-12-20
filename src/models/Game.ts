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

    public dragGroup: Card[] = [];

    deckLocation: Point = { x: Game.Margin, y: ScoreBar.Height + Game.Margin }



    constructor(private ctx: CanvasRenderingContext2D) {
        this.scoreBar = new ScoreBar(ctx);
        this.deck = new CardDeck(this.deckLocation.x, this.deckLocation.y, ctx);

        const playingGroupsCount = 7;
        const finishingGroupCount = 4;

        for (let i = 1; i <= playingGroupsCount; i++) {
            const updatedX = i === 1 ? this.deckLocation.x : this.deckLocation.x + (Card.Width + Game.Margin) * (i - 1);
            this.playingGroups.push(new CardGroup(updatedX, this.deckLocation.y + Game.Margin + Card.Height, ctx, Suites.club, true))
        }

        const startXOfFinishingGroup = this.playingGroups[3].x;

        for (let i = 1; i <= finishingGroupCount; i++) {
            const updatedX = i === 1 ? startXOfFinishingGroup : startXOfFinishingGroup + (Card.Width + Game.Margin) * (i - 1);
            this.finishingGroups.push(new CardGroup(updatedX, this.deckLocation.y, ctx, i - 1, false))
        }

        Game.Width = Game.Margin + this.playingGroups[this.playingGroups.length - 1].bottomRightPoint.x;
        ctx.canvas.width = Game.Width;
        ctx.canvas.height = Game.Height;

        this.initializeCards();

        this.addEventListener();
    }

    initializeCards(): void {
        let numberOfCards = 7;
        for (let i = this.playingGroups.length - 1; i >= 0; i--) {
            const group = this.playingGroups[i];
            for (let j = 1; j <= numberOfCards; j++) {
                const newCard = this.deck.remove() as Card;
                group.add(newCard);
            }
            group.cards[group.cards.length - 1].showFace = true;
            numberOfCards--;
        }

        this.checkMovableCards();
    }

    checkMovableCards(): void {
        this.moveableCards.splice(0);
        this.playingGroups.forEach(group => {
            if (group.cards.length > 0) {
                this.moveableCards.push(...group.cards.filter(x => x.showFace));
            }
        });
        if (this.deck.cards.length > 0 && this.deck.displayCard) {
            this.moveableCards.push(this.deck.displayCard);
        }
    }

    draw(): void {
        this.ctx.fillStyle = '#66c05a';
        this.ctx.fillRect(0, 0, Game.Width, Game.Height);
        this.scoreBar.draw();
        this.deck.draw();
        this.playingGroups.forEach(x => x.draw())
        this.finishingGroups.forEach(x => x.draw())
        this.checkMovableCards();
    }

    public previousPoint: Point = { x: 0, y: 0 }

    private addEventListener(): void {
        this.ctx.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            this.moveableCards.forEach(card => {
                if (this.ctx.isPointInPath(card.path, event.offsetX, event.offsetY)) {
                    this.previousPoint = { x: event.x, y: event.y };
                    card.mouseDown({ x: event.x, y: event.y });
                    card.setPrevious();
                    card.isDragging = true;
                    this.dragGroup = card.parent.getCardsBelow(card);
                    console.log(this.dragGroup);
                    this.draw();
                }
            })
        });

        this.ctx.canvas.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.ctx.isPointInPath(this.deck.deckPath, event.offsetX, event.offsetY)) {
                this.deck.nextCard();
                this.checkMovableCards();
            }
        })

        this.ctx.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const draggableCard = this.moveableCards.find(x => x.isDragging);
            if (draggableCard) {
                draggableCard.x = event.x - draggableCard.getMouseOffset().x;
                draggableCard.y = event.y - draggableCard.getMouseOffset().y;
                this.draw();
                draggableCard.draw();
                if (this.dragGroup.length > 1) {
                    for (let i = 1; i <= this.dragGroup.length - 1; i++) {
                        const card = this.dragGroup[i];
                        card.move(draggableCard.x, draggableCard.getOverlapPoint.y);
                        card.draw();
                    }
                }   
            }

        })

        this.ctx.canvas.addEventListener('mouseup', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const draggableCard = this.moveableCards.find(x => x.isDragging);
            if (draggableCard) {
                let returnToOrginalLocation = true;
                this.finishingGroups.forEach(group => {
                    if (this.ctx.isPointInPath(group.path, event.offsetX, event.offsetY)) {
                        if (group.canCardBePlacedFinal(draggableCard)) {
                            draggableCard.parent.remove();
                            group.add(draggableCard);
                            draggableCard.x = group.x;
                            draggableCard.y = group.y;
                            returnToOrginalLocation = false;
                            if (draggableCard.Id == this.deck.displayCard?.Id) {
                                this.deck.displayCard = undefined;
                            }
                        }
                    }
                })

                this.playingGroups.forEach(group => {
                    const pathToCheck = group.cards.length === 0 ? group.path : group.cards[group.cards.length - 1].path
                    if (this.ctx.isPointInPath(pathToCheck, event.offsetX, event.offsetY)) {
                        if (group.canCardBePlacedPlaying(draggableCard)) {
                            draggableCard.parent.remove();
                            group.add(draggableCard);
                            if (this.dragGroup.length > 1) {
                                for (let i = 1; i <= this.dragGroup.length - 1; i++) {
                                    const c = this.dragGroup[i];
                                    c.parent.remove();
                                    group.add(c);
                                }
                            }
                            returnToOrginalLocation = false;
                            if (draggableCard.Id == this.deck.displayCard?.Id) {
                                this.deck.displayCard = undefined;
                            }
                        }
                    }
                })

                if (returnToOrginalLocation) {
                    draggableCard.restorePrevious(); 
                    this.dragGroup.forEach(x => x.restorePrevious());
                }

                draggableCard.mouseUp();
                draggableCard.isDragging = false;
            }

            this.draw();

            this.moveableCards.forEach(x => x.isDragging = false);
            this.dragGroup = [];
        });
    }

}