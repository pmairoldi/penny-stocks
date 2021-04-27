import { Game, Player } from "../model";

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

export interface Server {
  create: Create;
  join: Join;
}
