import { Game, GameDTO, gameFromJSON, jsonFromGame, Player } from "../model";

export interface Session {
  me: Player;
  game: Game;
  update: (game: Game) => void;
  cleanup: () => void;
}

export type Create = (
  name: string,
  onUpdate: (game: Game) => void
) => Promise<Session>;

export type Join = (
  gameId: string,
  name: string,
  onUpdate: (game: Game) => void
) => Promise<Session>;

export function parseGame(json: string): Game {
  return gameFromJSON(JSON.parse(json));
}

export function mapGame(game: Game): GameDTO {
  return jsonFromGame(game);
}

export interface Server {
  create: Create;
  join: Join;
}
