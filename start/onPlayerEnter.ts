import { cardsList } from "../shared/cardsList";
import { deal } from "./deal";
import { shuffle } from "./shuffle";

interface Player {
  playerName: string;
  username: string;
  position?: "playerWest" | "playerNorth" | "playerEast" | "playerSouth";
  score?: number;
  cards?: string[];
}

export interface GameState {
  players: Player[];
}

function initGame(playerNames: string[], usernames: string[]): GameState {
  const players: Player[] = [
    {
      playerName: playerNames[0],
      username: usernames[0],
      position: "playerWest",
      score: 0,
      cards: [],
    },
    {
      playerName: playerNames[1],
      username: usernames[1],
      position: "playerNorth",
      score: 0,
      cards: [],
    },
    {
      playerName: playerNames[2],
      username: usernames[2],
      position: "playerEast",
      score: 0,
      cards: [],
    },
    {
      playerName: playerNames[3],
      username: usernames[3],
      position: "playerSouth",
      score: 0,
      cards: [],
    },
  ];
  return { players };
}

interface Lobby {
  players: Player[];
}

const lobby: Lobby = {
  players: [],
};

export function onPlayerEnter(player: Player) {
  // Add the player to the lobby
  lobby.players.push(player);

  // If there are four players in the lobby, start a new game
  if (lobby.players.length === 4) {
    const playerNames = lobby.players.map((player) => player.playerName);
    const usernames = lobby.players.map((player) => player.username);
    const gameState = initGame(playerNames, usernames);

    // Assign positions to players
    gameState.players[0].position = "playerWest";
    gameState.players[1].position = "playerNorth";
    gameState.players[2].position = "playerEast";
    gameState.players[3].position = "playerSouth";

    const shuffledCards = shuffle(cardsList);
    const initialDeal = deal(shuffledCards);

    // Assign the players from the lobby to the game
    for (let i = 0; i < 4; i++) {
      const position = gameState.players[i].position;

      if (position) {
        gameState.players[i].cards = initialDeal[position];
      }

      gameState.players[i].score = lobby.players[i].score;
    }

    // Clear the lobby
    lobby.players = [];

    return gameState;
  } else {
    return lobby.players;
  }
}
