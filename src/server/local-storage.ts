import {
  createGame,
  createPlayer,
  Game,
  gameFromJSON,
  jsonFromGame,
} from "../model";
import { Server } from "./server";

const local = (id: string, onUpdate: (game: Game) => void) => {
  const storageKey = `penny-stock.${id}`;

  const stroageUpdate = (event: StorageEvent) => {
    if (event.newValue != null) {
      onUpdate(gameFromJSON(JSON.parse(event.newValue)));
    }
  };

  window.addEventListener("storage", stroageUpdate);

  const update = (game: Game) => {
    const json = jsonFromGame(game);
    localStorage.setItem(storageKey, JSON.stringify(json));
    onUpdate(game);
  };

  const json = localStorage.getItem(storageKey);
  const game = json != null ? gameFromJSON(JSON.parse(json)) : null;

  return {
    game: game,
    update: update,
    cleanup: () => {
      window.removeEventListener("storage", stroageUpdate);
    },
  };
};

export const server: Server = {
  create: (name, onUpdate) => {
    return new Promise((resolve, rejects) => {
      const gameId = Math.floor(Math.random() * 101);
      const playerId = Math.floor(Math.random() * 101);

      const me = createPlayer(`${playerId}`, name);
      const game = createGame(`${gameId}`, [me]);

      const storage = local(game.id, onUpdate);

      storage.update(game);

      resolve({
        me: me,
        game: game,
        update: storage.update,
        cleanup: storage.cleanup,
      });
    });
  },
  join: (id, name, onUpdate) => {
    return new Promise((resolve, rejects) => {
      const storage = local(id, onUpdate);

      if (storage.game == null) {
        rejects("NO GAME");
      } else {
        const playerId = Math.floor(Math.random() * 101);

        const me = createPlayer(`${playerId}`, name);
        const game = storage.game.addPlayer(me);

        storage.update(game);

        resolve({
          me: me,
          game: game,
          update: storage.update,
          cleanup: storage.cleanup,
        });
      }
    });
  },
};
