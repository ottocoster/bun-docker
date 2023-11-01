import { cardsList } from "../shared/cardsList";

export function setWinnerOfSingleColor(
  cards: { card: string; player: string; winner?: boolean | undefined }[]
) {
  const sortedCards = sortSingleColor(cards);

  const winnerIndex = cards.findIndex(
    (card) => card === sortedCards[sortedCards.length - 1]
  );
  cards[winnerIndex].winner = true;

  return cards;
}

export function setWinnerOfMultiColor(
  cards: { card: string; player: string; winner?: boolean | undefined }[]
) {
  const unifiedPlayerCards = cards
    .slice(0)
    .map((playerCard) => playerCard.card.slice(0, 1) + "h")
    .filter(onlyUnique);

  const sortedUnifiedPlayerCards = sortCards(unifiedPlayerCards).reverse();

  const highest = cards.find((playerCard) => {
    if (!playerCard) {
      return false;
    } else {
      return sortedUnifiedPlayerCards.find(
        (sortedUnifiedPlayerCard) =>
          playerCard.card.slice(0, 1) === sortedUnifiedPlayerCard.slice(0, 1)
      );
    }
  });

  if (highest) {
    const winnerIndex = cards.findIndex((card) => card === highest);
    cards[winnerIndex].winner = true;
  }

  return cards;
}

export function sortSingleColor(
  playerCards: { card: string; player: string }[]
) {
  const sortedCards = [{ card: "", player: "" }];

  playerCards.forEach((entry) => {
    const cardIndex = cardsList.findIndex((card) => card === entry.card);
    sortedCards[cardIndex] = entry;
  });

  return sortedCards;
}

export function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

export function sortCards(playerCards: string[]): string[] {
  const sortedCards = playerCards.slice(0);

  sortedCards.sort((a, b) => {
    return (
      cardsList.findIndex((card) => card === a) -
      cardsList.findIndex((card) => card === b)
    );
  });

  return sortedCards;
}
