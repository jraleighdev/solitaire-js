import { Card } from "~/models/Card";

export interface CardParentBase {
    add(card: Card): void;
    remove(): Card | undefined;
    getCardsBelow(card: Card): Card[];
    getCardsAbove(card: Card): Card[];
}