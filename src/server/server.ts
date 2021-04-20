import {
  createGame,
  createPlayer,
  Game,
  GameDTO,
  gameFromJSON,
  jsonFromGame,
} from "../model";

export interface Server {
  game: Game;
  update: (game: Game) => void;
  clear: () => void;
}

export type Connect = (
  gameId: string,
  onUpdate: (game: Game) => void
) => { server: Server; cleanup: () => void };

export function parseGame(json: string | null): Game {
  const game =
    json == null
      ? createGame([
          createPlayer("test-1", "Test User 1"),
          createPlayer("test-2", "Test User 2"),
        ])
      : gameFromJSON(JSON.parse(json));

  return game;
}

export function mapGame(game: Game): GameDTO {
  return jsonFromGame(game);
}
