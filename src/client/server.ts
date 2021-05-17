import { Action, Game, Player } from "../server/model";

export interface Session {
  me: Player;
  game: Game;
  update: (action: Action) => void;
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

export interface Server {
  create: Create;
  join: Join;
}
