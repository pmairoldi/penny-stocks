import { createGame, createPlayer, Game, gameFromJSON } from "../model";

export interface Server {
  game: Game;
  update: (game: Game) => void;
  clear: () => void;
}

function parseGame(json: string | null): Game {
  const game =
    json == null
      ? createGame([
          createPlayer("test-1", "Test User 1"),
          createPlayer("test-2", "Test User 2"),
        ])
      : gameFromJSON(JSON.parse(json));

  return game;
}

export function connect(
  gameId: string,
  onUpdate: (game: Game) => void
): { server: Server; cleanup: () => void } {
  const storageKey = `penny-stock.${gameId}`;

  const json = localStorage.getItem(storageKey);
  const game = parseGame(json);

  const stroageUpdate = (event: StorageEvent) => {
    if (event.newValue != null) {
      onUpdate(parseGame(event.newValue));
    }
  };

  window.addEventListener("storage", stroageUpdate);

  const update = (game: Game) => {
    const { state } = game;
    const { board, prices, players, markers, turn } = state;

    const json = {
      board: board.state,
      prices: prices.state,
      players: players,
      markers: markers,
      turn: turn.state,
    };

    localStorage.setItem(storageKey, JSON.stringify(json));

    onUpdate(game);
  };

  const clear = () => {
    update(parseGame(null));
  };

  return {
    server: {
      game: game,
      update: update,
      clear: clear,
    },
    cleanup: () => {
      window.removeEventListener("storage", stroageUpdate);
    },
  };
}
