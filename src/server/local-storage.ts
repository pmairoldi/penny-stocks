import { Game } from "../model";
import { Connect, mapGame, parseGame } from "./server";

export const connect: Connect = (gameId, onUpdate) => {
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
    const json = mapGame(game);

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
};
