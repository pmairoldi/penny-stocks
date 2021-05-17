import { ActionDTO, GameDTO, PlayerDTO } from "../server/dto";

export interface Session {
  me: PlayerDTO;
  game: GameDTO;
  update: (action: ActionDTO) => void;
  cleanup: () => void;
}

export type Create = (
  name: string,
  onUpdate: (game: GameDTO) => void
) => Promise<Session>;

export type Join = (
  gameId: string,
  name: string,
  onUpdate: (game: GameDTO) => void
) => Promise<Session>;

export interface Server {
  create: Create;
  join: Join;
}
