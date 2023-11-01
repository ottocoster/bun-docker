import { sortCards } from "../round/setWinner";

export function deal(cards: string[]): {
  playerEast: string[];
  playerNorth: string[];
  playerWest: string[];
  playerSouth: string[];
} {
  if (!cards) {
    throw new Error("No cards provided");
  }

  const cuttingPosition = Math.floor(Math.random() * (4 + 1));

  // Cut cards
  const cutCards = cards
    .slice(cuttingPosition * 13)
    .concat(cards.slice(0, cuttingPosition * 13));

  // Dealing 7-6
  const playerWestDeal = cutCards.slice(0, 7).concat(cutCards.slice(28, 34));
  const playerNorthDeal = cutCards.slice(7, 14).concat(cutCards.slice(34, 40));
  const playerEastDeal = cutCards.slice(14, 21).concat(cutCards.slice(40, 46));
  const playerSouthDeal = cutCards.slice(21, 28).concat(cutCards.slice(46, 52));

  return {
    playerWest: sortCards(playerWestDeal),
    playerNorth: sortCards(playerNorthDeal),
    playerEast: sortCards(playerEastDeal),
    playerSouth: sortCards(playerSouthDeal),
  };
}
